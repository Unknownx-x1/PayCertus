'use client';

import { useEffect, useState } from 'react';
import { fetchBatches } from '@/lib/api';
import { PayrollBatch, SalaryTransaction } from '@/lib/types';
import { Users, Search, AlertCircle, ShieldAlert, CheckCircle, ArrowUpRight } from 'lucide-react';
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
    t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payroll Batches & Employee Risk Table</h1>
          <p className="text-sm text-slate-400 mt-1">Granular employee-level risk scores and salary transaction inspection</p>
        </div>

        {/* Batch Selector Dropdown */}
        <select
          value={selectedBatchId}
          onChange={(e) => setSelectedBatchId(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-sky-400"
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
        <div className="glass-panel p-6 grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-border">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Batch Name</span>
            <p className="text-base font-bold text-white mt-1">{activeBatch.batch_name}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Payroll Integrity Score</span>
            <p className={`text-xl font-extrabold mt-1 ${activeBatch.integrity_score < 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {activeBatch.integrity_score} / 100
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Disbursement Value</span>
            <p className="text-xl font-bold text-sky-400 mt-1">${activeBatch.total_amount ? activeBatch.total_amount.toLocaleString() : 0}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Firewall Recommendation</span>
            <div className="mt-1">
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                activeBatch.status === 'BLOCKED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {activeBatch.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search and Table */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <span className="text-xs text-slate-400">Showing {filteredTransactions.length} Employee Transactions</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-slate-400 text-xs font-semibold uppercase bg-slate-900/40">
                <th className="p-3">Employee</th>
                <th className="p-3">Department</th>
                <th className="p-3">Gross Pay</th>
                <th className="p-3">Overtime</th>
                <th className="p-3">Reimbursement</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-semibold text-slate-200">
                    <div>{tx.employee_name}</div>
                    <div className="text-[10px] text-slate-500">{tx.employee_id}</div>
                  </td>
                  <td className="p-3 text-slate-400">{tx.department}</td>
                  <td className="p-3 font-medium text-slate-200">${tx.gross_salary.toLocaleString()}</td>
                  <td className="p-3 text-slate-400">{tx.overtime_hours}h (${tx.overtime_pay})</td>
                  <td className="p-3 text-slate-400">${tx.reimbursements}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.attendance_days === 0 ? 'bg-rose-500/20 text-rose-400' : 'text-slate-300'}`}>
                      {tx.attendance_days} days
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      tx.risk_score >= 60 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                      (tx.risk_score >= 35 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400')
                    }`}>
                      {tx.risk_score} / 100
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href="/investigation"
                      className="px-2.5 py-1 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[11px] font-medium border border-sky-500/20 inline-flex items-center gap-1"
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
