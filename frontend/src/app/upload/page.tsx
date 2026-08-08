'use client';

import { useState } from 'react';
import { triggerSampleBatch } from '@/lib/api';
import { UploadCloud, CheckCircle, FileText, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  async function handleLoadPreset(type: 'clean' | 'fraud') {
    setUploading(true);
    setSuccessMessage('');
    const res = await triggerSampleBatch(type);
    setUploading(false);
    setSuccessMessage(res.message || 'Dataset loaded successfully!');
    setTimeout(() => {
      router.push('/overview');
    }, 1500);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payroll Data Ingestion & Cleansing</h1>
        <p className="text-sm text-slate-400 mt-1">Import HRMS exports, attendance logs, and reimbursement claim datasets</p>
      </div>

      {/* Stepper Header */}
      <div className="glass-panel p-4 grid grid-cols-3 gap-4 border-b border-border">
        <div className="flex items-center gap-3 text-sky-400 font-semibold text-sm">
          <div className="w-7 h-7 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/40 text-xs">1</div>
          <span>Upload Batch File</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-semibold text-sm">
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-xs">2</div>
          <span>5-Layer Validation</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-semibold text-sm">
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-xs">3</div>
          <span>PIS Score & Decision</span>
        </div>
      </div>

      {/* Main Drag & Drop Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleLoadPreset('fraud'); }}
        className={`glass-panel p-12 text-center border-2 border-dashed transition-all rounded-2xl cursor-pointer ${
          dragActive ? 'border-sky-400 bg-sky-500/5' : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-4 border border-sky-500/20 shadow-lg shadow-sky-500/10">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Drag and drop your Payroll CSV batch</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
          Supports standard Workday, SAP, BambooHR, ADP, and custom CSV schemas (Employee ID, Salary, Overtime, Bank Account, Attendance).
        </p>

        <div className="mt-6 flex justify-center items-center gap-3">
          <label className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-sky-500/20 transition">
            Browse File
            <input type="file" accept=".csv" className="hidden" onChange={() => handleLoadPreset('fraud')} />
          </label>
        </div>
      </div>

      {/* Demo Preset Quick Loader */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Fast Demo Preset Scenarios
        </h3>
        <p className="text-xs text-slate-400 mb-4">Instantly load test datasets directly into the 5-layer intelligence pipeline</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Clean Cycle</span>
                <span className="text-xs text-slate-500">3 Employees</span>
              </div>
              <h4 className="text-sm font-bold text-slate-200 mt-2">Standard Monthly Payroll Run</h4>
              <p className="text-xs text-slate-400 mt-1">Normal salaries, verified attendance, unique bank accounts. PIS ~ 98.</p>
            </div>
            <button
              onClick={() => handleLoadPreset('clean')}
              disabled={uploading}
              className="mt-4 w-full py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-2"
            >
              {uploading ? 'Processing...' : 'Load Clean Preset'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Fraud Ring Alert</span>
                <span className="text-xs text-slate-500">4 Employees</span>
              </div>
              <h4 className="text-sm font-bold text-slate-200 mt-2">Executive Payroll (High Risk)</h4>
              <p className="text-xs text-slate-400 mt-1">Contains ghost employees, shared offshore bank accounts, zero attendance, excessive overtime. PIS ~ 35 (Blocked).</p>
            </div>
            <button
              onClick={() => handleLoadPreset('fraud')}
              disabled={uploading}
              className="mt-4 w-full py-2 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/40 transition flex items-center justify-center gap-2"
            >
              {uploading ? 'Processing...' : '⚡ Load Fraud Ring Alert'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> {successMessage}
        </div>
      )}
    </div>
  );
}
