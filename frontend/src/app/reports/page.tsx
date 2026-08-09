'use client';

import { useEffect, useState } from 'react';
import { fetchBatches, postFirewallAction } from '@/lib/api';
import { PayrollBatch } from '@/lib/types';
import { exportBatchAuditReport } from '@/lib/exportReport';
import { ShieldCheck, FileText, CheckCircle, PauseCircle, XCircle, Printer, Lock } from 'lucide-react';

export default function ReportsPage() {
  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [actionNotes, setActionNotes] = useState('');
  const [message, setMessage] = useState('');

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

  async function handleFirewallAction(action: 'APPROVE' | 'HOLD' | 'BLOCK') {
    if (!activeBatch) return;
    const res = await postFirewallAction(activeBatch.id, action, actionNotes);
    setMessage(`Action [${action}] recorded successfully for batch ${activeBatch.batch_name}!`);
    loadBatches();
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
            <Lock className="w-4 h-4 text-white" /> Payroll Firewall & Compliance Reports
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Pre-disbursement approval gatekeeper and cryptographic audit report export center</p>
        </div>

        {/* Batch Selector */}
        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-white text-xs font-mono font-semibold rounded px-3 py-2 outline-none focus:border-white"
        >
          {batches.map(b => (
            <option key={b.id} value={b.id}>
              {b.batch_name} (Status: {b.status})
            </option>
          ))}
        </select>
      </div>

      {/* Main Action Panel */}
      {activeBatch && (
        <div className="enterprise-card p-5 space-y-5">
          <div className="flex justify-between items-center border-b border-[#27272a] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider">Target Payroll Batch</span>
              <h2 className="text-base font-bold text-white mt-0.5 font-mono">{activeBatch.batch_name}</h2>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider">Firewall Decision</span>
              <div className="mt-1">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                  activeBatch.status === 'BLOCKED' ? 'bg-[#3f1214] text-[#fca5a5] border border-[#7f1d1d]' : 'bg-[#064e3b] text-[#6ee7b7] border border-[#047857]'
                }`}>
                  {activeBatch.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white">Auditor Compliance Justification & Notes:</label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Enter optional compliance override or hold notes..."
              className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 text-xs text-white focus:outline-none focus:border-white h-20 font-mono"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                onClick={() => handleFirewallAction('APPROVE')}
                className="py-2.5 px-3 rounded bg-[#064e3b] hover:bg-[#047857] text-[#6ee7b7] font-bold text-xs border border-[#047857] flex items-center justify-center gap-2 transition"
              >
                <CheckCircle className="w-4 h-4" /> Authorize & Release Salary
              </button>

              <button
                onClick={() => handleFirewallAction('HOLD')}
                className="py-2.5 px-3 rounded bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] font-bold text-xs border border-[#3f3f46] flex items-center justify-center gap-2 transition"
              >
                <PauseCircle className="w-4 h-4" /> Place Batch On Hold
              </button>

              <button
                onClick={() => handleFirewallAction('BLOCK')}
                className="btn-solid-danger justify-center py-2.5"
              >
                <XCircle className="w-4 h-4" /> Block Fraudulent Payroll
              </button>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded bg-[#27272a] border border-[#3f3f46] text-white text-xs font-semibold font-mono">
              {message}
            </div>
          )}
        </div>
      )}

      {/* Audit Export Section */}
      <div className="enterprise-card p-5 space-y-3">
        <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-white" /> Compliance Audit Reports
        </h2>
        <p className="text-xs text-[#a1a1aa]">Export immutable PDF and HTML reports for external audit partners and regulatory compliance.</p>

        {activeBatch && (
          <div className="p-3.5 rounded bg-[#09090b] border border-[#27272a] flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-white">{activeBatch.batch_name} Audit Report</h3>
              <p className="text-[11px] text-[#71717a] font-mono mt-0.5">ID: {activeBatch.id}</p>
            </div>

            <button
              onClick={() => exportBatchAuditReport(activeBatch)}
              className="btn-solid-primary"
            >
              <Printer className="w-3.5 h-3.5" /> Export Audit Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
