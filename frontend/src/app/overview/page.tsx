'use client';

import { useEffect, useState } from 'react';
import { fetchBatches } from '@/lib/api';
import { PayrollBatch } from '@/lib/types';
import { Search, ArrowUpRight } from 'lucide-react';
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
    t.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Payroll Batches & Employee Risk Table</h1>
          <p className="text-xs text-neutral-400 mt-1">Granular employee-level risk scores and salary transaction inspection</p>
        </div>

        {/* Batch Selector Dropdown */}
        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="bg-[#0a0a0a] border border-[#262626] text-white text-xs font-mono font-semibold rounded-md px-3 py-2 outline-none focus:border-white"
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
        <div className="minimal-panel p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Batch Name</span>
            <p className="text-sm font-bold text-white mt-1 font-mono">{activeBatch.batch_name}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Integrity Score (PIS)</span>
            <p className={`text-lg font-extrabold font-mono mt-1 ${activeBatch.integrity_score < 40 ? 'text-rose-400' : 'text-white'}`}>
              {activeBatch.integrity_score} / 100
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono text-neutral-400 font-semibold uppercase tracking-wider">Total Batch Amount</span>
            <p className="text-lg font-bold font-mono text-white mt-1">${activeBatch.total_amount ? activeBatch.total_amount.toLocaleString() : 0}</p>
          </div>
          <div>
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
      )}

      {/* Search and Table */}
      <div className="minimal-panel p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search employee, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050505] border border-[#262626] rounded-md pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <span className="text-xs font-mono text-neutral-400">Showing {filteredTransactions.length} Employee Transactions</span>
        </div>

        {/* Minimalist Monochromatic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#262626] text-neutral-400 text-[11px] font-mono font-semibold uppercase bg-[#050505]">
                <th className="p-3">Employee</th>
                <th className="p-3">Bank Account</th>
                <th className="p-3">Gross Pay</th>
                <th className="p-3">Overtime</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717] text-xs">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#121212] transition">
                  <td className="p-3 font-semibold text-white">
                    <div>{tx.employee_name}</div>
                    <div className="text-[10px] font-mono text-neutral-400">{tx.employee_id}</div>
                  </td>
                  <td className="p-3 font-mono text-neutral-300">{(tx as any).bank_account_no || 'AC9001'}</td>
                  <td className="p-3 font-mono font-medium text-white">${tx.gross_salary.toLocaleString()}</td>
                  <td className="p-3 font-mono text-neutral-300">{tx.overtime_hours}h</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${tx.attendance_days === 0 ? 'bg-[#18090a] text-rose-400 border border-[#7f1d1d]' : 'text-neutral-300'}`}>
                      {tx.attendance_days} days
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold ${
                      tx.risk_score >= 60 ? 'bg-[#18090a] text-rose-400 border border-[#7f1d1d]' : 'bg-[#171717] text-white border border-[#333333]'
                    }`}>
                      {tx.risk_score} / 100
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/investigation?emp=${tx.employee_id}&batch=${activeBatch.id}`}
                      className="px-2.5 py-1 rounded-md bg-[#171717] hover:bg-[#262626] text-white text-[11px] font-semibold border border-[#333333] inline-flex items-center gap-1 transition hover:scale-105"
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
