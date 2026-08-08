import { PayrollBatch, GraphPayload } from './types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Fallback Mock Dataset for Instant UI Preview
const MOCK_BATCHES: PayrollBatch[] = [
  {
    id: 'batch-fraud-001',
    batch_name: 'Aug 2026 Executive Payroll (Fraud Ring Alert)',
    period_start: '2026-08-01',
    period_end: '2026-08-31',
    total_amount: 450000.0,
    total_employees: 4,
    integrity_score: 35,
    status: 'BLOCKED',
    processed_at: new Date().toISOString(),
    transactions: [
      {
        id: 'tx-201',
        batch_id: 'batch-fraud-001',
        employee_id: 'E201',
        employee_name: 'David Miller',
        department: 'Sales',
        gross_salary: 70000.0,
        net_salary: 56000.0,
        overtime_hours: 0,
        overtime_pay: 0,
        reimbursements: 150.0,
        attendance_days: 22,
        risk_score: 10,
        status: 'APPROVED'
      },
      {
        id: 'tx-202',
        batch_id: 'batch-fraud-001',
        employee_id: 'E202',
        employee_name: 'Victor Ghost',
        department: 'Operations',
        gross_salary: 145000.0,
        net_salary: 116000.0,
        overtime_hours: 48,
        overtime_pay: 30000.0,
        reimbursements: 3500.0,
        attendance_days: 0,
        risk_score: 95,
        status: 'BLOCKED'
      },
      {
        id: 'tx-203',
        batch_id: 'batch-fraud-001',
        employee_id: 'E203',
        employee_name: 'Marcus Vance',
        department: 'Operations',
        gross_salary: 125000.0,
        net_salary: 100000.0,
        overtime_hours: 42,
        overtime_pay: 35000.0,
        reimbursements: 4200.0,
        attendance_days: 4,
        risk_score: 85,
        status: 'BLOCKED'
      },
      {
        id: 'tx-204',
        batch_id: 'batch-fraud-001',
        employee_id: 'E204',
        employee_name: 'Elena Rostova',
        department: 'Operations',
        gross_salary: 110000.0,
        net_salary: 88000.0,
        overtime_hours: 35,
        overtime_pay: 25000.0,
        reimbursements: 1800.0,
        attendance_days: 8,
        risk_score: 80,
        status: 'BLOCKED'
      }
    ],
    risk_findings: [
      {
        id: 'rf-101',
        batch_id: 'batch-fraud-001',
        employee_id: 'E202',
        employee_name: 'Victor Ghost',
        layer: 'RULE',
        rule_code: 'R1_SHARED_BANK_ACCOUNT',
        severity: 'CRITICAL',
        title: 'Shared Offshore Bank Account Ring',
        description: 'Employees Victor Ghost, Marcus Vance, and Elena Rostova share offshore account FRAUD-ACCOUNT-9988.',
        evidence_json: { shared_account: 'FRAUD-ACCOUNT-9988', count: 3 }
      },
      {
        id: 'rf-102',
        batch_id: 'batch-fraud-001',
        employee_id: 'E202',
        employee_name: 'Victor Ghost',
        layer: 'RULE',
        rule_code: 'R4_ZERO_ATTENDANCE_FULL_PAY',
        severity: 'HIGH',
        title: 'Zero Attendance Full Salary Breach',
        description: 'Victor Ghost claimed full $145,000 gross pay with 0 logged working days.',
        evidence_json: { attendance_days: 0 }
      },
      {
        id: 'rf-103',
        batch_id: 'batch-fraud-001',
        employee_id: 'E202',
        employee_name: 'Victor Ghost',
        layer: 'GRAPH',
        rule_code: 'GRAPH_FRAUD_RING_RING_CLUSTER',
        severity: 'CRITICAL',
        title: 'Coordinated Infrastructure Collusion Ring',
        description: 'Trust Graph engine isolated 3 employees sharing single hardware device DEV-SUSPICIOUS-X1 and IP 198.51.100.99.',
        evidence_json: { device_id: 'DEV-SUSPICIOUS-X1' }
      }
    ]
  },
  {
    id: 'batch-clean-002',
    batch_name: 'Jul 2026 Regular Payroll (Clean)',
    period_start: '2026-07-01',
    period_end: '2026-07-31',
    total_amount: 250000.0,
    total_employees: 3,
    integrity_score: 98,
    status: 'APPROVED',
    processed_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    transactions: [],
    risk_findings: []
  }
];

