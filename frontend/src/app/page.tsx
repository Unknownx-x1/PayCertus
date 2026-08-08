'use client';

import { useEffect, useState } from 'react';
import { fetchBatches, triggerSampleBatch } from '@/lib/api';
import { PayrollBatch } from '@/lib/types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Users, Network, ArrowUpRight, Activity, Zap } from 'lucide-react';

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

  const ruleCount = (latestBatch.risk_findings || []).filter(f => f.layer === 'RULE').length;
  const mlCount = (latestBatch.risk_findings || []).filter(f => f.layer === 'ANOMALY').length;
  const graphCount = (latestBatch.risk_findings || []).filter(f => f.layer === 'GRAPH').length;
  const maxLayerCount = Math.max(1, ruleCount, mlCount, graphCount);

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 minimal-panel p-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">PayCertus Executive Integrity Dashboard</h1>
          <p className="text-xs text-neutral-400 mt-1">Pre-disbursement payroll integrity & fraud risk evaluation</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => { await triggerSampleBatch('clean'); loadData(); }}
            className="minimal-btn-secondary"
          >
            Load Clean Preset
          </button>
          <button
            onClick={async () => { await triggerSampleBatch('fraud'); loadData(); }}
            className="minimal-btn-primary"
          >
            <Zap className="w-3.5 h-3.5" /> Load Fraud Ring Preset
          </button>
        </div>
      </div>

      {/* Minimalist Monochromatic KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payroll Integrity Score (PIS) */}
        <div className="minimal-panel p-5">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">Integrity Score (PIS)</span>
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold font-mono ${pisScore < 40 ? 'text-rose-400' : (pisScore < 70 ? 'text-amber-400' : 'text-white')}`}>
              {pisScore}
            </span>
            <span className="text-xs text-neutral-500 font-mono">/ 100</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#171717] border border-[#262626]">
            Decision: <span className={pisScore < 40 ? 'text-rose-400 font-bold' : 'text-white font-bold'}>{latestBatch.status}</span>
          </div>
        </div>

        {/* Total Batch Value */}
        <div className="minimal-panel p-5">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">Payroll Batch Value</span>
            <Users className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold font-mono text-white">
            ${latestBatch.total_amount ? latestBatch.total_amount.toLocaleString() : '0'}
          </div>
          <div className="mt-3 text-xs text-neutral-400">
            {latestBatch.total_employees} Employees evaluated
          </div>
        </div>

        {/* High Risk Anomalies */}
        <div className="minimal-panel p-5">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">Critical Anomalies</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold font-mono text-rose-400">
            {criticalFindings.length + highFindings.length}
          </div>
          <div className="mt-3 text-xs text-neutral-400">
            {criticalFindings.length} Critical • {highFindings.length} High Risk
          </div>
        </div>

        {/* Trust Graph Rings */}
        <div className="minimal-panel p-5">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">Fraud Rings</span>
            <Network className="w-4 h-4 text-white" />
          </div>
          <div className="mt-3 text-3xl font-extrabold font-mono text-white">
            {(latestBatch.risk_findings || []).filter(f => f.layer === 'GRAPH').length > 0 ? '1' : '0'}
          </div>
          <div className="mt-3 text-xs text-neutral-400">
            Trust Graph ring cluster isolated
          </div>
        </div>
      </div>

      {/* Main Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integrity Trend SVG Chart */}
        <div className="lg:col-span-2 minimal-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Historical Integrity Score Trend</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Continuous evaluation score timeline</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-white bg-[#171717] px-2.5 py-1 rounded border border-[#262626]">Monthly Benchmark</span>
          </div>

          <div className="h-60 relative flex flex-col justify-between">
            <div className="w-full flex-1 flex items-end justify-between px-4 pb-2 pt-6 relative border-b border-[#262626]">
              {/* Monochromatic Trend Line */}
              <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" preserveAspectRatio="none">
                <path
                  d={`M 20 ${180 - (98/100)*140} L 180 ${180 - (95/100)*140} L 340 ${180 - (98/100)*140} L 500 ${180 - (pisScore/100)*140}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              </svg>

              {trendData.map((item, idx) => (
                <div key={idx} className="z-10 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-white bg-[#171717] px-2 py-0.5 rounded border border-[#262626]">
                    {item.score}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-black shadow-md"></div>
                </div>
              ))}
            </div>

            <div className="flex justify-between px-2 pt-2 text-[11px] font-mono text-neutral-400">
              {trendData.map((item, idx) => (
                <span key={idx}>{item.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Layer Breakdown Bar Chart */}
        <div className="minimal-panel p-6">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-1">Layer Breakdown</h2>
          <p className="text-xs text-neutral-400 mb-6">Multi-layer findings distribution</p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-neutral-300">
                <span>Rules Layer</span>
                <span className="font-bold text-white">{ruleCount}</span>
              </div>
              <div className="w-full bg-[#171717] h-2.5 rounded-full overflow-hidden border border-[#262626]">
                <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${(ruleCount / maxLayerCount) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-neutral-300">
                <span>ML Anomaly</span>
                <span className="font-bold text-neutral-300">{mlCount}</span>
              </div>
              <div className="w-full bg-[#171717] h-2.5 rounded-full overflow-hidden border border-[#262626]">
                <div className="bg-neutral-400 h-full rounded-full transition-all duration-500" style={{ width: `${(mlCount / maxLayerCount) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-neutral-300">
                <span>Trust Graph</span>
                <span className="font-bold text-neutral-200">{graphCount}</span>
              </div>
              <div className="w-full bg-[#171717] h-2.5 rounded-full overflow-hidden border border-[#262626]">
                <div className="bg-neutral-200 h-full rounded-full transition-all duration-500" style={{ width: `${(graphCount / maxLayerCount) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Findings */}
      <div className="minimal-panel p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Active Risk Findings & Evidence
          </h2>
          <span className="text-xs text-neutral-400">Target Batch: <strong className="text-white font-mono">{latestBatch.batch_name}</strong></span>
        </div>

        {latestBatch.risk_findings && latestBatch.risk_findings.length > 0 ? (
          <div className="space-y-3">
            {latestBatch.risk_findings.map((finding) => (
              <div key={finding.id} className="p-4 rounded-lg bg-[#050505] border border-[#262626] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      finding.severity === 'CRITICAL' ? 'bg-[#18090a] text-rose-400 border border-[#7f1d1d]' : 'bg-[#171717] text-neutral-300 border border-[#333333]'
                    }`}>
                      {finding.severity}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">[{finding.layer}] {finding.rule_code}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{finding.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{finding.description}</p>
                </div>

                <a
                  href="/investigation"
                  className="px-3 py-1.5 rounded-md bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold border border-[#333333] flex items-center gap-1 shrink-0 transition"
                >
                  Investigate <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-400 border border-dashed border-[#262626] rounded-lg">
            <ShieldCheck className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No Risk Findings Detected</p>
            <p className="text-xs text-neutral-400 mt-1">The selected payroll batch cleared all deterministic, ML, and graph checks cleanly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
