'use client';

import { useEffect, useState } from 'react';
import { fetchBatches, fetchGraph } from '@/lib/api';
import { GraphPayload, GraphNode, PayrollBatch } from '@/lib/types';
import { Network, AlertOctagon, ShieldAlert, CheckCircle2, User, CreditCard, Laptop, Building, Activity, Info } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-purple-400" /> Enterprise Trust Graph Workspace
          </h1>
          <p className="text-sm text-slate-400 mt-1">Multi-entity graph topology modeling employees, bank accounts, devices, and fraud ring clusters</p>
        </div>

        {/* Batch Selector */}
        <select
          value={selectedBatchId}
          onChange={(e) => {
            setSelectedBatchId(e.target.value);
            loadGraphData(e.target.value);
          }}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:border-purple-400"
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
        {/* Interactive Graph Visualizer Canvas */}
        <div className="lg:col-span-2 glass-panel p-6 relative flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Topology Nodes: {graph?.nodes.length || 0} | Edges: {graph?.edges.length || 0}
            </span>

            <div className="flex items-center gap-2 text-[10px] font-semibold">
              <span className="flex items-center gap-1 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical</span>
              <span className="flex items-center gap-1 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High</span>
              <span className="flex items-center gap-1 text-sky-400"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Normal</span>
            </div>
          </div>

          {/* Interactive Graph Node Representation */}
          <div className="my-8 relative min-h-[380px] bg-slate-950/60 rounded-xl border border-slate-800/80 p-6 flex flex-wrap items-center justify-center gap-6">
            {graph?.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isCritical = node.risk_level === 'CRITICAL';
              const isHigh = node.risk_level === 'HIGH';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border flex items-center gap-3 ${
                    isSelected ? 'ring-2 ring-purple-500 scale-105 shadow-xl shadow-purple-500/20' : ''
                  } ${
                    isCritical
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : isHigh
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isCritical ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-purple-400'
                  }`}>
                    {node.type === 'Employee' && <User className="w-5 h-5" />}
                    {node.type === 'BankAccount' && <CreditCard className="w-5 h-5" />}
                    {node.type === 'Device' && <Laptop className="w-5 h-5" />}
                    {node.type === 'Department' && <Building className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="text-xs font-bold">{node.label}</div>
                    <div className="text-[10px] text-slate-400">{node.type} • {node.risk_level}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Click any node to inspect relationship links and shared infrastructure evidence.
          </div>
        </div>

        {/* Node Detail & Fraud Ring Inspector Drawer */}
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-border pb-3">
            <Activity className="w-4 h-4 text-purple-400" /> Graph Node Inspector
          </h2>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] uppercase tracking-wider font-bold text-purple-400">{selectedNode.type} Entity</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedNode.label}</h3>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  Risk Level: {selectedNode.risk_level}
                </div>
              </div>

              {/* Node Details Object */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-slate-400">Entity Metadata</span>
                {Object.entries(selectedNode.details || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs py-1 border-b border-slate-800/50">
                    <span className="text-slate-400 capitalize">{key.replace('_', ' ')}</span>
                    <span className="font-medium text-slate-200">{String(val)}</span>
                  </div>
                ))}
              </div>

              {/* Connected Relationships */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
                <span className="text-xs font-semibold text-purple-300">Topology Relationship Links</span>
                <p className="text-xs text-slate-400">
                  {selectedNode.type === 'BankAccount' || selectedNode.type === 'Device'
                    ? '⚠️ Infrastructure node shared by multiple employee entities (Coordinated Fraud Ring Cluster).'
                    : 'Linked to organizational department, manager, and payment account nodes.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">Select a node from the canvas to inspect entity properties</div>
          )}
        </div>
      </div>
    </div>
  );
}
