'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchBatches } from '@/lib/api';
import { PayrollBatch, SalaryTransaction, RiskFinding } from '@/lib/types';
import { exportIndividualEmployeeReport } from '@/lib/exportReport';
import { Search, Sparkles, ShieldAlert, ShieldCheck, User, CreditCard, Clock, Calendar, ArrowRight, FileText, CheckCircle2, Cpu, FileSpreadsheet, Network, Sliders } from 'lucide-react';

function InvestigationContent() {
  const searchParams = useSearchParams();
  const targetEmpId = searchParams.get('emp');
  const targetBatchId = searchParams.get('batch');

  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string>('');

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    const data = await fetchBatches();
    setBatches(data);
    
    if (data.length > 0) {
      const activeId = targetBatchId && data.some(b => b.id === targetBatchId) ? targetBatchId : data[0].id;
      setSelectedBatchId(activeId);
      
      const b = data.find(batch => batch.id === activeId) || data[0];
      if (b.transactions && b.transactions.length > 0) {
        const empTarget = targetEmpId && b.transactions.some(t => t.employee_id === targetEmpId)
          ? targetEmpId
          : b.transactions[0].employee_id;
        setSelectedEmpId(empTarget);
      }
    }
  }

  const activeBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const transactions = activeBatch?.transactions || [];
  const findings = activeBatch?.risk_findings || [];

  const activeEmp = transactions.find(t => t.employee_id === selectedEmpId) || transactions[0];

  const ruleFindings = findings.filter(f => f.layer === 'RULE' && (f.employee_id === selectedEmpId || (activeEmp && f.employee_name?.includes(activeEmp.employee_name))));
  const crossSignalFindings = findings.filter(f => f.layer === 'CROSS_SIGNAL' && (f.employee_id === selectedEmpId || (activeEmp && f.employee_name?.includes(activeEmp.employee_name))));
  const mlFindings = findings.filter(f => f.layer === 'ANOMALY' && (f.employee_id === selectedEmpId || (activeEmp && f.employee_name?.includes(activeEmp.employee_name))));
  const graphFindings = findings.filter(f => f.layer === 'GRAPH' && (f.employee_id === selectedEmpId || (activeEmp && f.employee_name?.includes(activeEmp.employee_name))));

  return (
    <div className="space-y-5 max-w-7xl mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
            <Search className="w-4 h-4 text-white" /> AI Investigation Hub & Forensic Evidence Dossier
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Deep-dive 5-layer forensic breakdown: Rule Engine, Statistical ML, Trust Graph, and Risk Scoring</p>
        </div>

        {/* Batch Selector */}
        <select
          value={selectedBatchId}
          onChange={(e) => {
            setSelectedBatchId(e.target.value);
            const b = batches.find(batch => batch.id === e.target.value);
            if (b && b.transactions && b.transactions.length > 0) {
              setSelectedEmpId(b.transactions[0].employee_id);
            }
          }}
          className="bg-[#18181b] border border-[#27272a] text-white text-xs font-mono font-semibold rounded px-3 py-2 outline-none focus:border-white"
        >
          {batches.map(b => (
            <option key={b.id} value={b.id}>
              {b.batch_name}
            </option>
          ))}
        </select>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Employee List */}
        <div className="enterprise-card p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-[#27272a] pb-2.5">
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Batch Transactions ({transactions.length})
            </h2>
            <span className="text-[10px] font-mono text-[#a1a1aa]">Select employee</span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {transactions.map((tx) => {
              const isSelected = tx.employee_id === selectedEmpId;
              const isCritical = tx.risk_score >= 75;
              const isHigh = tx.risk_score >= 60;

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedEmpId(tx.employee_id)}
                  className={`p-3 rounded border cursor-pointer transition-colors ${
                    isSelected ? 'bg-white text-black border-white font-bold' : 'bg-[#09090b] border-[#27272a] text-white hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-xs">{tx.employee_name}</div>
                      <div className={`text-[10px] font-mono ${isSelected ? 'text-[#3f3f46]' : 'text-[#a1a1aa]'}`}>
                        ID: {tx.employee_id} {tx.bank_account_no ? `• ${tx.bank_account_no}` : ''}
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border ${
                      isCritical
                        ? 'bg-[#3f1214] text-[#fca5a5] border-[#7f1d1d]'
                        : (isHigh ? 'bg-[#451a03] text-[#fdba74] border-[#9a3412]' : (isSelected ? 'bg-[#27272a] text-black border-[#3f3f46]' : 'bg-[#064e3b] text-[#6ee7b7] border-[#047857]'))
                    }`}>
                      Risk: {tx.risk_score}/100
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5-Layer Forensic Evidence Inspector */}
        <div className="lg:col-span-2 space-y-5">
          {activeEmp ? (
            <>
              {/* Employee Header Banner */}
              <div className="enterprise-card p-5 border-l-4 border-l-white space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#27272a] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#a1a1aa] uppercase tracking-wider">Target Forensic Dossier</span>
                    <h2 className="text-lg font-extrabold text-white mt-0.5 font-mono">{activeEmp.employee_name}</h2>
                    <div className="text-xs font-mono text-[#a1a1aa] mt-0.5">
                      ID: <strong className="text-white">{activeEmp.employee_id}</strong> • Bank Account: <strong className="text-white">{activeEmp.bank_account_no || 'Data unavailable'}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#a1a1aa] uppercase font-bold">Firewall Decision</span>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded text-xs font-mono font-extrabold border ${
                        activeEmp.status === 'BLOCKED'
                          ? 'bg-[#3f1214] text-[#fca5a5] border-[#7f1d1d]'
                          : (activeEmp.status === 'HOLD' ? 'bg-[#451a03] text-[#fdba74] border-[#9a3412]' : 'bg-[#064e3b] text-[#6ee7b7] border-[#047857]')
                      }`}>
                        {activeEmp.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Layer 4: Deterministic Risk Contribution Breakdown Bar */}
                <div className="p-3.5 rounded bg-[#09090b] border border-[#27272a] space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#a1a1aa] font-bold uppercase">Layer 4: Risk Aggregation Breakdown</span>
                    <span className="text-white font-bold">Final Employee Risk Score: <span className="text-red-400">{activeEmp.risk_score} / 100</span></span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div className="p-2 rounded bg-[#18181b] border border-[#27272a] text-center">
                      <span className="text-[#a1a1aa] block text-[9px] uppercase font-bold">Rule Points</span>
                      <span className="font-bold text-white">+{activeEmp.rule_contrib || 0} pts</span>
                    </div>
                    <div className="p-2 rounded bg-[#18181b] border border-[#27272a] text-center">
                      <span className="text-[#a1a1aa] block text-[9px] uppercase font-bold">ML Outlier Points</span>
                      <span className="font-bold text-white">+{activeEmp.ml_contrib || 0} pts</span>
                    </div>
                    <div className="p-2 rounded bg-[#18181b] border border-[#27272a] text-center">
                      <span className="text-[#a1a1aa] block text-[9px] uppercase font-bold">Graph Cluster Points</span>
                      <span className="font-bold text-white">+{activeEmp.graph_contrib || 0} pts</span>
                    </div>
                  </div>
                </div>

                {/* Financial Parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
                    <span className="text-[10px] text-[#a1a1aa] uppercase font-semibold">Gross Salary</span>
                    <p className="text-sm font-bold text-white mt-0.5">${activeEmp.gross_salary.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
                    <span className="text-[10px] text-[#a1a1aa] uppercase font-semibold">Overtime</span>
                    <p className="text-sm font-bold text-white mt-0.5">{activeEmp.overtime_hours} hrs</p>
                  </div>
                  <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
                    <span className="text-[10px] text-[#a1a1aa] uppercase font-semibold">Attendance</span>
                    <p className={`text-sm font-bold mt-0.5 ${activeEmp.attendance_days === 0 ? 'text-[#fca5a5]' : 'text-white'}`}>
                      {activeEmp.attendance_days} days
                    </p>
                  </div>
                  <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
                    <span className="text-[10px] text-[#a1a1aa] uppercase font-semibold">Bank Account</span>
                    <p className="text-sm font-bold text-white mt-0.5">{activeEmp.bank_account_no || 'Data unavailable'}</p>
                  </div>
                </div>
              </div>

              {/* Layer 1: Rule Engine Findings */}
              <div className="enterprise-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider border-b border-[#27272a] pb-3">
                  <FileSpreadsheet className="w-4 h-4 text-white" /> Layer 1 — Deterministic Rule Engine
                </div>

                {ruleFindings.length > 0 ? (
                  <div className="space-y-2">
                    {ruleFindings.map((f) => (
                      <div key={f.id} className="p-3.5 rounded bg-[#09090b] border border-[#27272a] space-y-1">
                        <div className="flex justify-between items-center font-mono">
                          <span className="text-[10px] font-bold bg-[#3f1214] text-[#fca5a5] border border-[#7f1d1d] px-2 py-0.5 rounded">
                            {f.severity} • {f.rule_code}
                          </span>
                          <span className="text-[10px] text-[#71717a]">Rule Violation</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1">{f.title}</h4>
                        <p className="text-xs text-[#a1a1aa] font-mono leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6ee7b7] font-mono p-3 bg-[#09090b] border border-[#27272a] rounded">
                    ✓ No deterministic policy violations detected.
                  </div>
                )}
              </div>

              {/* Layer 2: Statistical ML Engine (ANOMALY ≠ FRAUD) */}
              <div className="enterprise-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider">
                    <Cpu className="w-4 h-4 text-white" /> Layer 2 — Statistical ML Outlier Engine
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#a1a1aa] bg-[#27272a] px-2 py-0.5 rounded">
                    Core Principle: ANOMALY ≠ FRAUD
                  </span>
                </div>

                {mlFindings.length > 0 ? (
                  <div className="space-y-2 font-mono">
                    {mlFindings.map((f) => (
                      <div key={f.id} className="p-3.5 rounded bg-[#09090b] border border-[#27272a] space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white">{f.title}</span>
                          <span className="text-[10px] bg-[#27272a] text-white px-2 py-0.5 rounded border border-[#3f3f46]">
                            Model: {f.evidence_json?.model || 'Isolation Forest'}
                          </span>
                        </div>

                        <p className="text-xs text-[#a1a1aa] leading-relaxed">{f.description}</p>

                        {f.evidence_json?.major_deviations && (
                          <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] space-y-1 text-[11px]">
                            <span className="text-[#a1a1aa] font-bold uppercase block text-[9px]">Calculated Baseline Deviations</span>
                            {f.evidence_json.major_deviations.map((dev: string, i: number) => (
                              <div key={i} className="text-white flex items-center gap-1.5">
                                <span className="text-red-400">•</span> {dev}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6ee7b7] font-mono p-3 bg-[#09090b] border border-[#27272a] rounded">
                    ✓ Feature values conform to standard population baselines. No multivariate ML anomaly detected.
                  </div>
                )}
              </div>

              {/* Layer 3: Trust Graph Engine */}
              <div className="enterprise-card p-5 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider border-b border-[#27272a] pb-3">
                  <Network className="w-4 h-4 text-white" /> Layer 3 — Enterprise Trust Graph Topology
                </div>

                {graphFindings.length > 0 ? (
                  <div className="space-y-2 font-mono">
                    {graphFindings.map((f) => (
                      <div key={f.id} className="p-3.5 rounded bg-[#3f1214] border border-[#7f1d1d] text-[#fca5a5] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold bg-[#5c1d20] text-white px-2 py-0.5 rounded">
                            CRITICAL CLUSTER DETECTED
                          </span>
                          <span className="text-[10px]">{f.rule_code}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1">{f.title}</h4>
                        <p className="text-xs leading-relaxed text-[#fca5a5]">{f.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#6ee7b7] font-mono p-3 bg-[#09090b] border border-[#27272a] rounded">
                    ✓ Unique payment destination. No shared infrastructure or fraud cluster relationship detected.
                  </div>
                )}
              </div>

              {/* Auditor Action Toolbar */}
              <div className="enterprise-card p-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActionSuccess(`Individual payment for ${activeEmp.employee_name} placed on HOLD.`)}
                  className="btn-solid-secondary"
                >
                  Hold Payment
                </button>
                <button
                  onClick={() => exportIndividualEmployeeReport(activeEmp, findings)}
                  className="btn-solid-primary"
                >
                  <FileText className="w-3.5 h-3.5" /> Export Individual Evidence Packet
                </button>

                {actionSuccess && (
                  <span className="text-xs font-mono font-semibold text-[#6ee7b7] flex items-center gap-1.5 ml-auto">
                    <CheckCircle2 className="w-4 h-4" /> {actionSuccess}
                  </span>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function InvestigationPage() {
  return (
    <Suspense fallback={<div className="text-white text-xs font-mono p-5">Loading Investigation Workspace...</div>}>
      <InvestigationContent />
    </Suspense>
  );
}
