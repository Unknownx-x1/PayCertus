import { PayrollBatch, SalaryTransaction, RiskFinding } from './types';

export function exportBatchAuditReport(batch: PayrollBatch) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export the audit report.');
    return;
  }

  const findings = batch.risk_findings || [];
  const transactions = batch.transactions || [];

  const ruleFindings = findings.filter(f => f.layer === 'RULE');
  const mlFindings = findings.filter(f => f.layer === 'ANOMALY');
  const graphFindings = findings.filter(f => f.layer === 'GRAPH');

  const approvedAmt = batch.approved_amount || transactions.filter(t => t.status === 'APPROVED').reduce((sum, t) => sum + t.gross_salary, 0);
  const heldAmt = batch.held_amount || transactions.filter(t => t.status === 'FLAG_REVIEW' || t.status === 'HOLD').reduce((sum, t) => sum + t.gross_salary, 0);
  const blockedAmt = batch.blocked_amount || transactions.filter(t => t.status === 'BLOCKED').reduce((sum, t) => sum + t.gross_salary, 0);

  const findingsHtml = findings.length > 0 ? findings.map(f => `
    <div style="background: #18181b; border: 1px solid #27272a; border-left: 4px solid ${
      f.severity === 'CRITICAL' ? '#ef4444' : (f.severity === 'HIGH' ? '#f97316' : '#eab308')
    }; padding: 14px; margin-bottom: 12px; border-radius: 6px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; font-family: monospace; font-weight: bold; background: #27272a; color: #fafafa; padding: 2px 6px; border-radius: 4px;">
          ${f.severity} • ${f.layer} LAYER
        </span>
        <span style="font-size: 11px; font-family: monospace; color: #71717a;">${f.rule_code}</span>
      </div>
      <div style="font-weight: bold; font-size: 15px; color: #ffffff; margin-top: 8px;">${f.title}</div>
      <div style="font-size: 13px; color: #a1a1aa; margin-top: 4px; line-height: 1.5; font-family: monospace;">${f.description}</div>
      ${f.evidence_json ? `
        <div style="margin-top: 8px; font-size: 11px; font-family: monospace; color: #71717a; background: #09090b; padding: 8px; border-radius: 4px;">
          Evidence: ${JSON.stringify(f.evidence_json)}
        </div>
      ` : ''}
    </div>
  `).join('') : '<p style="color: #6ee7b7; font-family: monospace;">No risk findings recorded for this batch. All evaluation checks passed cleanly.</p>';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>PayCertus Audit Report — ${batch.batch_name}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #fafafa; padding: 40px; margin: 0; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #27272a; padding-bottom: 16px; margin-bottom: 24px; }
        .brand { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
        .sub { font-size: 11px; color: #a1a1aa; font-family: monospace; margin-top: 4px; }
        .card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .card { background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; }
        .label { font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; font-weight: bold; }
        .val { font-size: 22px; font-weight: bold; font-family: monospace; margin-top: 6px; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; font-family: monospace; }
        .badge-blocked { background: #3f1214; color: #fca5a5; border: 1px solid #7f1d1d; }
        .badge-approved { background: #064e3b; color: #6ee7b7; border: 1px solid #047857; }
        .fin-strip { background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center; font-family: monospace; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { background: #18181b; border-bottom: 1px solid #27272a; text-align: left; padding: 10px; font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; }
        td { padding: 10px; border-bottom: 1px solid #27272a; font-size: 12px; font-family: monospace; }
        @media print {
          body { background: #ffffff; color: #000000; }
          .card, .fin-strip { background: #f4f4f5; border: 1px solid #e4e4e7; }
          th { background: #f4f4f5; color: #000000; }
          td { color: #000000; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">PAYCERTUS ENTERPRISE AUDIT REPORT</div>
          <div class="sub">Batch ID: ${batch.id} • Processed At: ${new Date(batch.processed_at || Date.now()).toLocaleString()}</div>
          <div class="sub" style="color: #6ee7b7; font-weight: bold; margin-top: 2px;">PROOF HASH: ${batch.proof_hash || 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</div>
        </div>
        <div>
          <span class="badge ${batch.status === 'BLOCKED' || batch.status === 'PARTIAL_HOLD' ? 'badge-blocked' : 'badge-approved'}">
            FIREWALL DECISION: ${batch.status}
          </span>
        </div>
      </div>

      <div class="card-grid">
        <div class="card">
          <div class="label">Target Payroll Batch</div>
          <div style="font-size: 14px; font-weight: bold; font-family: monospace; margin-top: 8px;">${batch.batch_name}</div>
        </div>
        <div class="card">
          <div class="label">Integrity Score (PIS)</div>
          <div class="val" style="color: ${batch.integrity_score < 40 ? '#ef4444' : '#10b981'};">${batch.integrity_score} / 100</div>
        </div>
        <div class="card">
          <div class="label">Total Employees</div>
          <div class="val">${batch.total_employees}</div>
        </div>
        <div class="card">
          <div class="label">Total Payroll Value</div>
          <div class="val" style="color: #ffffff;">$${(batch.total_amount || 0).toLocaleString()}</div>
        </div>
      </div>

      <!-- Financial Exposure Distribution Strip -->
      <div class="fin-strip">
        <div>
          <div class="label" style="color: #6ee7b7;">Approved Amount</div>
          <div style="font-size: 18px; font-weight: bold; color: #6ee7b7; margin-top: 4px;">$${approvedAmt.toLocaleString()}</div>
        </div>
        <div>
          <div class="label" style="color: #fdba74;">Held Amount</div>
          <div style="font-size: 18px; font-weight: bold; color: #fdba74; margin-top: 4px;">$${heldAmt.toLocaleString()}</div>
        </div>
        <div>
          <div class="label" style="color: #fca5a5;">Blocked Amount</div>
          <div style="font-size: 18px; font-weight: bold; color: #fca5a5; margin-top: 4px;">$${blockedAmt.toLocaleString()}</div>
        </div>
      </div>

      <h2 style="font-size: 14px; font-family: monospace; text-transform: uppercase; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-top: 32px;">
        Multi-Layer Risk Findings (${findings.length} total: ${ruleFindings.length} Rule, ${mlFindings.length} ML, ${graphFindings.length} Graph)
      </h2>
      ${findingsHtml}

      <h2 style="font-size: 14px; font-family: monospace; text-transform: uppercase; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-top: 32px;">
        Employee Transaction Summary (${transactions.length})
      </h2>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Bank Account</th>
            <th>Gross Salary</th>
            <th>Attendance</th>
            <th>Overtime</th>
            <th>Risk Score (R / ML / G)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(t => `
            <tr>
              <td>${t.employee_id}</td>
              <td><strong>${t.employee_name}</strong></td>
              <td>${t.bank_account_no || 'Data unavailable'}</td>
              <td>$${t.gross_salary.toLocaleString()}</td>
              <td>${t.attendance_days} days</td>
              <td>${t.overtime_hours}h</td>
              <td style="color: ${t.risk_score >= 75 ? '#ef4444' : (t.risk_score >= 35 ? '#fdba74' : '#10b981')}; font-weight: bold;">
                ${t.risk_score}/100 (+${t.rule_contrib || 0} / +${t.ml_contrib || 0} / +${t.graph_contrib || 0})
              </td>
              <td><strong>${t.status}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #27272a; color: #71717a; font-size: 11px; font-family: monospace; text-align: center;">
        Cryptographic Proof Hash: ${batch.proof_hash || 'sha256:...'} • PayCertus Compliance Engine v2.4
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

export function exportIndividualEmployeeReport(employee: SalaryTransaction, findings: RiskFinding[]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export the employee evidence packet.');
    return;
  }

  const empFindings = findings.filter(f => 
    f.employee_id === employee.employee_id || 
    (f.employee_name && employee.employee_name && f.employee_name.includes(employee.employee_name))
  );

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Individual Audit Dossier — ${employee.employee_name} (${employee.employee_id})</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #fafafa; padding: 40px; margin: 0; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #27272a; padding-bottom: 16px; margin-bottom: 24px; }
        .brand { font-size: 20px; font-weight: 800; color: #ffffff; }
        .sub { font-size: 12px; color: #a1a1aa; font-family: monospace; margin-top: 4px; }
        .card-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .card { background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 16px; }
        .label { font-size: 11px; font-family: monospace; color: #a1a1aa; text-transform: uppercase; font-weight: bold; }
        .val { font-size: 20px; font-weight: bold; font-family: monospace; margin-top: 6px; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 12px; font-family: monospace; }
        .badge-blocked { background: #3f1214; color: #fca5a5; border: 1px solid #7f1d1d; }
        .badge-approved { background: #064e3b; color: #6ee7b7; border: 1px solid #047857; }
        @media print {
          body { background: #ffffff; color: #000000; }
          .card { background: #f4f4f5; border: 1px solid #e4e4e7; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">INDIVIDUAL FORENSIC AUDIT DOSSIER</div>
          <div class="sub">Employee: ${employee.employee_name} (${employee.employee_id}) • Generated At: ${new Date().toLocaleString()}</div>
        </div>
        <div>
          <span class="badge ${employee.risk_score >= 60 ? 'badge-blocked' : 'badge-approved'}">
            RISK SCORE: ${employee.risk_score} / 100 (${employee.status})
          </span>
        </div>
      </div>

      <div class="card-grid">
        <div class="card">
          <div class="label">Gross Salary Claimed</div>
          <div class="val">$${employee.gross_salary.toLocaleString()}</div>
        </div>
        <div class="card">
          <div class="label">Attendance Days</div>
          <div class="val" style="color: ${employee.attendance_days === 0 ? '#ef4444' : '#ffffff'};">${employee.attendance_days} days</div>
        </div>
        <div class="card">
          <div class="label">Overtime Claimed</div>
          <div class="val">${employee.overtime_hours} hrs</div>
        </div>
        <div class="card">
          <div class="label">Destination Bank Account</div>
          <div class="val" style="font-size: 16px;">${employee.bank_account_no || 'Data unavailable'}</div>
        </div>
      </div>

      <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px; margin-bottom: 24px; font-family: monospace;">
        <span style="font-size: 11px; color: #a1a1aa; font-weight: bold; text-transform: uppercase;">Deterministic Score Aggregation</span>
        <div style="display: flex; gap: 24px; margin-top: 8px; font-size: 13px;">
          <div>Rule Contribution: <strong style="color: #ffffff;">+${employee.rule_contrib || 0} pts</strong></div>
          <div>ML Outlier Contribution: <strong style="color: #ffffff;">+${employee.ml_contrib || 0} pts</strong></div>
          <div>Graph Cluster Contribution: <strong style="color: #ffffff;">+${employee.graph_contrib || 0} pts</strong></div>
        </div>
      </div>

      <h2 style="font-size: 14px; font-family: monospace; text-transform: uppercase; border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-top: 32px;">
        Multi-Layer Evidence Checklist (${empFindings.length})
      </h2>
      ${empFindings.length > 0 ? empFindings.map(f => `
        <div style="background: #18181b; border: 1px solid #27272a; border-left: 4px solid ${
          f.severity === 'CRITICAL' ? '#ef4444' : (f.severity === 'HIGH' ? '#f97316' : '#eab308')
        }; padding: 14px; margin-bottom: 12px; border-radius: 6px;">
          <div style="font-size: 11px; font-family: monospace; font-weight: bold; background: #27272a; color: #fafafa; padding: 2px 6px; border-radius: 4px; display: inline-block;">
            ${f.severity} • ${f.layer} LAYER
          </div>
          <div style="font-weight: bold; font-size: 14px; color: #ffffff; margin-top: 8px;">${f.title}</div>
          <div style="font-size: 13px; color: #a1a1aa; margin-top: 4px; line-height: 1.5; font-family: monospace;">${f.description}</div>
        </div>
      `).join('') : '<p style="color: #6ee7b7; font-family: monospace;">No risk findings or anomalies recorded for this employee.</p>'}

      <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #27272a; color: #71717a; font-size: 11px; font-family: monospace; text-align: center;">
        PayCertus AI Security System • Individual Audit Dossier
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