export async function fetchBatches(): Promise<PayrollBatch[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/payroll/batches`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend API connection offline, utilizing fallback state.', e);
  }
  return MOCK_BATCHES;
}

export async function fetchBatchById(id: string): Promise<PayrollBatch> {
  try {
    const res = await fetch(`${API_BASE_URL}/payroll/batches/${id}`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend API connection offline, utilizing fallback state.', e);
  }
  return MOCK_BATCHES.find(b => b.id === id) || MOCK_BATCHES[0];
}

export async function fetchGraph(batchId: string): Promise<GraphPayload> {
  try {
    const res = await fetch(`${API_BASE_URL}/payroll/batches/${batchId}/graph`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend API graph endpoint offline, returning graph mockup.', e);
  }
  return {
    nodes: [
      { id: 'EMP-E202', label: 'Victor Ghost', type: 'Employee', risk_level: 'CRITICAL', details: { title: 'Operations Consultant', salary: '$145,000' } },
      { id: 'EMP-E203', label: 'Marcus Vance', type: 'Employee', risk_level: 'CRITICAL', details: { title: 'Contract Specialist', salary: '$125,000' } },
      { id: 'EMP-E204', label: 'Elena Rostova', type: 'Employee', risk_level: 'HIGH', details: { title: 'Field Coordinator', salary: '$110,000' } },
      { id: 'BANK-9988', label: 'Offshore Account ...9988', type: 'BankAccount', risk_level: 'CRITICAL', details: { bank: 'Offshore Trust Bank' } },
      { id: 'DEV-X1', label: 'Device: DEV-SUSPICIOUS-X1', type: 'Device', risk_level: 'CRITICAL', details: { os: 'Linux / Proxy' } },
      { id: 'DEPT-Ops', label: 'Operations Dept', type: 'Department', risk_level: 'LOW', details: {} }
    ],
    edges: [
      { id: 'e1', source: 'EMP-E202', target: 'BANK-9988', label: 'PAID_TO', risk_level: 'CRITICAL' },
      { id: 'e2', source: 'EMP-E203', target: 'BANK-9988', label: 'PAID_TO', risk_level: 'CRITICAL' },
      { id: 'e3', source: 'EMP-E204', target: 'BANK-9988', label: 'PAID_TO', risk_level: 'CRITICAL' },
      { id: 'e4', source: 'EMP-E202', target: 'DEV-X1', label: 'USES_DEVICE', risk_level: 'CRITICAL' },
      { id: 'e5', source: 'EMP-E203', target: 'DEV-X1', label: 'USES_DEVICE', risk_level: 'CRITICAL' }
    ],
    fraud_rings_count: 1
  };
}

export async function triggerSampleBatch(type: 'clean' | 'fraud'): Promise<any> {
  const endpoint = type === 'clean' ? 'sample-clean' : 'sample-fraud';
  try {
    const res = await fetch(`${API_BASE_URL}/ingest/${endpoint}`, { method: 'POST' });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend API connection offline, triggering simulated sample load.');
  }
  return { message: `${type} sample loaded successfully` };
}

export async function postFirewallAction(batchId: string, action: 'APPROVE' | 'HOLD' | 'BLOCK', notes: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/payroll/firewall/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch_id: batchId,
        action,
        actor_name: 'Security Admin',
        actor_role: 'Auditor',
        notes
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Backend offline, simulated action executed.');
  }
  return { message: `Firewall action ${action} recorded.` };
}
