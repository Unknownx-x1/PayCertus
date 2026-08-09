'use client';

import { useEffect, useState, useMemo } from 'react';
import { fetchBatches, fetchGraph } from '@/lib/api';
import { GraphPayload, GraphNode, GraphEdge, PayrollBatch } from '@/lib/types';
import { Network, User, CreditCard, Laptop, Building, Activity, Info, ShieldAlert, ShieldCheck, Cpu, Search, Eye, RefreshCw } from 'lucide-react';

export default function TrustGraphPage() {
  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [graph, setGraph] = useState<GraphPayload | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'ALL' | 'CRITICAL_RING' | 'BANKS' | 'EMPLOYEES'>('ALL');
  const [focusClusterOnly, setFocusClusterOnly] = useState<boolean>(false);

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    try {
      const data = await fetchBatches();
      if (Array.isArray(data) && data.length > 0) {
        setBatches(data);
        const urlParams = new URLSearchParams(window.location.search);
        const queryBatchId = urlParams.get('batch');
        const targetId = (queryBatchId && data.some(b => b.id === queryBatchId)) ? queryBatchId : data[0].id;
        setSelectedBatchId(targetId);
        await loadGraphData(targetId);
      }
    } catch (err) {
      console.warn('Error loading batches in TrustGraphPage:', err);
    }
  }

  async function loadGraphData(batchId: string) {
    if (!batchId) return;
    try {
      const g = await fetchGraph(batchId);
      if (g && Array.isArray(g.nodes) && Array.isArray(g.edges)) {
        setGraph(g);
        if (g.nodes.length > 0) {
          const ringNode = g.nodes.find(n => (n.label && n.label.includes('AC9001')) || n.risk_level === 'CRITICAL');
          setSelectedNode(ringNode || g.nodes[0]);
        } else {
          setSelectedNode(null);
        }
      }
    } catch (err) {
      console.warn('Error loading graph data in TrustGraphPage:', err);
    }
  }

  // Connected nodes and edges map for relationship dimming & cluster isolation
  const activeClusterNodeIds = useMemo(() => {
    if (!selectedNode || !graph || !Array.isArray(graph.edges)) return new Set<string>();

    const connectedIds = new Set<string>();
    connectedIds.add(selectedNode.id);

    graph.edges.forEach(edge => {
      if (edge && edge.source === selectedNode.id) connectedIds.add(edge.target);
      if (edge && edge.target === selectedNode.id) connectedIds.add(edge.source);
    });

    return connectedIds;
  }, [selectedNode, graph]);

  // 2D Network Node Position Layout Engine
  const nodePositions = useMemo(() => {
    if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return {};

    const positions: Record<string, { x: number; y: number }> = {};
    const empNodes = graph.nodes.filter(n => n && n.type === 'Employee');
    const bankNodes = graph.nodes.filter(n => n && n.type === 'BankAccount');
    const otherNodes = graph.nodes.filter(n => n && n.type !== 'Employee' && n.type !== 'BankAccount');

    // Layout Employee Nodes in Column A (Left)
    empNodes.forEach((node, idx) => {
      if (node && node.id) {
        positions[node.id] = {
          x: 140,
          y: 40 + idx * 46
        };
      }
    });

    // Layout Bank Account Nodes in Column B (Right)
    let bankIdx = 0;
    bankNodes.forEach((node) => {
      if (!node || !node.id) return;
      const connEdges = graph.edges.filter(e => e && (e.target === node.id || e.source === node.id));
      const connEmpIds = connEdges.map(e => e.source === node.id ? e.target : e.source);

      if (connEmpIds.length >= 2) {
        // Shared bank account cluster: position centrally aligned to its connected employees
        const empYs = connEmpIds.map(eid => positions[eid]?.y).filter(Boolean);
        const avgY = empYs.length > 0 ? empYs.reduce((a, b) => a + b, 0) / empYs.length : 240;
        positions[node.id] = { x: 580, y: avgY };
      } else {
        // Unique bank account: position aligned to its single connected employee
        const empId = connEmpIds[0];
        if (empId && positions[empId]) {
          positions[node.id] = { x: 580, y: positions[empId].y };
        } else {
          positions[node.id] = { x: 580, y: 50 + bankIdx * 65 };
          bankIdx++;
        }
      }
    });

    // Layout optional entity nodes (Devices, IPs, Depts, Managers) if present in dataset
    otherNodes.forEach((node, idx) => {
      if (node && node.id) {
        positions[node.id] = { x: 360, y: 80 + idx * 60 };
      }
    });

    return positions;
  }, [graph]);

  // Filtered nodes based on user search & filter toggle
  const filteredNodes = useMemo(() => {
    if (!graph || !Array.isArray(graph.nodes)) return [];

    // Find all critical node IDs and their connected node IDs for Fraud Ring Clusters
    const criticalClusterNodeIds = new Set<string>();
    if (graph.nodes && graph.edges) {
      const criticalNodes = graph.nodes.filter(n => n && (n.risk_level === 'CRITICAL' || (n.label && (n.label.includes('AC9001') || n.label.includes('AC9100')))));
      criticalNodes.forEach(cn => {
        criticalClusterNodeIds.add(cn.id);
        graph.edges.forEach(e => {
          if (e && e.source === cn.id) criticalClusterNodeIds.add(e.target);
          if (e && e.target === cn.id) criticalClusterNodeIds.add(e.source);
        });
      });
    }

    return graph.nodes.filter(n => {
      if (!n) return false;
      if (focusClusterOnly && selectedNode) {
        if (!activeClusterNodeIds.has(n.id)) return false;
      }

      const label = n.label || '';
      const type = n.type || '';
      const matchesSearch = label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        type.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterType === 'CRITICAL_RING') return criticalClusterNodeIds.has(n.id);
      if (filterType === 'BANKS') return n.type === 'BankAccount';
      if (filterType === 'EMPLOYEES') return n.type === 'Employee';
      return true;
    });
  }, [graph, searchQuery, filterType, focusClusterOnly, selectedNode, activeClusterNodeIds]);

  const empCount = graph && Array.isArray(graph.nodes) ? graph.nodes.filter(n => n && n.type === 'Employee').length : 0;
  const bankCount = graph && Array.isArray(graph.nodes) ? graph.nodes.filter(n => n && n.type === 'BankAccount').length : 0;
  const canvasHeight = Math.max(500, empCount * 48 + 40);

  return (
    <div className="space-y-5 max-w-7xl mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-4 h-4 text-white" /> Enterprise Trust Graph Workspace
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-0.5">Interactive 2D topology map rendering relationships between employees, bank destinations, and fraud ring clusters</p>
        </div>

        {/* Batch Selector */}
        <select
          value={selectedBatchId}
          onChange={(e) => {
            setSelectedBatchId(e.target.value);
            loadGraphData(e.target.value);
          }}
          className="bg-[#18181b] border border-[#27272a] text-white text-xs font-mono font-semibold rounded px-3 py-2 outline-none focus:border-white"
        >
          {batches.map(b => (
            <option key={b.id} value={b.id}>
              {b.batch_name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Graph Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-[580px]">
        {/* Dynamic 2D SVG Graph Network Visualizer Canvas */}
        <div className="lg:col-span-2 enterprise-card p-5 relative flex flex-col justify-between overflow-hidden">
          {/* Header Controls & Filter Bar */}
          <div className="flex flex-wrap justify-between items-center gap-3 z-10 border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-white bg-[#27272a] px-2.5 py-1 rounded border border-[#3f3f46]">
                Nodes: {graph?.nodes.length || 0} • Edges: {graph?.edges.length || 0}
              </span>
              {graph?.fraud_rings_count ? (
                <span className="text-[10px] font-mono font-bold text-[#fca5a5] bg-[#3f1214] px-2.5 py-1 rounded border border-[#7f1d1d] flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> {graph.fraud_rings_count} Coordinated Fraud Cluster{graph.fraud_rings_count > 1 ? 's' : ''}
                </span>
              ) : null}
            </div>

            {/* Filter & Focus Controls */}
            <div className="flex flex-wrap items-center gap-1 bg-[#09090b] p-1 rounded border border-[#27272a] text-[11px] font-mono">
              <button
                onClick={() => { setFilterType('ALL'); setFocusClusterOnly(false); }}
                className={`px-2.5 py-0.5 rounded font-semibold transition ${filterType === 'ALL' && !focusClusterOnly ? 'bg-white text-black font-bold' : 'text-[#a1a1aa] hover:text-white'}`}
              >
                All Nodes
              </button>
              <button
                onClick={() => setFilterType('CRITICAL_RING')}
                className={`px-2.5 py-0.5 rounded font-semibold transition ${filterType === 'CRITICAL_RING' ? 'bg-[#b91c1c] text-white font-bold' : 'text-[#a1a1aa] hover:text-white'}`}
              >
                Fraud Clusters
              </button>
              <button
                onClick={() => setFilterType('EMPLOYEES')}
                className={`px-2.5 py-0.5 rounded font-semibold transition ${filterType === 'EMPLOYEES' ? 'bg-[#27272a] text-white font-bold' : 'text-[#a1a1aa] hover:text-white'}`}
              >
                Employees ({empCount})
              </button>
              <button
                onClick={() => setFilterType('BANKS')}
                className={`px-2.5 py-0.5 rounded font-semibold transition ${filterType === 'BANKS' ? 'bg-[#27272a] text-white font-bold' : 'text-[#a1a1aa] hover:text-white'}`}
              >
                Banks ({bankCount})
              </button>
              <button
                onClick={() => setFocusClusterOnly(!focusClusterOnly)}
                className={`px-2.5 py-0.5 rounded font-semibold transition border flex items-center gap-1 ${
                  focusClusterOnly ? 'bg-white text-black border-white font-bold' : 'border-[#3f3f46] text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" /> {focusClusterOnly ? 'Reset Focus' : 'Focus Cluster'}
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="mt-3 relative w-full">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search node by name or account ID (e.g. Arjun, AC9001)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] rounded pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          {/* 2D Interactive SVG Network Topology Canvas */}
          <div className="my-3 relative bg-[#09090b] rounded border border-[#27272a] overflow-x-auto" style={{ minHeight: `${canvasHeight}px` }}>
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ width: '100%', height: `${canvasHeight}px` }}
            >
              <defs>
                <marker id="arrow-critical" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#fca5a5" />
                </marker>
                <marker id="arrow-normal" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#71717a" />
                </marker>
              </defs>

              {/* Draw 2D Graph Connection Lines */}
              {graph?.edges.map((edge) => {
                const sourcePos = nodePositions[edge.source];
                const targetPos = nodePositions[edge.target];
                if (!sourcePos || !targetPos) return null;

                const isSourceVisible = filteredNodes.some(fn => fn.id === edge.source);
                const isTargetVisible = filteredNodes.some(fn => fn.id === edge.target);
                if (!isSourceVisible || !isTargetVisible) return null;

                const isConnectedToSelected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);
                const isEdgeCritical = edge.risk_level === 'CRITICAL';
                
                // Dim lines not connected to selected node when a node is selected
                const edgeOpacity = selectedNode ? (isConnectedToSelected ? 1 : 0.15) : 0.8;

                return (
                  <g key={edge.id} style={{ opacity: edgeOpacity }}>
                    <line
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={isEdgeCritical ? '#fca5a5' : '#3f3f46'}
                      strokeWidth={isConnectedToSelected ? '3' : (isEdgeCritical ? '2' : '1')}
                      strokeDasharray={isEdgeCritical ? 'none' : '3 3'}
                      markerEnd={isEdgeCritical ? 'url(#arrow-critical)' : 'url(#arrow-normal)'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Render Interactive 2D Graph Node Position Cards */}
            {graph?.nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isVisible = filteredNodes.some(fn => fn.id === node.id);
              if (!isVisible) return null;

              const isSelected = selectedNode?.id === node.id;
              const isInSelectedCluster = activeClusterNodeIds.has(node.id);
              const isCritical = node.risk_level === 'CRITICAL';

              // Dim nodes outside active selection cluster when focus mode is active
              const nodeOpacity = (focusClusterOnly && selectedNode)
                ? (isSelected ? 1 : (isInSelectedCluster ? 0.9 : 0.15))
                : 1;
;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    position: 'absolute',
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: 'translate(-50%, -50%)',
                    opacity: nodeOpacity
                  }}
                  className={`px-3 py-2 rounded cursor-pointer transition-all border flex items-center gap-2 font-mono ${
                    isSelected ? 'ring-2 ring-white bg-white text-black z-30 font-bold shadow-lg scale-105' : ''
                  } ${
                    !isSelected && isCritical
                      ? 'bg-[#3f1214] border-[#7f1d1d] text-[#fca5a5] z-20'
                      : (!isSelected ? 'bg-[#18181b] border-[#27272a] text-[#fafafa] hover:border-[#3f3f46] z-10' : '')
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${
                    isSelected
                      ? 'bg-black text-white'
                      : (isCritical ? 'bg-[#5c1d20] text-[#fca5a5]' : 'bg-[#27272a] text-white')
                  }`}>
                    {node.type === 'Employee' && <User className="w-3.5 h-3.5" />}
                    {node.type === 'BankAccount' && <CreditCard className="w-3.5 h-3.5" />}
                    {node.type === 'Device' && <Laptop className="w-3.5 h-3.5" />}
                    {node.type === 'IPAddress' && <Cpu className="w-3.5 h-3.5" />}
                    {node.type === 'Department' && <Building className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <div className="text-[11px] font-bold leading-tight">{node.label}</div>
                    <div className="text-[9px] opacity-70 uppercase tracking-tighter">
                      {node.type} {node.details?.used_by_count > 1 ? `(${node.details.used_by_count} EMPS)` : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-[#a1a1aa] flex items-center justify-between font-mono pt-2 border-t border-[#27272a]">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-white" /> Click any node to inspect relationship edges. Unrelated nodes dim automatically.
            </span>
            <span className="text-[#71717a]">2D Dynamic Layout Active</span>
          </div>
        </div>

        {/* Graph Node Inspector Drawer */}
        <div className="enterprise-card p-5 space-y-4">
          <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#27272a] pb-3">
            <Activity className="w-4 h-4 text-white" /> Graph Node Inspector
          </h2>

          {selectedNode ? (
            <div className="space-y-3">
              {/* Header Box */}
              <div className="p-3.5 rounded bg-[#09090b] border border-[#27272a]">
                <span className="text-[10px] uppercase font-mono font-bold text-[#a1a1aa]">{selectedNode.type} Entity</span>
                <h3 className="text-base font-bold text-white mt-0.5 font-mono">{selectedNode.label}</h3>
                <div className={`mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  selectedNode.risk_level === 'CRITICAL'
                    ? 'bg-[#3f1214] text-[#fca5a5] border-[#7f1d1d]'
                    : 'bg-[#064e3b] text-[#6ee7b7] border-[#047857]'
                }`}>
                  Risk Level: {selectedNode.risk_level}
                </div>
              </div>

              {/* Dynamic Entity Metadata */}
              <div className="p-3.5 rounded bg-[#09090b] border border-[#27272a] space-y-1.5 font-mono">
                <span className="text-xs font-semibold text-[#a1a1aa] font-sans uppercase">Ingested Entity Fields</span>
                {Object.entries(selectedNode.details || {})
                  .filter(([k]) => k !== 'evidence' && k !== 'pattern')
                  .map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa] capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium text-white">
                        {Array.isArray(val) ? val.join(', ') : String(val || 'Data unavailable')}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Dynamic Pattern & Evidence Box */}
              <div className={`p-3.5 rounded border space-y-2 ${
                selectedNode.risk_level === 'CRITICAL'
                  ? 'bg-[#3f1214] border-[#7f1d1d] text-[#fca5a5]'
                  : 'bg-[#09090b] border-[#27272a] text-[#f4f4f5]'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase">
                  {selectedNode.risk_level === 'CRITICAL' ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-[#fca5a5]" />
                      <span>{selectedNode.details?.pattern || 'Coordinated Fraud Ring Pattern'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#6ee7b7]" />
                      <span>{selectedNode.details?.pattern || 'Standard Verified Relationship'}</span>
                    </>
                  )}
                </div>

                <div className="space-y-1 mt-1.5">
                  <span className="text-[10px] font-mono font-semibold uppercase text-[#a1a1aa]">Supporting Evidence</span>
                  {selectedNode.details?.evidence && Array.isArray(selectedNode.details.evidence) ? (
                    selectedNode.details.evidence.map((ev: string, idx: number) => (
                      <div key={idx} className="text-xs text-[#f4f4f5] flex items-start gap-1.5 font-mono">
                        <span className="text-white">•</span> {ev}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#a1a1aa] font-mono">
                      {selectedNode.type === 'BankAccount'
                        ? (selectedNode.details?.used_by_count > 1 ? `Shared by ${selectedNode.details?.used_by_count} employees.` : 'Unique payment destination. No shared-account anomaly detected.')
                        : 'Verified relationship topology link.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-[#71717a] py-12 text-xs font-mono">Select a node from the canvas to inspect entity properties</div>
          )}
        </div>
      </div>
    </div>
  );
}
