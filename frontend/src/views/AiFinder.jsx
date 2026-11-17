import React, { useState } from 'react'
import {
  Sparkles,
  Search,
  Camera,
  Layers,
  MapPin,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ArrowRight,
  Printer,
  QrCode,
  Gauge,
  Activity,
  Sliders,
  ExternalLink
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function AiFinder() {
  const { items, openQrModal, addToast } = useStore()

  // Search Input State
  const [query, setQuery] = useState('')
  const [selectedSample, setSelectedSample] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  // 4 Sample Corroded / Unlabeled Plant Spares (Visual Search Simulation)
  const visualSamples = [
    {
      id: 'sample-1',
      title: 'Unlabeled High-Pressure Valve Bonnet',
      condition: 'Heavy oxidation, flange stamping corroded',
      foundAt: 'Unit 1 Boiler Penthouse 34m elevation',
      matchedCode: 'BLR-SRV-001',
      similarity: 96.4,
      imageBg: 'from-amber-700/20 to-stone-800/40',
      icon: '🛡️',
    },
    {
      id: 'sample-2',
      title: 'Worn Coal Mill Roller Segment',
      condition: 'Severe abrasive erosion from high-ash Indian coal',
      foundAt: 'Coal Mill 1D Grinding Bowl',
      matchedCode: 'CLM-ROL-006',
      similarity: 94.8,
      imageBg: 'from-stone-800/40 to-slate-900/50',
      icon: '⚙️',
    },
    {
      id: 'sample-3',
      title: 'Burnt BFP Mechanical Seal Face',
      condition: 'Thermal scoring & blistering on SiC primary ring',
      foundAt: 'Boiler Feed Pump 2A Drive-End Gland',
      matchedCode: 'BFP-MCH-002',
      similarity: 98.1,
      imageBg: 'from-blue-900/30 to-slate-900/50',
      icon: '🔄',
    },
    {
      id: 'sample-4',
      title: 'Smart Pressure Transmitter 4-20mA',
      condition: 'Paint scorched, HART serial plate illegible',
      foundAt: 'Deaerator Feedwater Header',
      matchedCode: 'PRT-TX-022',
      similarity: 92.5,
      imageBg: 'from-cyan-900/20 to-slate-900/40',
      icon: '📡',
    },
  ]

  // Filter matched items based on query or visual sample
  const getResults = () => {
    if (selectedSample) {
      const match = items.find((i) => (i.itemCode || i.code) === selectedSample.matchedCode)
      if (match) {
        return [{ ...match, score: selectedSample.similarity, source: 'VISUAL_CLIP' }]
      }
    }

    if (!query.trim()) {
      // Default top matches
      return [
        {
          ...(items.find((i) => (i.itemCode || i.code) === 'BLR-SRV-001') || items[0]),
          score: 96.4,
          source: 'SEMANTIC_PGVECTOR',
        },
        {
          ...(items.find((i) => (i.itemCode || i.code) === 'BFP-MCH-002') || items[1]),
          score: 94.2,
          source: 'SEMANTIC_PGVECTOR',
        },
        {
          ...(items.find((i) => (i.itemCode || i.code) === 'STM-GSK-008') || items[2]),
          score: 91.8,
          source: 'SEMANTIC_PGVECTOR',
        },
      ]
    }

    const q = query.toLowerCase()
    return items
      .filter(
        (i) =>
          (i.itemCode || i.code || '').toLowerCase().includes(q) ||
          (i.name || i.itemName || '').toLowerCase().includes(q) ||
          (i.description || '').toLowerCase().includes(q) ||
          (i.category || '').toLowerCase().includes(q)
      )
      .map((i) => ({
        ...i,
        score: Math.floor(88 + Math.random() * 11),
        source: 'SEMANTIC_PGVECTOR',
      }))
  }

  const results = getResults()

  const handleSelectSample = (sample) => {
    setSelectedSample(sample)
    setQuery(sample.title)
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      addToast({
        title: '🎯 Visual Match Resolved',
        message: `Identified ${sample.matchedCode} with ${sample.similarity}% pgvector confidence score.`,
        type: 'success',
      })
    }, 600)
  }

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* HEADER BANNER                                                        */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 font-mono uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            AI Spare Parts Finder & Predictive Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Zero-data cold start friendly semantic & visual part identification powered by PostgreSQL 16 <code className="font-mono text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">pgvector</code> HNSW indexing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            HNSW Cosine Vector Index Active
          </span>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* GOOGLE-LENS STYLE SEARCH BAR                                         */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-scada-card space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedSample(null)
            }}
            placeholder='Type natural description (e.g. "high-temp graphite gasket for main steam valve") or select photo thumbnail below...'
            className="w-full pl-12 pr-32 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-mono"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={() => handleSelectSample(visualSamples[0])}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-mono font-bold border border-indigo-200 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Simulate Lens</span>
            </button>
          </div>
        </div>

        {/* Quick Query Pills */}
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Quick Searches:</span>
          {[
            'High-Temp Spiral Wound Graphite Gasket',
            'BFP Cartridge Seal 200 bar',
            'PA Fan Roller Bearing 22230',
            'Coal Mill Grinding Roller',
          ].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setQuery(preset)
                setSelectedSample(null)
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* 4 CLICKABLE VISUAL THUMBNAILS (CORRODED / UNLABELED PARTS) */}
        <div className="pt-2">
          <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Camera className="w-4 h-4 text-indigo-600" />
            <span>Click Corroded / Unlabeled Plant Photo to Identify via CLIP Embeddings:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {visualSamples.map((sample) => {
              const isSelected = selectedSample?.id === sample.id
              return (
                <div
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{sample.icon}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-indigo-700">
                        {sample.similarity}% MATCH
                      </span>
                    </div>
                    <h3 className="font-mono font-bold text-xs text-slate-900 leading-tight">
                      {sample.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                      {sample.condition}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="truncate">{sample.foundAt}</span>
                    <span className="text-indigo-600 font-bold ml-1 flex-shrink-0">&rarr; Test</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* INSTANT PGVECTOR SIMILARITY MATCH RESULTS                            */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-tight">
              Identified Spares & Bin Coordinates ({results.length} Matches)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Cosine Distance Metric • Vector Dim: 384 / 512
          </span>
        </div>

        <div className="divide-y divide-slate-100 space-y-2">
          {results.map((item) => (
            <div
              key={item.itemCode || item.code}
              className="pt-3 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 px-3 rounded-xl transition-colors font-mono text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                    {item.itemCode || item.code}
                  </span>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {item.score || 96}% MATCH
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    (item.ved || item.vedClass) === 'V'
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-amber-100 text-amber-700 border border-amber-300'
                  }`}>
                    VED: {item.ved || item.vedClass || 'V'}
                  </span>

                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Bin: <strong className="text-slate-900">{item.location || item.binLocation || 'Z1-B01-R01-B01'}</strong>
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 font-sans mt-0.5">
                  {item.name || item.itemName}
                </div>
                <p className="text-xs text-slate-500 font-sans line-clamp-1">
                  {item.description || 'High-precision thermal power plant component.'}
                </p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Current Stock</div>
                  <div className="text-sm font-bold text-slate-900">
                    {item.currentStock ?? item.stock ?? 4} Units
                  </div>
                </div>

                <button
                  onClick={() => openQrModal(item)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  Print QR / Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* AI DEMAND & LEAK ANOMALY CARDS (ISOLATION FOREST & LIGHTGBM)          */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-tight">
              AI Demand & Leak Anomaly Warnings (Predictive Telemetry)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">LightGBM + Isolation Forest Models</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Anomaly Card 1: Hydraulic Oil Leak */}
          <div className="bg-white rounded-xl border border-rose-300 p-5 shadow-scada-card relative overflow-hidden bg-gradient-to-b from-rose-500/[0.04] to-transparent flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className="text-rose-700 font-bold uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  Isolation Forest Leak Alert
                </span>
                <span className="bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                  Score: 0.91
                </span>
              </div>
              <h3 className="font-mono font-bold text-sm text-slate-900 leading-snug">
                Unit 2 Hydraulic Oil (ISO VG 46) Spike +340%
              </h3>
              <p className="text-xs text-slate-600 mt-2 font-mono">
                Consumption spiked from 12L/week to 54L over 48 hours. Pattern matches severe actuator cylinder seal rupture in TG governing rack.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between font-mono text-xs">
              <span className="text-rose-700 font-bold">Action Required</span>
              <button
                onClick={() => addToast({ title: 'Dispatching C&I Inspection', message: 'Sent priority maintenance work order to TG team.', type: 'warning' })}
                className="text-rose-600 hover:text-rose-800 font-bold underline"
              >
                Dispatch Work Order &rarr;
              </button>
            </div>
          </div>

          {/* Anomaly Card 2: LightGBM ROP Escalation */}
          <div className="bg-white rounded-xl border border-amber-300 p-5 shadow-scada-card relative overflow-hidden bg-gradient-to-b from-amber-500/[0.04] to-transparent flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className="text-amber-800 font-bold uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  Dynamic Reorder Point (ROP)
                </span>
                <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                  LightGBM
                </span>
              </div>
              <h3 className="font-mono font-bold text-sm text-slate-900 leading-snug">
                Superheater Tube Bends SA213-T91 Depletion
              </h3>
              <p className="text-xs text-slate-600 mt-2 font-mono">
                Predicted stockout in 11 days. Historical overhaul spike detected. Auto-adjusted Reorder Point from 4 to 8 units to preserve 95% safety stock SLA.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between font-mono text-xs">
              <span className="text-amber-800 font-bold">Buffer: +4 Units</span>
              <button
                onClick={() => addToast({ title: 'PO Requisition Drafted', message: 'Indented +4 Tube Bends to Central Purchasing.', type: 'success' })}
                className="text-amber-700 hover:text-amber-900 font-bold underline"
              >
                Auto-Draft PO &rarr;
              </button>
            </div>
          </div>

          {/* Anomaly Card 3: Coal Mill MTBF Wear */}
          <div className="bg-white rounded-xl border border-blue-300 p-5 shadow-scada-card relative overflow-hidden bg-gradient-to-b from-blue-500/[0.04] to-transparent flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className="text-blue-800 font-bold uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  MTBF Wear Model
                </span>
                <span className="bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                  7,850 / 8,000h
                </span>
              </div>
              <h3 className="font-mono font-bold text-sm text-slate-900 leading-snug">
                Coal Mill 1E Grinding Rollers MTBF Alert
              </h3>
              <p className="text-xs text-slate-600 mt-2 font-mono">
                Roller tire segments nearing 8,000 running hours limit. High erosion risk. Verified 4x replacement segments binned in Zone 1 Bay 3.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between font-mono text-xs">
              <span className="text-emerald-700 font-bold">Spares in Stock (4)</span>
              <span className="text-slate-500 font-bold">Scheduled Nov 28</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
