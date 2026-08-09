'use client';

import { useEffect, useState } from 'react';
import { fetchBatches } from '@/lib/api';
import { PayrollBatch } from '@/lib/types';
import { Search, ArrowUpRight, Users, ShieldCheck, Lock, Fingerprint } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await fetchBatches();
    setBatches(data);
    if (data.length > 0) {
      setSelectedBatchId(data[0].id);
    }
  }

  const activeBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const transactions = activeBatch?.transactions || [];

  const filteredTransactions = transactions.filter(t => 
    t.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.department && t.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
    t.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.bank_account_no && t.bank_account_no.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const approvedAmt = activeBatch?.approved_amount || transactions.filter(t => t.status === 'APPROVED').reduce((sum, t) => sum + t.gross_salary, 0);
  const heldAmt = activeBatch?.held_amount || transactions.filter(t => t.status === 'FLAG_REVIEW' || t.status === 'HOLD').reduce((sum, t) => sum + t.gross_salary, 0);
  const blockedAmt = activeBatch?.blocked_amount || transactions.filter(t => t.status === 'BLOCKED').reduce((sum, t) => sum + t.gross_salary, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-white" /> Payroll Batches & Employee Risk Datatable
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Granular employee-level risk scores, attendance verification, and salary transaction inspection</p>
        </div>

        {/* Batch Selector Dropdown */}
        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-white text-xs font-mono font-semibold rounded px-3 py-2 outline-none focus:border-white"
        >
          {batches.map(b => (
            <option key={b.id} value={b.id}>
              {b.batch_name} (PIS: {b.integrity_score})
            </option>
          ))}
        </select>
      </div>

      {/* Batch Overview Summary Card */}
      {activeBatch && (
        <div className="enterprise-card p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-[#27272a] pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider">Target Payroll Batch</span>
              <p className="text-sm font-bold text-white mt-1 font-mono">{activeBatch.batch_name}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider">Batch Integrity Score (PIS)</span>
              <p className={`text-lg font-extrabold font-mono mt-1 ${activeBatch.integrity_score < 40 ? 'text-[#fca5a5]' : 'text-[#6ee7b7]'}`}>
                {activeBatch.integrity_score} / 100
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider">Total Batch Amount</span>
              <p className="text-lg font-bold font-mono text-white mt-1">${activeBatch.total_amount ? activeBatch.total_amount.toLocaleString() : 0}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#a1a1aa] font-bold uppercase tracking-wider">Firewall Decision</span>
              <div className="mt-1">
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                  activeBatch.status === 'BLOCKED' || activeBatch.status === 'PARTIAL_HOLD' ? 'bg-[#3f1214] text-[#fca5a5] border border-[#7f1d1d]' : 'bg-[#064e3b] text-[#6ee7b7] border border-[#047857]'
                }`}>
                  {activeBatch.status}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Risk Exposure Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
            <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
              <span className="text-[10px] text-[#6ee7b7] font-bold uppercase">Approved Amount</span>
              <p className="text-sm font-bold text-[#6ee7b7] mt-0.5">${approvedAmt.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
              <span className="text-[10px] text-[#fdba74] font-bold uppercase">Held Amount</span>
              <p className="text-sm font-bold text-[#fdba74] mt-0.5">${heldAmt.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded bg-[#09090b] border border-[#27272a]">
              <span className="text-[10px] text-[#fca5a5] font-bold uppercase">Blocked Amount</span>
              <p className="text-sm font-bold text-[#fca5a5] mt-0.5">${blockedAmt.toLocaleString()}</p>
            </div>
          </div>

          {activeBatch.proof_hash && (
            <div className="text-[10px] font-mono text-[#71717a] flex items-center gap-1.5 pt-1">
              <Fingerprint className="w-3.5 h-3.5 text-[#a1a1aa]" /> Cryptographic Proof Hash: <span className="text-[#a1a1aa]">{activeBatch.proof_hash}</span>
            </div>
          )}
        </div>
      )}

      {/* Search and Datatable */}
      <div className="enterprise-card p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-[#27272a] pb-3">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee, ID, or bank account..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <span className="text-xs font-mono text-[#a1a1aa]">Showing <strong className="text-white">{filteredTransactions.length}</strong> Employee Transactions</span>
        </div>

        {/* Datatable */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272a] text-[#a1a1aa] text-[11px] font-mono font-semibold uppercase bg-[#09090b]">
                <th className="p-3">Employee</th>
                <th className="p-3">Bank Account</th>
                <th className="p-3">Gross Pay</th>
                <th className="p-3">Overtime</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] text-xs">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#202023] transition">
                  <td className="p-3 font-semibold text-white">
                    <div className="font-bold">{tx.employee_name}</div>
                    <div className="text-[10px] font-mono text-[#a1a1aa]">{tx.employee_id}</div>
                  </td>
                  <td className="p-3 font-mono text-[#f4f4f5]">{tx.bank_account_no || 'Data unavailable'}</td>
                  <td className="p-3 font-mono font-medium text-white">${tx.gross_salary.toLocaleString()}</td>
                  <td className="p-3 font-mono text-[#f4f4f5]">{tx.overtime_hours}h</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${tx.attendance_days === 0 ? 'bg-[#3f1214] text-[#fca5a5] border border-[#7f1d1d]' : 'text-[#f4f4f5]'}`}>
                      {tx.attendance_days} days
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                      tx.risk_score >= 75 ? 'bg-[#3f1214] text-[#fca5a5] border border-[#7f1d1d]' : (tx.risk_score >= 35 ? 'bg-[#451a03] text-[#fdba74] border border-[#9a3412]' : 'bg-[#064e3b] text-[#6ee7b7] border border-[#047857]')
                    }`}>
                      {tx.risk_score} / 100
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/investigation?emp=${tx.employee_id}&batch=${activeBatch.id}`}
                      className="btn-solid-secondary py-1 px-2.5 text-[11px]"
                    >
                      Investigate <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
