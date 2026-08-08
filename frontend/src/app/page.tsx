'use client';

import { useEffect, useState } from 'react';
import { fetchBatches, triggerSampleBatch } from '@/lib/api';
import { PayrollBatch } from '@/lib/types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Users, Network, ArrowUpRight, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

export default function ExecutiveDashboard() {
  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await fetchBatches();
    setBatches(data);
    setLoading(false);
  }

  const latestBatch = batches[0] || {
    batch_name: 'No active batch',
    integrity_score: 100,
    total_employees: 0,
    total_amount: 0,
    status: 'APPROVED',
    risk_findings: []
  };

  const pisScore = latestBatch.integrity_score;
  const criticalFindings = (latestBatch.risk_findings || []).filter(f => f.severity === 'CRITICAL');
  const highFindings = (latestBatch.risk_findings || []).filter(f => f.severity === 'HIGH');

  const trendData = [
    { month: 'May', score: 98 },
    { month: 'Jun', score: 95 },
    { month: 'Jul', score: 98 },
    { month: 'Aug (Current)', score: pisScore },
  ];

  const distributionData = [
    { name: 'Rules Layer', value: (latestBatch.risk_findings || []).filter(f => f.layer === 'RULE').length },
    { name: 'ML Anomaly', value: (latestBatch.risk_findings || []).filter(f => f.layer === 'ANOMALY').length },
    { name: 'Trust Graph', value: (latestBatch.risk_findings || []).filter(f => f.layer === 'GRAPH').length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/60 backdrop-blur-md p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PayCertus Executive Integrity Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Continuous pre-disbursement payroll fraud & anomaly monitoring</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => { await triggerSampleBatch('clean'); loadData(); }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            Load Clean Batch Preset
          </button>
          <button
            onClick={async () => { await triggerSampleBatch('fraud'); loadData(); }}
            className="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/40 transition shadow-lg shadow-rose-500/10"
          >
            ⚡ Load Fraud Ring Alert Preset
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payroll Integrity Score (PIS) */}
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payroll Integrity Score</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold ${pisScore < 40 ? 'text-rose-500' : (pisScore < 70 ? 'text-amber-400' : 'text-emerald-400')}`}>
              {pisScore}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Status: <span className={pisScore < 40 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{latestBatch.status}</span>
          </div>
        </div>

        {/* Total Processed */}
        <div className="glass-panel p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Batch Value</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">
            ${latestBatch.total_amount ? latestBatch.total_amount.toLocaleString() : '0'}
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {latestBatch.total_employees} Employee records evaluated
          </div>
        </div>

        {/* High Risk Anomalies */}
        <div className="glass-panel p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical & High Anomalies</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-rose-400">
            {criticalFindings.length + highFindings.length}
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {criticalFindings.length} Critical | {highFindings.length} High Severity
          </div>
        </div>

        {/* Fraud Rings Isolated */}
        <div className="glass-panel p-5">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trust Graph Rings</span>
            <Network className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-purple-400">
            {(latestBatch.risk_findings || []).filter(f => f.layer === 'GRAPH').length > 0 ? '1 Identified' : '0'}
          </div>
          <div className="mt-3 text-xs text-purple-300/80">
            Coordinated entity ring isolated
          </div>
        </div>
      </div>

      {/* Main Charts & Alerts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integrity Score Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Historical Integrity Score Trend</h2>
              <p className="text-xs text-slate-400">Multi-cycle risk evaluation timeline</p>
            </div>
            <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">Monthly Benchmark</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Breakdown by Layer */}
        <div className="glass-panel p-6">
          <h2 className="text-base font-bold text-white mb-1">Multi-Layer Findings</h2>
          <p className="text-xs text-slate-400 mb-6">Layered detection distribution</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="value" fill="#818cf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active High-Risk Warnings */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" /> Active Risk Findings & Evidence
          </h2>
          <span className="text-xs text-slate-400">Target Batch: <strong>{latestBatch.batch_name}</strong></span>
        </div>

        {latestBatch.risk_findings && latestBatch.risk_findings.length > 0 ? (
          <div className="space-y-3">
            {latestBatch.risk_findings.map((finding) => (
              <div key={finding.id} className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      finding.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {finding.severity}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">[{finding.layer}] {finding.rule_code}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-200 mt-1">{finding.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{finding.description}</p>
                </div>

                <a
                  href="/investigation"
                  className="px-3 py-1.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-medium border border-sky-500/20 flex items-center gap-1 shrink-0"
                >
                  Investigate <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-lg">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No Risk Findings Detected</p>
            <p className="text-xs text-slate-500">The selected payroll batch cleared all deterministic, ML, and graph checks cleanly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
