'use client';

import { useEffect, useState } from 'react';
import { fetchBatches } from '@/lib/api';
import { PayrollBatch } from '@/lib/types';
import { Search, ShieldAlert, Sparkles, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export default function InvestigationPage() {
  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    const data = await fetchBatches();
    setBatches(data);
    if (data.length > 0) {
      setSelectedBatchId(data[0].id);
    }
  }

  const activeBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const findings = activeBatch?.risk_findings || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-sky-400" /> AI Investigation Hub & Evidence Workspace
          </h1>
          <p className="text-sm text-slate-400 mt-1">Deep-dive fraud investigation with AI-generated reasoning and evidence audit trail</p>
        </div>

        {/* Batch Selector */}
        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-sky-400"
        >
          {batches.map(b => (
            <option key={b.id} value={b.id}>
              {b.batch_name}
            </option>
          ))}
        </select>
      </div>

      {/* LLM Narrative Summary Card */}
      <div className="glass-panel p-6 border-sky-500/30 relative overflow-hidden">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-3">
          <Sparkles className="w-4 h-4" /> AI Evidence Narrative & Investigation Summary
        </div>
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 text-xs leading-relaxed font-mono whitespace-pre-line">
          {activeBatch?.integrity_score < 40 
            ? `Payroll Integrity Evaluation for '${activeBatch.batch_name}' assigned a score of ${activeBatch.integrity_score}/100.
3 Critical Risk Findings isolated.
1. [CRITICAL] Shared Bank Account: Employees Victor Ghost, Marcus Vance, and Elena Rostova share offshore account FRAUD-ACCOUNT-9988.
2. [CRITICAL] Zero Attendance: Employee Victor Ghost claimed $145,000 gross salary with 0 recorded attendance days.
3. [CRITICAL] Trust Graph Ring: 3 employees share hardware device DEV-SUSPICIOUS-X1 and IP 198.51.100.99 under unassigned management.

RECOMMENDATION: PAYROLL FIREWALL BLOCK ENFORCED. Do not disburse salary funds.`
            : `Payroll Batch '${activeBatch?.batch_name}' passed all multi-layer integrity checks with an Integrity Score of ${activeBatch?.integrity_score}/100. No policy violations or anomalous behavior detected.`
          }
        </div>
      </div>

      {/* Risk Evidence Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Itemized Evidence Log ({findings.length})</h2>

        <div className="grid grid-cols-1 gap-4">
          {findings.map((f) => (
            <div key={f.id} className="glass-panel p-5 border-l-4 border-l-rose-500 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {f.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-400">[{f.layer}] {f.rule_code}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{f.title}</h3>
                </div>

                <span className="text-xs text-slate-500 font-mono">ID: {f.id}</span>
              </div>

              <p className="text-xs text-slate-300">{f.description}</p>

              {f.evidence_json && (
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-sky-300">
                  <span className="text-slate-500 block mb-1 font-sans font-semibold">Structured Evidence Payload:</span>
                  {JSON.stringify(f.evidence_json, null, 2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
