'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { fetchBatches, fetchGraph } from '@/lib/api';
import { GraphPayload, GraphNode, GraphEdge, PayrollBatch } from '@/lib/types';
import {
  Network,
  User,
  CreditCard,
  Laptop,
  Building,
  Activity,
  Info,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Search,
  RefreshCw,
  ArrowRight,
  Zap,
} from 'lucide-react';

type FilterMode = 'ALL' | 'CRITICAL_RING' | 'BANKS' | 'EMPLOYEES' | 'FOCUS';

export default function TrustGraphPage() {
  const [batches, setBatches] = useState<PayrollBatch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [graph, setGraph] = useState<GraphPayload | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterMode>('ALL');
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);

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

  // Reset all filters and search state to initial full topology view
  const handleResetFilters = () => {
    setActiveFilter('ALL');
    setSelectedClusterId(null);
    setSearchQuery('');
    setSelectedEdge(null);
    if (graph && graph.nodes.length > 0) {
      const ringNode = graph.nodes.find(n => (n.label && n.label.includes('AC9001')) || n.risk_level === 'CRITICAL');
      setSelectedNode(ringNode || graph.nodes[0]);
    }
  };

  // Connected nodes set for active selection highlighting & relationship dimming
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

  // Set of Node IDs belonging to detected Coordinated Fraud Clusters (AC9001 & AC9100 + connected employees)
  const fraudClusterNodeIds = useMemo(() => {
    const set = new Set<string>();
    if (graph && Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
      const fraudBankNodes = graph.nodes.filter(n =>
        n && n.type === 'BankAccount' &&
        (
          (n.label && (n.label.includes('AC9001') || n.label.includes('AC9100'))) ||
          (n.details?.used_by_count && n.details.used_by_count >= 2 && n.details?.pattern?.includes('Cluster'))
        )
      );

      fraudBankNodes.forEach(bankNode => {
        set.add(bankNode.id);
        graph.edges.forEach(e => {
          if (e && e.source === bankNode.id) set.add(e.target);
          if (e && e.target === bankNode.id) set.add(e.source);
        });
      });
    }
    return set;
  }, [graph]);

  // Set of Node IDs for Focus Cluster mode (AC9001 or AC9100 cluster)
  const focusedClusterNodeIds = useMemo(() => {
    const set = new Set<string>();
    if (graph && Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
      const targetAcc = selectedClusterId || 'AC9001';
      const targetBankNode = graph.nodes.find(n => n.type === 'BankAccount' && n.label === targetAcc) ||
        graph.nodes.find(n => n.type === 'BankAccount' && (n.label?.includes('AC9001') || n.risk_level === 'CRITICAL'));

      if (targetBankNode) {
        set.add(targetBankNode.id);
        graph.edges.forEach(e => {
          if (e && e.source === targetBankNode.id) set.add(e.target);
          if (e && e.target === targetBankNode.id) set.add(e.source);
        });
      }
    }
    return set;
  }, [graph, selectedClusterId]);

  // Derived Visible Nodes List based strictly on current activeFilter and searchQuery
  const visibleNodes = useMemo(() => {
    if (!graph || !Array.isArray(graph.nodes)) return [];
    const allNodes = graph.nodes;

    // 1. Search Query Filter Mode
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      return allNodes.filter(node => {
        const { id, type, label, details } = node;
        const empIdMatch = details?.employee_id?.toLowerCase().includes(query);
        const empNameMatch = details?.name?.toLowerCase().includes(query);
        const bankAccMatch = details?.bank_account?.toLowerCase().includes(query) || details?.account_number?.toLowerCase().includes(query);
        const labelMatch = label.toLowerCase().includes(query);
        const typeMatch = type.toLowerCase().includes(query);

        if (empIdMatch || empNameMatch || bankAccMatch || labelMatch || typeMatch) return true;

        if (Array.isArray(graph.edges)) {
          return graph.edges.some(e => {
            if (!e) return false;
            const otherId = e.source === id ? e.target : (e.target === id ? e.source : null);
            if (!otherId) return false;
            const otherNode = allNodes.find(n => n.id === otherId);
            if (!otherNode) return false;
            return (
              otherNode.details?.employee_id?.toLowerCase().includes(query) ||
              otherNode.details?.name?.toLowerCase().includes(query) ||
              otherNode.details?.bank_account?.toLowerCase().includes(query) ||
              otherNode.details?.account_number?.toLowerCase().includes(query) ||
              otherNode.label.toLowerCase().includes(query)
            );
          });
        }
        return false;
      });
    }

    // 2. Authoritative Active Filter Mode
    if (activeFilter === 'CRITICAL_RING') {
      return allNodes.filter(n => n && fraudClusterNodeIds.has(n.id));
    }

    if (activeFilter === 'EMPLOYEES') {
      return allNodes.filter(n => n && n.type === 'Employee');
    }

    if (activeFilter === 'BANKS') {
      return allNodes.filter(n => n && n.type === 'BankAccount');
    }

    if (activeFilter === 'FOCUS') {
      return allNodes.filter(n => n && focusedClusterNodeIds.has(n.id));
    }

    return allNodes; // 'ALL' mode
  }, [graph, searchQuery, activeFilter, fraudClusterNodeIds, focusedClusterNodeIds]);

  // Derived Visible Edges List (edges where BOTH source and target are in visibleNodes)
  const visibleEdges = useMemo(() => {
    if (!graph || !Array.isArray(graph.edges)) return [];
    const visibleNodeIdSet = new Set(visibleNodes.map(n => n.id));
    return graph.edges.filter(e => e && visibleNodeIdSet.has(e.source) && visibleNodeIdSet.has(e.target));
  }, [graph, visibleNodes]);

  // Temporary Debugging Log for Data Flow Verification
  useEffect(() => {
    if (graph && Array.isArray(graph.nodes) && Array.isArray(graph.edges)) {
      console.log({
        activeFilter,
        allNodeCount: graph.nodes.length,
        visibleNodeCount: visibleNodes.length,
        allEdgeCount: graph.edges.length,
        visibleEdgeCount: visibleEdges.length
      });
    }
  }, [activeFilter, graph, visibleNodes, visibleEdges]);

  // Auto-select first matching or critical visible node if current selection is not visible
  useEffect(() => {
    if (visibleNodes.length > 0) {
      if (!selectedNode || !visibleNodes.some(n => n.id === selectedNode.id)) {
        const criticalOrFirst = visibleNodes.find(n => n.risk_level === 'CRITICAL') || visibleNodes[0];
        setSelectedNode(criticalOrFirst);
      }
    } else {
      setSelectedNode(null);
    }
  }, [visibleNodes]);

  // Auto-select first search match when typing in search input
  useEffect(() => {
    if (searchQuery.trim() !== '' && visibleNodes.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      const match = visibleNodes.find(n =>
        n.label.toLowerCase().includes(query) ||
        n.details?.employee_id?.toLowerCase().includes(query) ||
        n.details?.bank_account?.toLowerCase().includes(query)
      );
      if (match && selectedNode?.id !== match.id) {
        setSelectedNode(match);
      }
    }
  }, [searchQuery, visibleNodes]);

  // 2D Network Node Position Layout Engine
  const nodePositions = useMemo(() => {
    if (!graph || !Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) return {};

    const positions: Record<string, { x: number; y: number }> = {};
    const empNodes = visibleNodes.filter(n => n && n.type === 'Employee');
    const bankNodes = visibleNodes.filter(n => n && n.type === 'BankAccount');
    const otherNodes = visibleNodes.filter(n => n && n.type !== 'Employee' && n.type !== 'BankAccount');

    if (activeFilter === 'EMPLOYEES') {
      // Single Column Centered Layout for Employees mode
      empNodes.forEach((node, idx) => {
        positions[node.id] = { x: 360, y: 40 + idx * 46 };
      });
    } else if (activeFilter === 'BANKS') {
      // Single Column Centered Layout for Banks mode
      bankNodes.forEach((node, idx) => {
        positions[node.id] = { x: 360, y: 40 + idx * 52 };
      });
    } else {
      // Dual-Column Topology Layout for All, Fraud Clusters & Focus Cluster modes
      empNodes.forEach((node, idx) => {
        positions[node.id] = { x: 140, y: 40 + idx * 46 };
      });

      let bankIdx = 0;
      bankNodes.forEach((node) => {
        const connEdges = visibleEdges.filter(e => e && (e.target === node.id || e.source === node.id));
        const connEmpIds = connEdges.map(e => e.source === node.id ? e.target : e.source);

        if (connEmpIds.length >= 2) {
          const empYs = connEmpIds.map(eid => positions[eid]?.y).filter(Boolean);
          const avgY = empYs.length > 0 ? empYs.reduce((a, b) => a + b, 0) / empYs.length : 240;
          positions[node.id] = { x: 580, y: avgY };
        } else {
          const empId = connEmpIds[0];
          if (empId && positions[empId]) {
            positions[node.id] = { x: 580, y: positions[empId].y };
          } else {
            positions[node.id] = { x: 580, y: 50 + bankIdx * 65 };
            bankIdx++;
          }
        }
      });

      otherNodes.forEach((node, idx) => {
        positions[node.id] = { x: 360, y: 80 + idx * 60 };
      });
    }

    return positions;
  }, [graph, visibleNodes, visibleEdges, activeFilter]);

  const empCount = graph && Array.isArray(graph.nodes) ? graph.nodes.filter(n => n && n.type === 'Employee').length : 0;
  const bankCount = graph && Array.isArray(graph.nodes) ? graph.nodes.filter(n => n && n.type === 'BankAccount').length : 0;
  const visibleEmpCount = visibleNodes.filter(n => n.type === 'Employee').length;
  const visibleBankCount = visibleNodes.filter(n => n.type === 'BankAccount').length;

  const canvasHeight = Math.max(
    520,
    (activeFilter === 'EMPLOYEES'
      ? visibleEmpCount
      : (activeFilter === 'BANKS' ? visibleBankCount : (visibleEmpCount || empCount))
    ) * 48 + 60
  );

  // Focus high-priority cluster handler
  const handleFocusCluster = (clusterBankAcc: string = 'AC9001') => {
    setActiveFilter('FOCUS');
    setSelectedClusterId(clusterBankAcc);
    setSearchQuery('');
    if (graph && Array.isArray(graph.nodes)) {
      const targetBank = graph.nodes.find(n => n.type === 'BankAccount' && n.label === clusterBankAcc) ||
        graph.nodes.find(n => n.type === 'BankAccount' && n.risk_level === 'CRITICAL');
      if (targetBank) {
        setSelectedNode(targetBank);
      }
    }
  };

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
          className="bg-[#18181b] border border-[#27272a] text-white text-xs font-mono font-semibold rounded px-3 py-2 outline-none focus:border-white cursor-pointer"
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
                Showing: {visibleNodes.length} / {graph?.nodes.length || 0} Nodes ({visibleEdges.length} Edges)
              </span>
              {graph?.fraud_rings_count ? (
                <button
                  type="button"
                  onClick={() => handleFocusCluster('AC9001')}
                  className="text-[10px] font-mono font-bold text-[#fca5a5] bg-[#3f1214] hover:bg-[#5c1d20] px-2.5 py-1 rounded border border-[#7f1d1d] flex items-center gap-1 cursor-pointer transition"
                  title="Click to view and focus suspicious fraud clusters"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> {graph.fraud_rings_count} Coordinated Fraud Clusters
                </button>
              ) : null}
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
              className="w-full bg-[#09090b] border border-[#27272a] rounded pl-9 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-white font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-[#a1a1aa] hover:text-white font-mono cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Fraud Cluster Focus Selector Banner */}
          {activeFilter === 'FOCUS' && (
            <div className="mt-2.5 p-2.5 rounded bg-[#3f1214] border border-[#7f1d1d] flex items-center justify-between font-mono text-xs text-[#fca5a5]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#fca5a5]" />
                <span>
                  Focused Fraud Cluster:{' '}
                  <strong className="text-white font-bold">{selectedClusterId || 'AC9001 (Shared Account Ring)'}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFocusCluster('AC9001')}
                  className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                    selectedClusterId === 'AC9001' || !selectedClusterId
                      ? 'bg-white text-black font-bold'
                      : 'bg-[#18181b] text-white border-[#3f3f46]'
                  }`}
                >
                  Cluster 1 (AC9001)
                </button>
                <button
                  type="button"
                  onClick={() => handleFocusCluster('AC9100')}
                  className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                    selectedClusterId === 'AC9100'
                      ? 'bg-white text-black font-bold'
                      : 'bg-[#18181b] text-white border-[#3f3f46]'
                  }`}
                >
                  Cluster 2 (AC9100)
                </button>
              </div>
            </div>
          )}

          {/* 2D Interactive SVG Network Topology Canvas */}
          <div className="my-3 relative bg-[#09090b] rounded border border-[#27272a] overflow-x-auto" style={{ minHeight: `${canvasHeight}px` }}>
            {visibleNodes.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-[#71717a] font-mono text-xs">
                <Search className="w-6 h-6 text-[#3f3f46]" />
                <p className="font-semibold text-white">No matching entity found.</p>
                <p className="text-[11px] text-[#a1a1aa]">Try adjusting your search query or reset filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 px-3 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded text-[11px] font-bold border border-[#3f3f46] cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ width: '100%', height: `${canvasHeight}px` }}
                >
                  <defs>
                    <marker id="arrow-critical" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#fca5a5" />
                    </marker>
                    <marker id="arrow-normal" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#71717a" />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffffff" />
                    </marker>
                  </defs>

                  {/* Draw 2D Graph Connection Lines */}
                  {visibleEdges.map((edge) => {
                    const sourcePos = nodePositions[edge.source];
                    const targetPos = nodePositions[edge.target];
                    if (!sourcePos || !targetPos) return null;

                    const isConnectedToSelected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);
                    const isConnectedToHovered = hoveredNode && (edge.source === hoveredNode.id || edge.target === hoveredNode.id);
                    const isEdgeSelected = selectedEdge?.id === edge.id;
                    const isEdgeHovered = hoveredEdge?.id === edge.id;
                    const isEdgeCritical = edge.risk_level === 'CRITICAL';

                    const edgeOpacity = selectedNode || hoveredNode
                      ? (isConnectedToSelected || isConnectedToHovered || isEdgeSelected || isEdgeHovered ? 1 : 0.15)
                      : 0.8;

                    const strokeColor = (isEdgeSelected || isEdgeHovered)
                      ? '#ffffff'
                      : (isConnectedToSelected || isConnectedToHovered
                          ? (isEdgeCritical ? '#fca5a5' : '#38bdf8')
                          : (isEdgeCritical ? '#fca5a5' : '#3f3f46'));

                    const strokeWidth = (isEdgeSelected || isEdgeHovered || isConnectedToSelected || isConnectedToHovered)
                      ? '3.5'
                      : (isEdgeCritical ? '2' : '1');

                    const sourceEmp = graph?.nodes.find(n => n.id === edge.source);

                    return (
                      <g key={edge.id} style={{ opacity: edgeOpacity }} className="transition-all">
                        {/* Invisible wider hit line for smooth mouse hovering/clicking */}
                        <line
                          x1={sourcePos.x}
                          y1={sourcePos.y}
                          x2={targetPos.x}
                          y2={targetPos.y}
                          stroke="transparent"
                          strokeWidth="14"
                          style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredEdge(edge)}
                          onMouseLeave={() => setHoveredEdge(null)}
                          onClick={() => {
                            setSelectedEdge(edge);
                            if (sourceEmp) setSelectedNode(sourceEmp);
                          }}
                        />

                        {/* Visible Line */}
                        <line
                          x1={sourcePos.x}
                          y1={sourcePos.y}
                          x2={targetPos.x}
                          y2={targetPos.y}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                          strokeDasharray={isEdgeCritical ? 'none' : '3 3'}
                          markerEnd={isEdgeSelected || isEdgeHovered ? 'url(#arrow-active)' : (isEdgeCritical ? 'url(#arrow-critical)' : 'url(#arrow-normal)')}
                          style={{ pointerEvents: 'none' }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Render Interactive 2D Graph Node Cards */}
                {visibleNodes.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;

                  const isSelected = selectedNode?.id === node.id;
                  const isHovered = hoveredNode?.id === node.id;
                  const isInSelectedCluster = activeClusterNodeIds.has(node.id);
                  const isCritical = node.risk_level === 'CRITICAL';

                  const nodeOpacity = (selectedNode || hoveredNode)
                    ? (isSelected || isHovered ? 1 : (isInSelectedCluster ? 0.9 : 0.25))
                    : 1;

                  return (
                    <div
                      key={node.id}
                      onClick={() => {
                        setSelectedNode(node);
                        setSelectedEdge(null);
                      }}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      style={{
                        position: 'absolute',
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        transform: 'translate(-50%, -50%)',
                        opacity: nodeOpacity
                      }}
                      className={`px-3 py-2 rounded cursor-pointer transition-all border flex items-center gap-2 font-mono ${
                        isSelected
                          ? 'ring-2 ring-white bg-white text-black z-30 font-bold shadow-lg scale-105'
                          : (isHovered ? 'ring-2 ring-sky-400 bg-[#27272a] text-white z-30 font-bold scale-105' : '')
                      } ${
                        !isSelected && !isHovered && isCritical
                          ? 'bg-[#3f1214] border-[#7f1d1d] text-[#fca5a5] z-20 hover:border-[#fca5a5]'
                          : (!isSelected && !isHovered ? 'bg-[#18181b] border-[#27272a] text-[#fafafa] hover:border-[#3f3f46] z-10' : '')
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

                {/* Floating Node Hover Tooltip */}
                {hoveredNode && nodePositions[hoveredNode.id] && !selectedNode && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${nodePositions[hoveredNode.id].x}px`,
                      top: `${nodePositions[hoveredNode.id].y - 38}px`,
                      transform: 'translateX(-50%)',
                      pointerEvents: 'none'
                    }}
                    className="z-40 px-2.5 py-1 rounded bg-black/90 text-white border border-[#3f3f46] text-[10px] font-mono shadow-xl flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span className="font-bold">{hoveredNode.label}</span>
                    <span className="text-[#a1a1aa]">•</span>
                    <span className="text-[#6ee7b7]">{hoveredNode.type}</span>
                    <span className="text-[#a1a1aa]">•</span>
                    <span className={hoveredNode.risk_level === 'CRITICAL' ? 'text-[#fca5a5] font-bold' : 'text-[#6ee7b7]'}>
                      Risk: {hoveredNode.risk_level}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-[11px] text-[#a1a1aa] flex items-center justify-between font-mono pt-2 border-t border-[#27272a]">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-white" /> Click any node or relationship edge to inspect details. Filter buttons isolate nodes in real-time.
            </span>
            <span className="text-[#71717a]">Dynamic Topology Active</span>
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
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-[#a1a1aa]">{selectedNode.type} Entity</span>
                    <h3 className="text-base font-bold text-white mt-0.5 font-mono">{selectedNode.label}</h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    selectedNode.risk_level === 'CRITICAL'
                      ? 'bg-[#3f1214] text-[#fca5a5] border-[#7f1d1d]'
                      : 'bg-[#064e3b] text-[#6ee7b7] border-[#047857]'
                  }`}>
                    {selectedNode.risk_level}
                  </span>
                </div>

                {selectedNode.details?.cluster && (
                  <div className="mt-2.5 text-[10px] font-mono font-bold text-[#fca5a5] bg-[#3f1214] px-2 py-1 rounded border border-[#7f1d1d] flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-[#fca5a5]" /> {selectedNode.details.cluster}
                  </div>
                )}
              </div>

              {/* Dynamic Entity Metadata */}
              <div className="p-3.5 rounded bg-[#09090b] border border-[#27272a] space-y-1.5 font-mono">
                <span className="text-xs font-semibold text-[#a1a1aa] font-sans uppercase">Entity Properties</span>

                {selectedNode.type === 'Employee' && (
                  <>
                    <div className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa]">Employee ID</span>
                      <span className="font-bold text-white">{selectedNode.details?.employee_id || selectedNode.id.replace('EMP-', '')}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa]">Gross Salary</span>
                      <span className="font-bold text-white">{selectedNode.details?.salary || 'Data unavailable'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa]">Attendance Days</span>
                      <span className={`font-bold ${selectedNode.details?.attendance === '0 days' ? 'text-[#fca5a5]' : 'text-white'}`}>
                        {selectedNode.details?.attendance || '22 days'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa]">Overtime Hours</span>
                      <span className={`font-bold ${parseInt(selectedNode.details?.overtime || '0') > 40 ? 'text-[#fca5a5]' : 'text-white'}`}>
                        {selectedNode.details?.overtime || '0 hrs'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa]">Destination Bank</span>
                      <span className="font-bold text-white">{selectedNode.details?.bank_account || 'Data unavailable'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa]">Risk Score</span>
                      <span className={`font-extrabold ${selectedNode.risk_level === 'CRITICAL' ? 'text-[#fca5a5]' : 'text-[#6ee7b7]'}`}>
                        {selectedNode.details?.risk_score || '100 / 100'}
                      </span>
                    </div>

                    {/* Action Deep-Link Button to AI Investigation Hub */}
                    <Link
                      href={`/investigation?emp=${selectedNode.details?.employee_id || selectedNode.id.replace('EMP-', '')}&batch=${selectedBatchId}`}
                      className="mt-3 py-2 px-3 rounded bg-white hover:bg-slate-200 text-black font-bold text-xs flex items-center justify-center gap-2 transition font-sans w-full cursor-pointer shadow"
                    >
                      Investigate {selectedNode.details?.employee_id || 'Employee'} in AI Hub <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                )}

                {selectedNode.type === 'BankAccount' && (
                  <>
                    <div className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa]">Account Number</span>
                      <span className="font-bold text-white">{selectedNode.label}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa]">Relationship</span>
                      <span className="font-bold text-[#38bdf8]">PAID_TO</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-[#18181b]">
                      <span className="text-[#a1a1aa]">Used By Employees</span>
                      <span className={`font-bold ${selectedNode.details?.used_by_count > 1 ? 'text-[#fca5a5]' : 'text-white'}`}>
                        {selectedNode.details?.used_by_count || 1} employee{selectedNode.details?.used_by_count > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Member Employees List */}
                    <div className="pt-1 space-y-1">
                      <span className="text-[10px] text-[#a1a1aa] font-bold uppercase">Connected Employees:</span>
                      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                        {selectedNode.details?.employees && Array.isArray(selectedNode.details.employees) ? (
                          selectedNode.details.employees.map((empStr: string, idx: number) => {
                            const empId = empStr.split(' ')[0];
                            const empNode = graph?.nodes.find(n => n.id === `EMP-${empId}` || n.label.includes(empId));

                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (empNode) setSelectedNode(empNode);
                                }}
                                className="w-full text-left p-1.5 rounded bg-[#18181b] hover:bg-[#27272a] text-xs text-white flex items-center justify-between cursor-pointer border border-[#27272a]"
                              >
                                <span className="font-bold font-mono">{empStr}</span>
                                <ArrowRight className="w-3 h-3 text-[#71717a]" />
                              </button>
                            );
                          })
                        ) : (
                          <div className="text-xs text-[#a1a1aa]">Unique payment destination</div>
                        )}
                      </div>
                    </div>
                  </>
                )}
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
