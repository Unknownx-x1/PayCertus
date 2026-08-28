'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  UploadCloud, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  FileText, 
  Network, 
  Search, 
  Cpu, 
  DollarSign, 
  Users, 
  FileCheck 
} from 'lucide-react';
import { uploadCSVFile } from '@/lib/api';

export default function HRSimulatorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [batchName, setBatchName] = useState('Aug 2026 Executive Payroll Run');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setBatchName(e.target.files[0].name.replace('.csv', ' Payroll Cycle'));
    }
  };

  const handleSimulateDisbursement = async (usePresetBenchmark: boolean = false) => {
    setIsProcessing(true);
    setProcessingStep(1);
    setResult(null);
    setLogMessages([
      'HR Manager initiated payroll disbursement cycle...',
      'Encrypting payload and preparing outgoing payout stream to Bank Gateway API...'
    ]);

    // Step 1: Intercepted by PayCertus
    await new Promise(r => setTimeout(r, 800));
    setProcessingStep(2);
    setLogMessages(prev => [
      ...prev,
      '⚡ PayCertus Security Proxy Intercepted Payload before Gateway release.',
      'Generating SHA-256 Canonical Cryptographic Proof Hash...'
    ]);

    // Step 2: 5-Layer Pipeline Execution
    await new Promise(r => setTimeout(r, 1000));
    setProcessingStep(3);
    setLogMessages(prev => [
      ...prev,
      'Running Layer 1: Policy Rule Engine (Shared Accounts, Ghost Employee check)...',
      'Running Layer 2: Statistical Machine Learning Engine (Isolation Forest Outlier Detection)...',
      'Running Layer 3: Enterprise Trust Graph Topology (NetworkX Collusion Cluster Detection)...',
      'Computing Layer 4: Payroll Integrity Score (PIS) & Financial Exposure Breakdown...'
    ]);

    try {
      let fileToUpload = selectedFile;
      
      // If benchmark button clicked or no file selected, create benchmark file
      if (usePresetBenchmark || !fileToUpload) {
        // Fetch benchmark CSV (200-record multi-signal dataset)
        const response = await fetch('/payroll_sentinel_200_multi_signal_batch.csv');
        let blob: Blob;
        if (response.ok) {
          blob = await response.blob();
        } else {
          // Fallback dummy CSV string for fraud scenario
          const dummyCsv = `employee_id,employee_name,salary,overtime,attendance,bank_account\nE001,Arjun Verma,85000,45,0,AC9001\nE002,Ishita Singh,82000,42,0,AC9001\nE003,Dev Malhotra,90000,48,0,AC9001\nE004,Mira Shah,88000,44,0,AC9001\nE005,Rahul Jain,95000,50,0,AC9001\nE006,Regular Worker,60000,0,22,AC1006`;
          blob = new Blob([dummyCsv], { type: 'text/csv' });
        }
        fileToUpload = new File([blob], 'payroll_sentinel_200_multi_signal_batch.csv', { type: 'text/csv' });
      }

      const res = await uploadCSVFile(fileToUpload);
      await new Promise(r => setTimeout(r, 1000));

      setProcessingStep(4);
      setResult(res);
      setLogMessages(prev => [
        ...prev,
        `✅ Pipeline evaluation complete. Integrity Score: ${res.integrity_score}/100.`,
        `🚨 FIREWALL DECISION ENFORCED: ${res.status || 'BLOCKED'}`
      ]);
    } catch (err: any) {
      console.error(err);
      setLogMessages(prev => [...prev, `❌ Error processing batch: ${err.message}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Enterprise Header Banner */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-white">
            <Building2 className="w-6 h-6 text-[#38bdf8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#38bdf8]/10 text-[#38bdf8] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#38bdf8]/30">
                ERP SIMULATOR
              </span>
              <span className="text-xs text-[#a1a1aa] font-mono">Workday / SAP Enterprise Integration</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-1">
              HRMS Payroll Disbursement Portal
            </h1>
            <p className="text-xs text-[#a1a1aa]">
              Simulate an HR Manager triggering payroll release to test how PayCertus intercepts and evaluates payments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="px-3 py-2 text-xs font-semibold rounded bg-[#27272a] hover:bg-[#3f3f46] text-white transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4 text-[#a1a1aa]" />
            <span>Direct CSV Upload</span>
          </Link>
          <Link
            href="/trust-graph"
            className="px-3 py-2 text-xs font-semibold rounded bg-[#38bdf8] hover:bg-[#0284c7] text-black transition-colors flex items-center gap-1.5"
          >
            <Network className="w-4 h-4" />
            <span>View Trust Graph</span>
          </Link>
        </div>
      </div>

      {/* Simulator Control Grid */}
      <div className="grid grid-[#18181b] md:grid-cols-12 gap-6">
        {/* Left Column: HR Workflow Inputs */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#38bdf8]" />
                Step 1: HR Payroll Run Details
              </h2>
              <span className="text-[10px] font-mono text-[#a1a1aa] bg-[#27272a] px-2 py-0.5 rounded">
                Cycle #2026-08
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                  Payroll Cycle Name
                </label>
                <input
                  type="text"
                  value={batchName}
                  onChange={e => setBatchName(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a1a1aa] mb-1.5">
                  Upload Custom Payroll CSV (Optional)
                </label>
                <div className="border border-dashed border-[#3f3f46] rounded-lg p-4 bg-[#09090b] text-center hover:border-[#38bdf8] transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-6 h-6 text-[#a1a1aa] mx-auto mb-1" />
                  <p className="text-xs text-white font-medium">
                    {selectedFile ? selectedFile.name : 'Click to select custom CSV file'}
                  </p>
                  <p className="text-[11px] text-[#71717a] mt-0.5">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Or use preset 100-employee benchmark dataset below'}
                  </p>
                </div>
              </div>
            </div>

            {/* Execution Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => handleSimulateDisbursement(false)}
                disabled={isProcessing}
                className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-xs font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Interception Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>RELEASE PAYROLL TO BANK GATEWAY</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleSimulateDisbursement(true)}
                disabled={isProcessing}
                className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold py-2.5 px-4 rounded border border-[#3f3f46] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Cpu className="w-4 h-4 text-[#38bdf8]" />
                <span>Simulate 100-Employee Benchmark Fraud Ring Batch</span>
              </button>
            </div>
          </div>

          {/* Architecture Card */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 text-xs space-y-2">
            <h3 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Lock className="w-3.5 h-3.5 text-[#6ee7b7]" />
              How the Interception Protocol Works
            </h3>
            <p className="text-[#a1a1aa] text-[11px] leading-relaxed">
              When an HR Manager clicks <b>Release Payroll</b>, the payout stream is automatically directed through 
              the PayCertus API Proxy Gatekeeper. The payment is evaluated through 5 analytical layers 
              <b>before</b> funds leave the company's bank account.
            </p>
          </div>
        </div>

        {/* Right Column: Real-Time Interception Output & Firewall Modal */}
        <div className="md:col-span-6 space-y-6">
          {/* Live Pipeline Terminal */}
          <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
              <span className="text-[#a1a1aa] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                PAYCERTUS SECURITY PROXY STREAM
              </span>
              <span className="text-[10px] text-[#71717a]">INTERCEPTOR ACTIVE</span>
            </div>

            <div className="h-44 overflow-y-auto space-y-1.5 text-[11px] pr-2">
              {logMessages.length === 0 ? (
                <div className="text-[#71717a] py-8 text-center font-mono">
                  Ready. Click "RELEASE PAYROLL TO BANK GATEWAY" to test real-time firewall interception.
                </div>
              ) : (
                logMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`leading-tight ${
                      msg.includes('🚨') || msg.includes('BLOCKED')
                        ? 'text-[#ef4444] font-bold'
                        : msg.includes('✅')
                        ? 'text-[#6ee7b7]'
                        : msg.includes('⚡')
                        ? 'text-[#38bdf8]'
                        : 'text-[#a1a1aa]'
                    }`}
                  >
                    <span className="text-[#52525b] mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {msg}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Firewall Result Card */}
          {result && (
            <div className={`border rounded-lg p-5 space-y-4 ${
              result.status === 'BLOCKED' || result.status === 'PARTIAL_HOLD'
                ? 'bg-[#18181b] border-[#ef4444]'
                : 'bg-[#18181b] border-[#22c55e]'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    result.status === 'BLOCKED' || result.status === 'PARTIAL_HOLD'
                      ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30'
                      : 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30'
                  }`}>
                    {result.status || 'BLOCKED'}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    {result.status === 'BLOCKED' || result.status === 'PARTIAL_HOLD'
                      ? '🚨 PAYCERTUS FIREWALL HALTED PAYMENT'
                      : '✅ PAYCERTUS VERIFIED — SAFE TO DISBURSE'}
                  </h3>
                  <p className="text-xs text-[#a1a1aa] mt-0.5">
                    Batch ID: <span className="font-mono text-white">{result.batch_id}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-[#a1a1aa] font-mono">PIS SCORE</div>
                  <div className={`text-2xl font-bold font-mono ${
                    result.integrity_score < 40 ? 'text-[#ef4444]' : 'text-[#22c55e]'
                  }`}>
                    {result.integrity_score}/100
                  </div>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#09090b] p-3 rounded border border-[#27272a]">
                  <div className="text-[10px] text-[#a1a1aa]">TOTAL EMPLOYEES</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {result.total_employees} Employee Records
                  </div>
                </div>

                <div className="bg-[#09090b] p-3 rounded border border-[#27272a]">
                  <div className="text-[10px] text-[#a1a1aa]">FIREWALL DECISION</div>
                  <div className="text-sm font-bold text-[#ef4444] font-mono mt-0.5">
                    PAYMENT HELD IN SAFE VAULT
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <Link
                  href={`/trust-graph?batch=${result.batch_id}`}
                  className="px-3 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                >
                  <Network className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Inspect Collusion Graph</span>
                </Link>

                <Link
                  href="/reports"
                  className="px-3 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#a1a1aa]" />
                  <span>Generate CFO PDF Dossier</span>
                </Link>

                <Link
                  href="/investigation"
                  className="px-3 py-2 bg-[#38bdf8] hover:bg-[#0284c7] text-black text-xs font-bold rounded flex items-center gap-1.5 transition-colors ml-auto"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Open AI Investigation Hub</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
