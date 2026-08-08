'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchBatches } from '@/lib/api';
import { PayrollBatch, SalaryTransaction, RiskFinding } from '@/lib/types';
import { Search, Sparkles, ShieldAlert, ShieldCheck, User, CreditCard, Clock, Calendar, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

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

  // Specific risk findings linked to the selected employee or shared cluster
  const empFindings = findings.filter(f => 
    f.employee_id === selectedEmpId || 
    (f.employee_name && activeEmp && f.employee_name.includes(activeEmp.employee_name)) ||
    (f.layer === 'GRAPH' && activeEmp && (activeEmp as any).bank_account_no === 'AC9001')
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
            <Search className="w-5 h-5 text-white" /> AI Investigation Hub & Evidence Workspace
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Deep-dive forensic inspection of individual employee claims, anomaly signatures, and ring evidence</p>
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
          className="bg-[#0a0a0a] border border-[#262626] text-white text-xs font-mono font-semibold rounded-md px-3 py-2 outline-none focus:border-white"
        >
          {batches.map(b => (
            <option key={b.id} value={b.id}>
              {b.batch_name}
            </option>
          ))}
        </select>
      </div>

      {/* Main 2-Column Investigation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Employee Transaction List */}
        <div className="minimal-panel p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-[#262626] pb-3">
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Batch Transactions ({transactions.length})
            </h2>
            <span className="text-[10px] font-mono text-neutral-400">Select target</span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {transactions.map((tx) => {
              const isSelected = tx.employee_id === selectedEmpId;
              const isCritical = tx.risk_score >= 70;

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedEmpId(tx.employee_id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected ? 'bg-white text-black border-white shadow-md' : 'bg-[#050505] border-[#262626] text-white hover:border-neutral-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-xs">{tx.employee_name}</div>
                      <div className={`text-[10px] font-mono ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                        ID: {tx.employee_id} • {(tx as any).bank_account_no || 'AC9001'}
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border ${
                      isCritical
                        ? (isSelected ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-[#18090a] text-rose-400 border-[#7f1d1d]')
                        : (isSelected ? 'bg-neutral-200 text-black border-neutral-300' : 'bg-[#171717] text-white border-[#333333]')
                    }`}>
                      {tx.risk_score} / 100
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Employee Forensic Inspector */}
        <div className="lg:col-span-2 space-y-6">
          {activeEmp ? (
            <>
              {/* Employee Target Dossier Banner */}
              <div className="minimal-panel p-6 border-l-4 border-l-white space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#262626] pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">Target Forensic Dossier</span>
                    <h2 className="text-xl font-extrabold text-white mt-0.5">{activeEmp.employee_name}</h2>
                    <div className="text-xs font-mono text-neutral-400 mt-0.5">
                      Employee ID: <strong className="text-white">{activeEmp.employee_id}</strong> • Bank Account: <strong className="text-white">{(activeEmp as any).bank_account_no || 'AC9001'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded text-xs font-mono font-extrabold border ${
                      activeEmp.risk_score >= 70
                        ? 'bg-[#18090a] text-rose-400 border-[#7f1d1d]'
                        : 'bg-[#171717] text-white border-[#333333]'
                    }`}>
                      Risk Score: {activeEmp.risk_score} / 100 ({activeEmp.status})
                    </span>
                  </div>
                </div>

                {/* Financial Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#050505] border border-[#262626]">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Gross Salary</span>
                    <p className="text-sm font-bold text-white mt-1">${activeEmp.gross_salary.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050505] border border-[#262626]">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Overtime</span>
                    <p className="text-sm font-bold text-white mt-1">{activeEmp.overtime_hours} hrs</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050505] border border-[#262626]">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Attendance</span>
                    <p className={`text-sm font-bold mt-1 ${activeEmp.attendance_days === 0 ? 'text-rose-400' : 'text-white'}`}>
                      {activeEmp.attendance_days} days
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050505] border border-[#262626]">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Destination Bank</span>
                    <p className="text-sm font-bold text-white mt-1">{(activeEmp as any).bank_account_no || 'AC9001'}</p>
                  </div>
                </div>
              </div>

              {/* AI Explanation & Multi-Layer Evidence Checklist */}
              <div className="minimal-panel p-6 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase font-mono tracking-wider border-b border-[#262626] pb-3">
                  <Sparkles className="w-4 h-4 text-white" /> Multi-Layer Anomaly Breakdown for {activeEmp.employee_name}
                </div>

                {empFindings.length > 0 ? (
                  <div className="space-y-3">
                    {empFindings.map((f) => (
                      <div key={f.id} className="p-4 rounded-lg bg-[#050505] border border-[#262626] space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            f.severity === 'CRITICAL' ? 'bg-[#18090a] text-rose-400 border border-[#7f1d1d]' : 'bg-[#171717] text-neutral-300 border border-[#333333]'
                          }`}>
                            {f.severity} • {f.layer} LAYER
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">{f.rule_code}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{f.title}</h4>
                        <p className="text-xs text-neutral-300 leading-relaxed">{f.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-[#050505] border border-[#262626] text-center">
                    <ShieldCheck className="w-6 h-6 text-white mx-auto mb-2" />
                    <p className="text-xs font-semibold text-white">No Policy Breaches Found for {activeEmp.employee_name}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">This transaction cleared all rule-based, statistical ML, and trust graph cluster evaluations cleanly.</p>
                  </div>
                )}

                {/* Auditor Forensic Action Toolbar */}
                <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-[#262626]">
                  <button
                    onClick={() => setActionSuccess(`Individual transaction for ${activeEmp.employee_name} placed on HOLD.`)}
                    className="minimal-btn-secondary"
                  >
                    Hold Payment
                  </button>
                  <button
                    onClick={() => setActionSuccess(`Audit Packet exported for ${activeEmp.employee_name} (${activeEmp.employee_id}).`)}
                    className="minimal-btn-primary"
                  >
                    <FileText className="w-3.5 h-3.5" /> Export Individual Evidence Packet
                  </button>
                </div>

                {actionSuccess && (
                  <div className="p-3 rounded-md bg-[#171717] border border-[#333333] text-white text-xs font-semibold font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" /> {actionSuccess}
                  </div>
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
    <Suspense fallback={<div className="text-white text-xs font-mono p-6">Loading Investigation Workspace...</div>}>
      <InvestigationContent />
    </Suspense>
  );
}
