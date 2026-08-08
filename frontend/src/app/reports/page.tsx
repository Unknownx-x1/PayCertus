'use client';

import { useEffect, useState } from 'react';
import { fetchBatches, postFirewallAction } from '@/lib/api';
import { PayrollBatch } from '@/lib/types';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle, PauseCircle, XCircle, Printer } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Payroll Firewall & Compliance Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1">Pre-disbursement approval gatekeeper and audit report export center</p>
        </div>

        {/* Batch Selector */}
        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-emerald-400"
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
        <div className="glass-panel p-6 space-y-6 border-l-4 border-l-sky-500">
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Target Payroll Batch</span>
              <h2 className="text-xl font-bold text-white mt-0.5">{activeBatch.batch_name}</h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-semibold uppercase">Current Firewall Decision</span>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded text-xs font-extrabold ${
                  activeBatch.status === 'BLOCKED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {activeBatch.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300">Auditor Notes & Justification:</label>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Enter optional compliance override or hold notes..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500 h-20"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleFirewallAction('APPROVE')}
                className="py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center justify-center gap-2 transition"
              >
                <CheckCircle className="w-4 h-4" /> Authorize & Release Salary
              </button>

              <button
                onClick={() => handleFirewallAction('HOLD')}
                className="py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center justify-center gap-2 transition"
              >
                <PauseCircle className="w-4 h-4" /> Place Batch On Hold
              </button>

              <button
                onClick={() => handleFirewallAction('BLOCK')}
                className="py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/40 flex items-center justify-center gap-2 transition"
              >
                <XCircle className="w-4 h-4" /> Block Fraudulent Payroll
              </button>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              {message}
            </div>
          )}
        </div>
      )}

      {/* Audit Export Section */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" /> Compliance Audit Reports
        </h2>
        <p className="text-xs text-slate-400">Export immutable PDF and HTML reports for external audit partners and regulatory compliance.</p>

        {activeBatch && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-200">{activeBatch.batch_name} Audit Report</h3>
              <p className="text-xs text-slate-400">Cryptographic ID: {activeBatch.id}</p>
            </div>

            <a
              href={`http://localhost:8000/api/v1/audit/reports/${activeBatch.id}/html`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition"
            >
              <Printer className="w-4 h-4" /> Print / Export Audit Report
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
