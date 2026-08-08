'use client';

import { useEffect, useState } from 'react';
import { fetchBatches, fetchGraph } from '@/lib/api';
import { GraphPayload, GraphNode, PayrollBatch } from '@/lib/types';
import { Network, User, CreditCard, Laptop, Building, Activity, Info, ShieldAlert, ShieldCheck, Cpu } from 'lucide-react';

export default function TrustGraphPage() {
  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [graph, setGraph] = useState<GraphPayload | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    const data = await fetchBatches();
    setBatches(data);
    if (data.length > 0) {
      const targetId = data[0].id;
      setSelectedBatchId(targetId);
      loadGraphData(targetId);
    }
  }

  async function loadGraphData(batchId: string) {
    const g = await fetchGraph(batchId);
    setGraph(g);
    if (g.nodes.length > 0) {
      setSelectedNode(g.nodes[0]);
    }
  }

  const empCount = graph?.nodes.filter(n => n.type === 'Employee').length || 0;
  const bankCount = graph?.nodes.filter(n => n.type === 'BankAccount').length || 0;
  const deptCount = graph?.nodes.filter(n => n.type === 'Department').length || 0;
  const devCount = graph?.nodes.filter(n => n.type === 'Device').length || 0;
  const ipCount = graph?.nodes.filter(n => n.type === 'IPAddress').length || 0;
  const mgrCount = graph?.nodes.filter(n => n.type === 'Manager').length || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" /> Enterprise Trust Graph Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">Dynamic network topology modeling employees, payment destinations, and shared infrastructure clusters</p>
        </div>

        {/* Batch Selector */}
        <select
          value={selectedBatchId}
          onChange={(e) => {
            setSelectedBatchId(e.target.value);
            loadGraphData(e.target.value);
          }}
          className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono font-semibold rounded-md px-3 py-2 outline-none focus:border-purple-400"
        >
          {batches.map(b => (
            <option key={b.id} value={b.id}>
              {b.batch_name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Graph Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[550px]">
        {/* Dynamic Graph Visualizer Canvas */}
        <div className="lg:col-span-2 minimal-panel p-6 relative flex flex-col justify-between overflow-hidden">
          <div className="flex flex-wrap justify-between items-center gap-3 z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-md border border-purple-500/20">
                Nodes: {graph?.nodes.length || 0} • Edges: {graph?.edges.length || 0}
              </span>
              {graph?.fraud_rings_count ? (
                <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/30 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> {graph.fraud_rings_count} Fraud Cluster Detected
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-3 text-[10px] font-mono font-semibold">
              <span className="text-slate-400">Employees: <strong className="text-slate-200">{empCount}</strong></span>
              <span className="text-slate-400">Banks: <strong className="text-slate-200">{bankCount}</strong></span>
              {deptCount > 0 && <span className="text-slate-400">Depts: <strong className="text-slate-200">{deptCount}</strong></span>}
              {devCount > 0 && <span className="text-slate-400">Devices: <strong className="text-slate-200">{devCount}</strong></span>}
              {ipCount > 0 && <span className="text-slate-400">IPs: <strong className="text-slate-200">{ipCount}</strong></span>}
              {mgrCount > 0 && <span className="text-slate-400">Managers: <strong className="text-slate-200">{mgrCount}</strong></span>}
            </div>
          </div>

          {/* Dynamic Graph Nodes Canvas */}
          <div className="my-6 relative min-h-[380px] bg-slate-950/60 rounded-lg border border-slate-800/80 p-6 flex flex-wrap items-center justify-center gap-4">
            {graph?.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isCritical = node.risk_level === 'CRITICAL';
              const isHigh = node.risk_level === 'HIGH';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3.5 rounded-lg cursor-pointer transition-all border flex items-center gap-3 ${
                    isSelected ? 'ring-2 ring-purple-500 scale-105 bg-slate-900 shadow-lg shadow-purple-500/10' : ''
                  } ${
                    isCritical
                      ? 'bg-rose-950/30 border-rose-500/50 text-rose-200 shadow-sm shadow-rose-500/20'
                      : isHigh
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center ${
                    isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-purple-400'
                  }`}>
                    {node.type === 'Employee' && <User className="w-4 h-4" />}
                    {node.type === 'BankAccount' && <CreditCard className="w-4 h-4" />}
                    {node.type === 'Device' && <Laptop className="w-4 h-4" />}
                    {node.type === 'IPAddress' && <Cpu className="w-4 h-4" />}
                    {node.type === 'Department' && <Building className="w-4 h-4" />}
                    {node.type === 'Manager' && <User className="w-4 h-4 text-emerald-400" />}
                  </div>

                  <div>
                    <div className="text-xs font-bold">{node.label}</div>
                    <div className="text-[10px] font-mono text-slate-400">{node.type} • {node.risk_level}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <Info className="w-3.5 h-3.5" /> Click any node on the graph canvas to inspect relationships, evidence, and entity properties.
          </div>
        </div>

        {/* Dynamic Graph Node Inspector */}
        <div className="minimal-panel p-6 space-y-5">
          <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-border pb-3">
            <Activity className="w-4 h-4 text-purple-400" /> Graph Node Inspector
          </h2>

          {selectedNode ? (
            <div className="space-y-4">
              {/* Header Box */}
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] uppercase font-mono font-bold text-purple-400">{selectedNode.type} Entity</span>
                <h3 className="text-base font-bold text-white mt-1">{selectedNode.label}</h3>
                <div className={`mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  selectedNode.risk_level === 'CRITICAL'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : (selectedNode.risk_level === 'HIGH' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20')
                }`}>
                  Risk Level: {selectedNode.risk_level}
                </div>
              </div>

              {/* Dynamic Entity Metadata */}
              <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400">Ingested Entity Fields</span>
                {Object.entries(selectedNode.details || {})
                  .filter(([k]) => k !== 'evidence' && k !== 'pattern')
                  .map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs py-1 border-b border-slate-800/40">
                      <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-mono font-medium text-slate-200">
                        {Array.isArray(val) ? val.join(', ') : String(val || 'Data unavailable')}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Dynamic Pattern & Evidence Box */}
              <div className={`p-4 rounded-lg border space-y-2 ${
                selectedNode.risk_level === 'CRITICAL'
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase">
                  {selectedNode.risk_level === 'CRITICAL' ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>{selectedNode.details?.pattern || 'Coordinated Fraud Ring Pattern'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{selectedNode.details?.pattern || 'Standard Verified Relationship'}</span>
                    </>
                  )}
                </div>

                <div className="space-y-1 mt-2">
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Supporting Evidence</span>
                  {selectedNode.details?.evidence && Array.isArray(selectedNode.details.evidence) ? (
                    selectedNode.details.evidence.map((ev: string, idx: number) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 font-mono">
                        <span className="text-purple-400">•</span> {ev}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 font-mono">
                      {selectedNode.type === 'BankAccount'
                        ? (selectedNode.details?.used_by_count > 1 ? `Shared by ${selectedNode.details?.used_by_count} employees.` : 'Unique payment destination. No shared-account anomaly detected.')
                        : 'Verified relationship topology link.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12 text-xs font-mono">Select a node from the canvas to inspect entity properties</div>
          )}
        </div>
      </div>
    </div>
  );
}
