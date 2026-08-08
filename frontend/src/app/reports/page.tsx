'use client';

import { useEffect, useState } from 'react';
import { fetchBatches, postFirewallAction } from '@/lib/api';
import { PayrollBatch } from '@/lib/types';
import { ShieldCheck, FileText, CheckCircle, PauseCircle, XCircle, Printer } from 'lucide-react';

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
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-white" /> Payroll Firewall & Compliance Reports
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Pre-disbursement approval gatekeeper and audit report export center</p>
        </div>

        {/* Batch Selector */}
        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="bg-[#0a0a0a] border border-[#262626] text-white text-xs font-mono font-semibold rounded-md px-3 py-2 outline-none focus:border-white"
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
        <div className="minimal-panel p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-[#262626] pb-4">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Target Payroll Batch</span>
              <h2 className="text-lg font-bold text-white mt-0.5 font-mono">{activeBatch.batch_name}</h2>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Firewall Decision</span>
              <div className="mt-1">
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-extrabold ${
                  activeBatch.status === 'BLOCKED' ? 'bg-[#18090a] text-rose-400 border border-[#7f1d1d]' : 'bg-[#171717] text-white border border-[#333333]'
                }`}>
                  {activeBatch.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-neutral-300">Auditor Notes & Justification:</label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Enter optional compliance override or hold notes..."
              className="w-full bg-[#050505] border border-[#262626] rounded-md p-3 text-xs text-white focus:outline-none focus:border-white h-20 font-mono"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleFirewallAction('APPROVE')}
                className="py-2.5 px-4 rounded-md bg-[#171717] hover:bg-[#262626] text-white font-semibold text-xs border border-[#333333] flex items-center justify-center gap-2 transition"
              >
                <CheckCircle className="w-4 h-4 text-white" /> Authorize & Release Salary
              </button>

              <button
                onClick={() => handleFirewallAction('HOLD')}
                className="py-2.5 px-4 rounded-md bg-[#171717] hover:bg-[#262626] text-neutral-300 font-semibold text-xs border border-[#333333] flex items-center justify-center gap-2 transition"
              >
                <PauseCircle className="w-4 h-4 text-neutral-400" /> Place Batch On Hold
              </button>

              <button
                onClick={() => handleFirewallAction('BLOCK')}
                className="py-2.5 px-4 rounded-md bg-[#18090a] hover:bg-[#2c0d0e] text-rose-400 font-semibold text-xs border border-[#7f1d1d] flex items-center justify-center gap-2 transition"
              >
                <XCircle className="w-4 h-4 text-rose-400" /> Block Fraudulent Payroll
              </button>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-md bg-[#171717] border border-[#333333] text-white text-xs font-semibold font-mono">
              {message}
            </div>
          )}
        </div>
      )}

      {/* Audit Export Section */}
      <div className="minimal-panel p-6 space-y-4">
        <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-white" /> Compliance Audit Reports
        </h2>
        <p className="text-xs text-neutral-400">Export immutable PDF and HTML reports for external audit partners and regulatory compliance.</p>

        {activeBatch && (
          <div className="p-4 rounded-lg bg-[#050505] border border-[#262626] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">{activeBatch.batch_name} Audit Report</h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">Cryptographic ID: {activeBatch.id}</p>
            </div>

            <a
              href={`http://localhost:8000/api/v1/audit/reports/${activeBatch.id}/html`}
              target="_blank"
              rel="noreferrer"
              className="minimal-btn-primary"
            >
              <Printer className="w-4 h-4" /> Print / Export Audit Report
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
