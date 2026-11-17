import React, { useState } from 'react'
import {
  DollarSign,
  AlertTriangle,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Clock,
  Sparkles,
  QrCode,
  Layers,
  ChevronRight,
  Zap,
  Activity,
  Flame,
  Radio,
  ExternalLink,
  CheckCircle2
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useStore } from '../context/StoreContext'
import { Link } from 'react-router-dom'

// Recharts Custom Dark Tooltip
const ScadaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3 shadow-scada-elevated font-mono text-xs text-white">
        <div className="font-bold text-slate-300 pb-1.5 border-b border-slate-800 mb-1.5 flex items-center justify-between gap-4">
          <span>{label}</span>
          <span className="text-[10px] text-blue-400">TELEMETRY</span>
        </div>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}:
              </span>
              <span className="font-bold tabular-nums text-white">
                {entry.value.toLocaleString()} {entry.unit || 'units'}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { auditLogs, openQrModal, items, emergencyOverride, setEmergencyOverride } = useStore()

  // Monthly Consumption by Plant Division (Recharts Stacked Bar)
  const monthlyConsumptionData = [
    { month: 'Jun', Boiler: 42, Turbine: 28, CHP: 35, AHP: 18, Electrical: 24, CI: 15 },
    { month: 'Jul', Boiler: 56, Turbine: 32, CHP: 41, AHP: 22, Electrical: 29, CI: 18 },
    { month: 'Aug', Boiler: 89, Turbine: 45, CHP: 62, AHP: 34, Electrical: 38, CI: 25 }, // Annual Overhaul spike
    { month: 'Sep', Boiler: 65, Turbine: 36, CHP: 48, AHP: 26, Electrical: 30, CI: 20 },
    { month: 'Oct', Boiler: 48, Turbine: 29, CHP: 39, AHP: 21, Electrical: 26, CI: 17 },
    { month: 'Nov', Boiler: 52, Turbine: 34, CHP: 44, AHP: 23, Electrical: 28, CI: 19 },
  ]

  // Inventory Health Donut Data (Optimal vs Below MSL vs Overstocked)
  const healthDonutData = [
    { name: 'Optimal Stock', value: 21, color: '#10B981' },
    { name: 'Below MSL (Critical)', value: 6, color: '#F43F5E' },
    { name: 'Buffer / Overstocked', value: 3, color: '#06B6D4' },
  ]

  // Critical stock items
  const criticalSpares = items.filter(
    (i) => (i.ved || i.vedClass) === 'V' && (i.currentStock ?? i.stock ?? 5) <= (i.minStockLevel ?? i.minStock ?? 2)
  ).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* EMERGENCY BREAKDOWN STATUS BANNER (CONDITIONAL)                      */}
      {/* -------------------------------------------------------------------- */}
      {emergencyOverride && (
        <div className="bg-rose-500/10 border-2 border-rose-500/40 rounded-2xl p-4 flex items-center justify-between shadow-glow-rose animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center animate-pulse flex-shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono font-bold text-rose-800 text-sm">
                <span>EMERGENCY BREAKDOWN OVERRIDE ENGAGED (MIDNIGHT TRIP / BOILER TUBE LEAK)</span>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded uppercase">
                  SCE Clause 4.2
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Pre-approval bypassed. Spares can be issued immediately. 24-hour post-facto HOD review timer initiated.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEmergencyOverride(false)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-semibold rounded-xl transition-all shadow-sm flex-shrink-0"
          >
            Disengage Override
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 4 TELEMETRY KPI CARDS WITH JETBRAINS MONO METRICS & ACCENTS          */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Store Valuation */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card relative overflow-hidden flex flex-col justify-between border-t-4 border-t-blue-600">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">
              <span>Total Store Valuation</span>
              <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                +2.4%
              </span>
            </div>
            <div className="text-2xl font-black font-mono tracking-tight text-slate-900 tabular-nums">
              ₹4,82,90,000
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">30 Critical Assemblies & Consumables</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-600">
            <span>Capital Spares: ₹3.9 Cr</span>
            <span className="text-blue-600 font-bold">98.2% In-Stock</span>
          </div>
        </div>

        {/* KPI 2: Vital (V) Stockout Risk (Glowing Rose Border when > 0) */}
        <div className="bg-white rounded-xl border border-rose-500/50 p-5 shadow-glow-rose relative overflow-hidden flex flex-col justify-between border-t-4 border-t-rose-500 bg-gradient-to-b from-rose-500/[0.03] to-transparent">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2 font-mono">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Vital (V) Stockout Risk
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-glow-rose"></span>
            </div>
            <div className="text-2xl font-black font-mono tracking-tight text-rose-700 tabular-nums flex items-baseline gap-2">
              <span>3 Critical Alerts</span>
              <span className="text-xs font-normal text-slate-500">(Below MSL)</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 font-mono">BFP Seals, TG Trip Solenoid, Lance Tubes</p>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs font-mono">
            <span className="text-rose-700 font-bold">High Generation Impact</span>
            <Link to="/bin-grid" className="text-rose-600 hover:text-rose-800 font-bold underline flex items-center gap-0.5">
              Locate Bins <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* KPI 3: Pending Dept. Indents */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card relative overflow-hidden flex flex-col justify-between border-t-4 border-t-amber-500">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">
              <span>Pending Dept. Indents</span>
              <span className="inline-flex items-center text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold font-mono">
                <Clock className="w-3 h-3 mr-0.5" />
                18m avg
              </span>
            </div>
            <div className="text-2xl font-black font-mono tracking-tight text-slate-900 tabular-nums">
              12 Open
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">4 Boiler • 3 Turbine • 2 CHP • 3 Elec</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-600">
            <span>Awaiting HOD: 4</span>
            <Link to="/indents" className="text-amber-600 hover:text-amber-800 font-bold flex items-center gap-0.5">
              Review Queue <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* KPI 4: AI Predicted Reorders (Next 14 Days) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card relative overflow-hidden flex flex-col justify-between border-t-4 border-t-indigo-600">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI Predicted Reorders
              </span>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                14-Day Horizon
              </span>
            </div>
            <div className="text-2xl font-black font-mono tracking-tight text-slate-900 tabular-nums">
              5 Spares Flagged
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">Boiler Tubes, Coal Rollers & Gaskets</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-600">
            <span>LightGBM Confidence: 94.6%</span>
            <Link to="/ai-finder" className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5">
              View Insights <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* DATA VISUALIZATIONS: 65% STACKED BAR CHART & 35% HEALTH DONUT        */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart (65% width): Monthly Spares Consumption by Division */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 p-6 shadow-scada-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Monthly Spares Consumption by Plant Division
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-tier requisition volume across Boiler, Turbine, CHP, AHP, Electrical, and C&I
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Telemetry Feed Active</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyConsumptionData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
                <Tooltip content={<ScadaTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                  iconSize={8}
                />
                <Bar dataKey="Boiler" stackId="a" fill="#2563EB" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Turbine" stackId="a" fill="#06B6D4" radius={[0, 0, 0, 0]} />
                <Bar dataKey="CHP" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="AHP" stackId="a" fill="#64748B" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Electrical" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="CI" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart (35% width): ABC-VED Inventory Health Donut */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-6 shadow-scada-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Inventory Stock Health
              </h2>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                ABC-VED Matrix
              </span>
            </div>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {healthDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<ScadaTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black font-mono text-slate-900">30</span>
                <span className="text-[10px] uppercase font-mono text-slate-400">Total Items</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 mt-4 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                <span className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Optimal Stock Level
                </span>
                <span className="font-bold text-emerald-900">21 Items (70%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/60 border border-rose-200/60">
                <span className="flex items-center gap-2 text-rose-800 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  Below MSL (Critical)
                </span>
                <span className="font-bold text-rose-900">6 Items (20%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-50/60 border border-cyan-200/60">
                <span className="flex items-center gap-2 text-cyan-800 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  Buffer / Overstocked
                </span>
                <span className="font-bold text-cyan-900">3 Items (10%)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Safety Stock SLA: 95%</span>
            <button
              onClick={() => openQrModal(criticalSpares[0])}
              className="text-blue-600 hover:text-blue-800 font-bold"
            >
              Action Urgent Spares
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* LIVE IMMUTABLE AUDIT TICKER (SCADA EVENT STREAM)                      */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-glow-emerald"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-tight">
              Live Immutable Store Audit Ticker
            </h2>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              (PostgreSQL Append-Only Stock Ledger)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">Auto-updating live</span>
            <button
              onClick={() => openQrModal()}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-mono font-semibold transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Simulate Issue</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => {
            const isEmergency = log.type === 'EMERGENCY_ISSUE'
            const isInward = log.type === 'INWARD'
            const isQc = log.type === 'QA_CLEARANCE'

            return (
              <div
                key={log.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 px-2 rounded-lg transition-colors font-mono text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-slate-400 font-bold tabular-nums flex-shrink-0">
                    [{log.time}]
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                      isEmergency
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : isInward
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                        : isQc
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}
                  >
                    {log.type.replace('_', ' ')}
                  </span>

                  <span className="text-slate-800 font-medium truncate">{log.desc}</span>
                </div>

                <div className="flex items-center gap-4 text-slate-500 text-[11px] flex-shrink-0 pl-14 sm:pl-0">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                    {log.user}
                  </span>
                  <span className="text-slate-400 font-bold">{log.tag}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
