'use client';

import { useEffect, useState } from 'react';
import { fetchBatches, triggerSampleBatch } from '@/lib/api';
import { PayrollBatch } from '@/lib/types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Users, Network, ArrowUpRight, Activity, Zap, TrendingUp } from 'lucide-react';

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
    <div className="space-y-5 max-w-7xl mx-auto select-none">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 enterprise-card p-5">
        <div>
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#a1a1aa] bg-[#27272a] px-2 py-0.5 rounded border border-[#3f3f46]">
            Enterprise Platform
          </span>
          <h1 className="text-lg font-bold text-white tracking-tight mt-1.5">PayCertus Executive Integrity Dashboard</h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Pre-disbursement payroll fraud evaluation, ML anomaly detection, and trust graph ring analytics</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={async () => { await triggerSampleBatch('clean'); loadData(); }}
            className="btn-solid-secondary"
          >
            Load Clean Preset
          </button>
          <button
            onClick={async () => { await triggerSampleBatch('fraud'); loadData(); }}
            className="btn-solid-danger"
          >
            <Zap className="w-3.5 h-3.5" /> Load Fraud Ring Preset
          </button>
        </div>
      </div>

      {/* Solid Enterprise KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Payroll Integrity Score (PIS Card) */}
        <div className="enterprise-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#a1a1aa] uppercase tracking-wider">Integrity Score (PIS)</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className={`text-3xl font-extrabold font-mono ${pisScore < 40 ? 'text-[#fca5a5]' : 'text-[#6ee7b7]'}`}>
                {pisScore}
              </span>
              <span className="text-xs text-[#71717a] font-mono">/ 100</span>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                latestBatch.status === 'BLOCKED' ? 'bg-[#3f1214] text-[#fca5a5] border border-[#7f1d1d]' : 'bg-[#064e3b] text-[#6ee7b7] border border-[#047857]'
              }`}>
                {latestBatch.status}
              </span>
            </div>
          </div>

          <div className="w-12 h-12 rounded bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Total Batch Value */}
        <div className="enterprise-card p-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold text-[#a1a1aa] uppercase tracking-wider">Payroll Batch Value</span>
            <Users className="w-4 h-4 text-[#71717a]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-white">
            ${latestBatch.total_amount ? latestBatch.total_amount.toLocaleString() : '0'}
          </div>
          <div className="mt-2 text-xs text-[#a1a1aa] font-mono">
            {latestBatch.total_employees} Employees evaluated
          </div>
        </div>

        {/* High Risk Anomalies */}
        <div className="enterprise-card p-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold text-[#a1a1aa] uppercase tracking-wider">Critical Anomalies</span>
            <AlertTriangle className="w-4 h-4 text-[#fca5a5]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-[#fca5a5]">
            {criticalFindings.length + highFindings.length}
          </div>
          <div className="mt-2 text-xs text-[#a1a1aa] font-mono">
            {criticalFindings.length} Critical • {highFindings.length} High Risk
          </div>
        </div>

        {/* Trust Graph Rings */}
        <div className="enterprise-card p-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold text-[#a1a1aa] uppercase tracking-wider">Fraud Rings</span>
            <Network className="w-4 h-4 text-white" />
          </div>
          <div className="mt-2 text-2xl font-extrabold font-mono text-white">
            {(latestBatch.risk_findings || []).filter(f => f.layer === 'GRAPH').length > 0 ? '1' : '0'}
          </div>
          <div className="mt-2 text-xs text-[#a1a1aa] font-mono">
            Trust Graph ring cluster isolated
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Trend Chart */}
        <div className="lg:col-span-2 enterprise-card p-5">
          <div className="flex justify-between items-center mb-5 border-b border-[#27272a] pb-3">
            <div>
              <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-white" /> Historical Integrity Score Trend
              </h2>
              <p className="text-[11px] text-[#a1a1aa] mt-0.5">Continuous evaluation score timeline</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-white bg-[#27272a] px-2.5 py-1 rounded border border-[#3f3f46]">Monthly Benchmark</span>
          </div>

          <div className="h-56 relative flex flex-col justify-between">
            <div className="w-full flex-1 flex items-end justify-between px-4 pb-2 pt-6 relative border-b border-[#27272a]">
              {/* Clean Solid Line */}
              <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" preserveAspectRatio="none">
                <path
                  d={`M 20 ${180 - (98/100)*140} L 180 ${180 - (95/100)*140} L 340 ${180 - (98/100)*140} L 500 ${180 - (pisScore/100)*140}`}
                  fill="none"
                  stroke="#fafafa"
                  strokeWidth="2"
                />
              </svg>

              {trendData.map((item, idx) => (
                <div key={idx} className="z-10 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-white bg-[#27272a] px-2 py-0.5 rounded border border-[#3f3f46]">
                    {item.score}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-white border border-[#09090b]"></div>
                </div>
              ))}
            </div>

            <div className="flex justify-between px-2 pt-2 text-[11px] font-mono text-[#a1a1aa]">
              {trendData.map((item, idx) => (
                <span key={idx}>{item.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Layer Breakdown */}
        <div className="enterprise-card p-5">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider mb-1">Layer Breakdown</h2>
          <p className="text-[11px] text-[#a1a1aa] mb-5">Multi-layer findings distribution</p>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-[#f4f4f5]">
                <span>Deterministic Rules</span>
                <span className="font-bold text-white">{ruleCount}</span>
              </div>
              <div className="w-full bg-[#09090b] h-2 rounded overflow-hidden border border-[#27272a]">
                <div className="bg-white h-full transition-all duration-300" style={{ width: `${(ruleCount / maxLayerCount) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-[#f4f4f5]">
                <span>ML Isolation Forest</span>
                <span className="font-bold text-white">{mlCount}</span>
              </div>
              <div className="w-full bg-[#09090b] h-2 rounded overflow-hidden border border-[#27272a]">
                <div className="bg-[#a1a1aa] h-full transition-all duration-300" style={{ width: `${(mlCount / maxLayerCount) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-[#f4f4f5]">
                <span>Trust Graph Topology</span>
                <span className="font-bold text-white">{graphCount}</span>
              </div>
              <div className="w-full bg-[#09090b] h-2 rounded overflow-hidden border border-[#27272a]">
                <div className="bg-[#71717a] h-full transition-all duration-300" style={{ width: `${(graphCount / maxLayerCount) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Findings Feed */}
      <div className="enterprise-card p-5">
        <div className="flex justify-between items-center mb-4 border-b border-[#27272a] pb-3">
          <h2 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#fca5a5]" /> Active Risk Findings & Structured Evidence
          </h2>
          <span className="text-xs font-mono text-[#a1a1aa]">Target Batch: <strong className="text-white font-mono">{latestBatch.batch_name}</strong></span>
        </div>

        {latestBatch.risk_findings && latestBatch.risk_findings.length > 0 ? (
          <div className="space-y-2.5">
            {latestBatch.risk_findings.map((finding) => (
              <div key={finding.id} className="p-3.5 rounded bg-[#09090b] border border-[#27272a] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-[#3f3f46] transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      finding.severity === 'CRITICAL' ? 'bg-[#3f1214] text-[#fca5a5] border border-[#7f1d1d]' : 'bg-[#27272a] text-[#f4f4f5] border border-[#3f3f46]'
                    }`}>
                      {finding.severity}
                    </span>
                    <span className="text-xs font-mono text-[#a1a1aa]">[{finding.layer}] {finding.rule_code}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white mt-1">{finding.title}</h3>
                  <p className="text-xs text-[#a1a1aa] mt-0.5 font-mono">{finding.description}</p>
                </div>

                <a
                  href="/investigation"
                  className="btn-solid-secondary shrink-0 text-xs py-1"
                >
                  Investigate <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-[#a1a1aa] border border-dashed border-[#27272a] rounded">
            <ShieldCheck className="w-6 h-6 text-[#6ee7b7] mx-auto mb-2" />
            <p className="text-xs font-semibold text-white">No Risk Findings Detected</p>
            <p className="text-[11px] text-[#71717a] mt-0.5 font-mono">The selected payroll batch cleared all deterministic, ML, and graph checks cleanly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
