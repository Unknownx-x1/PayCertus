'use client';

import { useState, ChangeEvent } from 'react';
import { uploadCSVFile, triggerSampleBatch } from '@/lib/api';
import { UploadCloud, CheckCircle, ArrowRight, ShieldCheck, AlertCircle, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  async function handleFileSelected(file: File) {
    if (!file) return;
    setUploading(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      const res = await uploadCSVFile(file);
      setUploading(false);
      setStatusMessage(res.message || `Successfully ingested batch '${file.name}' (${res.total_employees || '10'} records evaluated)!`);
      setTimeout(() => {
        router.push('/overview');
      }, 1500);
    } catch (err: any) {
      setUploading(false);
      setErrorMessage(err.message || 'Failed to process CSV file. Please check file format.');
    }
  }

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  }

  async function handleLoadPreset(type: 'clean' | 'fraud') {
    setUploading(true);
    setStatusMessage('');
    setErrorMessage('');
    const res = await triggerSampleBatch(type);
    setUploading(false);
    setStatusMessage(res.message || 'Preset dataset loaded successfully!');
    setTimeout(() => {
      router.push('/overview');
    }, 1500);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 select-none">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-white" /> Payroll Data Ingestion & Cleansing
        </h1>
        <p className="text-xs text-[#a1a1aa] mt-0.5">Import HRMS exports, attendance logs, and payroll batch datasets into the 5-layer intelligence engine</p>
      </div>

      {/* Stepper Header */}
      <div className="enterprise-card p-4 grid grid-cols-3 gap-4 border-b border-[#27272a]">
        <div className="flex items-center gap-2.5 text-white font-semibold text-xs font-mono">
          <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">1</div>
          <span>Upload Batch File</span>
        </div>
        <div className="flex items-center gap-2.5 text-[#a1a1aa] font-semibold text-xs font-mono">
          <div className="w-6 h-6 rounded bg-[#27272a] border border-[#3f3f46] flex items-center justify-center font-bold text-xs">2</div>
          <span>5-Layer Validation</span>
        </div>
        <div className="flex items-center gap-2.5 text-[#a1a1aa] font-semibold text-xs font-mono">
          <div className="w-6 h-6 rounded bg-[#27272a] border border-[#3f3f46] flex items-center justify-center font-bold text-xs">3</div>
          <span>PIS Score & Decision</span>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelected(e.dataTransfer.files[0]);
          }
        }}
        className={`enterprise-card p-10 text-center border-2 border-dashed transition-colors ${
          dragActive ? 'border-white bg-[#202023]' : 'border-[#27272a] hover:border-[#3f3f46]'
        }`}
      >
        <div className="w-12 h-12 rounded bg-[#27272a] border border-[#3f3f46] text-white flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold text-white">Drag and drop your custom Payroll CSV file</h2>
        <p className="text-xs text-[#a1a1aa] max-w-md mx-auto mt-1 font-mono">
          Supports any standard headers (employee_id, employee_name, salary, overtime, attendance, bank_account).
        </p>

        <div className="mt-5 flex justify-center items-center gap-3">
          <label className="btn-solid-primary cursor-pointer">
            {uploading ? 'Processing File...' : 'Select CSV File'}
            <input type="file" accept=".csv" className="hidden" onChange={onFileInputChange} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="enterprise-card p-5">
        <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-white" /> Demo Preset Scenarios
        </h3>
        <p className="text-xs text-[#a1a1aa] mb-4">Instantly load pre-built test datasets directly into the 5-layer intelligence pipeline</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded bg-[#09090b] border border-[#27272a] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-white bg-[#27272a] px-2 py-0.5 rounded border border-[#3f3f46]">Clean Cycle</span>
                <span className="text-[11px] text-[#71717a] font-mono">3 Employees</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-2">Standard Monthly Payroll Run</h4>
              <p className="text-xs text-[#a1a1aa] mt-1">Normal salaries, verified attendance, unique bank accounts. PIS ~ 98.</p>
            </div>
            <button
              onClick={() => handleLoadPreset('clean')}
              disabled={uploading}
              className="mt-4 w-full btn-solid-secondary justify-center"
            >
              {uploading ? 'Processing...' : 'Load Clean Preset'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded bg-[#3f1214] border border-[#7f1d1d] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-[#fca5a5] bg-[#5c1d20] px-2 py-0.5 rounded border border-[#7f1d1d]">Fraud Ring Alert</span>
                <span className="text-[11px] text-[#fca5a5]/70 font-mono">10 Employees</span>
              </div>
              <h4 className="text-xs font-bold text-white mt-2">Executive Payroll (High Risk)</h4>
              <p className="text-xs text-[#a1a1aa] mt-1">Contains shared bank account AC9001, zero attendance, extreme overtime. PIS = 0 (Blocked).</p>
            </div>
            <button
              onClick={() => handleLoadPreset('fraud')}
              disabled={uploading}
              className="mt-4 w-full btn-solid-danger justify-center"
            >
              {uploading ? 'Processing...' : '⚡ Load Fraud Ring Alert'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded bg-[#064e3b] border border-[#047857] text-[#6ee7b7] text-xs font-semibold flex items-center gap-2 font-mono">
          <CheckCircle className="w-4 h-4" /> {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded bg-[#3f1214] border border-[#7f1d1d] text-[#fca5a5] text-xs font-semibold flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4" /> {errorMessage}
        </div>
      )}
    </div>
  );
}
