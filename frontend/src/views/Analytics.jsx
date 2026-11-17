import React, { useState, useEffect } from 'react'
import {
  BarChart3, TrendingUp, AlertTriangle, Package, Brain, Zap, Flame, Gauge,
  DollarSign, Shield, RotateCcw, ArrowUpRight, ArrowDownRight, Calendar, Download
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
  PieChart as PieChart2, Pie as Pie2
} from 'recharts'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [kpis, setKpis] = useState({
    inventoryValue: 24500000,
    stockTurnover: 4.2,
    ropAlerts: 7,
    aiAccuracy: 94,
    fillRate: 96.8,
    criticalStockouts: 3
  })

  // Mock chart data
  const consumptionTrend = [
    { month: 'Nov', boiler: 42, tg: 28, chp: 18, electrical: 12, ci: 8, ahp: 6, wtp: 3 },
    { month: 'Dec', boiler: 38, tg: 31, chp: 22, electrical: 14, ci: 9, ahp: 5, wtp: 4 },
    { month: 'Jan', boiler: 52, tg: 35, chp: 28, electrical: 16, ci: 11, ahp: 8, wtp: 5 },
    { month: 'Feb', boiler: 45, tg: 30, chp: 24, electrical: 13, ci: 9, ahp: 7, wtp: 4 },
    { month: 'Mar', boiler: 68, tg: 42, chp: 35, electrical: 18, ci: 14, ahp: 10, wtp: 6 },
    { month: 'Apr', boiler: 95, tg: 55, chp: 48, electrical: 22, ci: 18, ahp: 12, wtp: 8 },
  ]

  const departmentIssues = [
    { name: 'Boiler', issues: 142, value: 8500000, color: '#ef4444' },
    { name: 'Turbine/TG', issues: 98, value: 12000000, color: '#3b82f6' },
    { name: 'CHP', issues: 76, value: 3200000, color: '#f97316' },
    { name: 'Electrical', issues: 54, value: 2100000, color: '#8b5cf6' },
    { name: 'C&I', issues: 43, value: 4500000, color: '#ec4899' },
    { name: 'AHP', issues: 38, value: 1800000, color: '#22c55e' },
    { name: 'WTP', issues: 21, value: 950000, color: '#06b6d4' },
  ]

  const abcVedMatrix = [
    { abc: 'A', ved: 'V', count: 8, value: 12500000, label: 'A-V' },
    { abc: 'A', ved: 'E', count: 5, value: 4200000, label: 'A-E' },
    { abc: 'A', ved: 'D', count: 2, value: 800000, label: 'A-D' },
    { abc: 'B', ved: 'V', count: 12, value: 6800000, label: 'B-V' },
    { abc: 'B', ved: 'E', count: 18, value: 5500000, label: 'B-E' },
    { abc: 'B', ved: 'D', count: 8, value: 1200000, label: 'B-D' },
    { abc: 'C', ved: 'V', count: 3, value: 450000, label: 'C-V' },
    { abc: 'C', ved: 'E', count: 22, value: 1800000, label: 'C-E' },
    { abc: 'C', ved: 'D', count: 85, value: 2200000, label: 'C-D' },
  ]

  const ropAlerts = [
    { item: 'BFP-SEAL-402', name: 'Boiler Feed Pump Seal', current: 2, min: 5, rop: 8, daysLeft: 2, criticality: 'CRITICAL', dept: 'TG' },
    { item: 'GASKET-MS-001', name: 'Main Steam Gasket', current: 5, min: 10, rop: 12, daysLeft: 4, criticality: 'HIGH', dept: 'BOILER' },
    { item: 'MILL-LNR-800', name: 'Coal Mill Liner', current: 12, min: 10, rop: 15, daysLeft: 6, criticality: 'MEDIUM', dept: 'CHP' },
    { item: 'VALVE-GV-300', name: 'Gate Valve 300#', current: 3, min: 4, rop: 5, daysLeft: 3, criticality: 'HIGH', dept: 'TG' },
    { item: 'TRANS-PT-005', name: 'Pressure Transmitter', current: 8, min: 5, rop: 6, daysLeft: 8, criticality: 'LOW', dept: 'C&I' },
    { item: 'BEARING-SKF-222', name: 'Spherical Roller Bearing', current: 6, min: 4, rop: 6, daysLeft: 5, criticality: 'MEDIUM', dept: 'TG' },
    { item: 'ASH-BLT-200', name: 'Ash Handling Belt', current: 15, min: 8, rop: 10, daysLeft: 10, criticality: 'LOW', dept: 'AHP' },
  ]

  const anomalyAlerts = [
    { item: 'OIL-FIL-004', name: 'Hydraulic Oil Filter', spike: '3.2x', period: 'Last 7 days', severity: 'HIGH', message: 'Possible pump seal leakage' },
    { item: 'MILL-LNR-800', name: 'Coal Mill Liner', spike: '2.8x', period: 'Last 14 days', severity: 'MEDIUM', message: 'Hard coal batch causing accelerated wear' },
    { item: 'ASH-BLT-200', name: 'Ash Handling Belt', spike: '2.1x', period: 'Last 30 days', severity: 'LOW', message: 'Misalignment detected on conveyor #3' },
  ]

  const formatCurrency = (val) => {
    if (val >= 1e7) return `₹${(val/1e7).toFixed(1)}Cr`
    if (val >= 1e5) return `₹${(val/1e5).toFixed(1)}L`
    return `₹${val.toLocaleString()}`
  }

  const KPI_CARDS = [
    { key: 'inventoryValue', label: 'Total Spares Value', icon: DollarSign, trend: '+5.2% QoQ', trendUp: true, isCurrency: true, color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
    { key: 'stockTurnover', label: 'Stock Turnover Ratio', icon: TrendingUp, trend: '+0.3 vs last yr', trendUp: true, isCurrency: false, color: 'bg-green-50 text-green-600', iconBg: 'bg-green-100' },
    { key: 'fillRate', label: 'Order Fill Rate', icon: Package, trend: '+1.2% MoM', trendUp: true, isCurrency: false, suffix: '%', color: 'bg-emerald-50 text-emerald-600', iconBg: 'bg-emerald-100' },
    { key: 'criticalStockouts', label: 'Critical Stockouts', icon: AlertTriangle, trend: '2 resolved this wk', trendUp: true, isCurrency: false, color: 'bg-red-50 text-red-600', iconBg: 'bg-red-100' },
    { key: 'ropAlerts', label: 'Active ROP Alerts', icon: Zap, trend: '3 new this week', trendUp: false, isCurrency: false, color: 'bg-amber-50 text-amber-600', iconBg: 'bg-amber-100' },
    { key: 'aiAccuracy', label: 'AI Prediction Accuracy', icon: Brain, trend: '+2% vs baseline', trendUp: true, isCurrency: false, suffix: '%', color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100' },
  ]

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Plant Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Predictive insights, consumption trends & inventory health</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {['7d', '30d', '90d', '1y'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-sm font-mono font-medium rounded-md transition-colors ${
                  timeRange === r ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2">
            <Download className="w-4.5 h-4.5" />
            Export
          </button>
        </div>
      </div>

      {/* ===== KPI Row ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon
          const value = kpis[card.key]
          const displayValue = card.isCurrency ? formatCurrency(value) : (card.suffix ? `${value}${card.suffix}` : value)
          return (
            <div key={card.key} className="bg-white border border-slate-200 rounded-xl p-5 card-lift">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-2 rounded-lg ${card.iconBg}`}>
                      <Icon className={`w-5 h-5 ${card.color.replace('bg-', 'text-').replace('50', '600')}`} />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-500 truncate">{card.label}</p>
                  <p className="text-3xl font-bold text-slate-900 tabular mt-1">{displayValue}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`text-xs font-medium ${card.trendUp ? 'trend-up' : 'trend-down'}`}>
                      {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    </span>
                    <span className={`text-xs ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>{card.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ===== Main Grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Consumption Trend Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 card-lift">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Flame className="w-5 h-5 text-orange-600" />
                Monthly Spares Consumption Trend
              </h2>
              <span className="text-xs font-mono text-slate-500">Updated: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consumptionTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBoiler" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCHP" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    dx={-10}
                    tickFormatter={(v) => v >= 100 ? `${v/1000}k` : v}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                    formatter={(value, name) => {
                      const labels = { boiler: 'Boiler', tg: 'Turbine/TG', chp: 'CHP', electrical: 'Electrical', ci: 'C&I', ahp: 'AHP', wtp: 'WTP' }
                      return [value, labels[name] || name]
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="boiler" stroke="#ef4444" fillOpacity={1} fill="url(#colorBoiler)" strokeWidth={2} name="Boiler" />
                  <Area type="monotone" dataKey="tg" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTG)" strokeWidth={2} name="Turbine/TG" />
                  <Area type="monotone" dataKey="chp" stroke="#f97316" fillOpacity={1} fill="url(#colorCHP)" strokeWidth={2} name="CHP" />
                  <Area type="monotone" dataKey="electrical" stroke="#8b5cf6" fillOpacity={0.6} strokeWidth={1.5} name="Electrical" />
                  <Area type="monotone" dataKey="ci" stroke="#ec4899" fillOpacity={0.6} strokeWidth={1.5} name="C&I" />
                  <Area type="monotone" dataKey="ahp" stroke="#22c55e" fillOpacity={0.6} strokeWidth={1.5} name="AHP" />
                  <Area type="monotone" dataKey="wtp" stroke="#06b6d4" fillOpacity={0.6} strokeWidth={1.5} name="WTP" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Issues Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 card-lift">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
              <Gauge className="w-5 h-5 text-slate-600" />
              Department-wise Issues & Value ({timeRange})
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentIssues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(value, name) => name === 'value' ? [formatCurrency(value), 'Value'] : [value, name === 'issues' ? 'Items Issued' : '']}
                  />
                  <Bar
                    dataKey="issues"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={28}
                    fill="#1e3a8a"
                    name="Items Issued"
                  />
                  <Bar
                    dataKey="value"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={28}
                    fill="#3b82f6"
                    name="Value (₹)"
                  />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Anomaly Detection */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 card-lift">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Zap className="w-5 h-5 text-amber-600" />
                AI Anomaly Detection
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-green-50 text-green-700 rounded">ISOLATION FOREST ACTIVE</span>
            </div>
            <div className="space-y-3">
              {anomalyAlerts.map((alert, idx) => {
                const sevColors = {
                  HIGH: 'bg-red-50 border-red-500',
                  MEDIUM: 'bg-amber-50 border-amber-500',
                  LOW: 'bg-blue-50 border-blue-500'
                }
                return (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 ${sevColors[alert.severity]}`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${alert.severity === 'HIGH' ? 'bg-red-100 text-red-600' : alert.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        <Zap className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900 truncate pr-2">{alert.name}</p>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${alert.severity === 'HIGH' ? 'bg-red-100 text-red-700' : alert.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-slate-500">
                          <span>Spike: <span className="text-slate-900">{alert.spike}</span></span>
                          <span>Period: <span className="text-slate-900">{alert.period}</span></span>
                          <span>Code: <span className="text-slate-900">{alert.item}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* ABC-VED Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 card-lift">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
              <Shield className="w-5 h-5 text-slate-600" />
              ABC-VED Criticality Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Matrix</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">Count</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">Value</th>
                    <th className="px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">% Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {abcVedMatrix.map((row) => {
                    const totalValue = abcVedMatrix.reduce((sum, r) => sum + r.value, 0)
                    const pct = ((row.value / totalValue) * 100).toFixed(1)
                    const isVital = row.ved === 'V'
                    const isEssential = row.ved === 'E'
                    return (
                      <tr key={row.label} className="hover:bg-slate-50">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${isVital ? 'bg-red-100 text-red-700' : isEssential ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                              {row.ved}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${row.abc === 'A' ? 'bg-blue-100 text-blue-700' : row.abc === 'B' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                              {row.abc}
                            </span>
                            <span className="text-xs text-slate-500">{row.label}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right font-mono tabular">{row.count}</td>
                        <td className="px-3 py-2 text-right font-mono tabular">{formatCurrency(row.value)}</td>
                        <td className="px-3 py-2 text-right text-slate-600">{pct}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Donut Charts */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 text-center">VED Split</h3>
                <div className="h-40 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart2>
                      <Pie2
                        data={[
                          { name: 'VITAL (V)', value: 23, color: '#dc2626' },
                          { name: 'ESSENTIAL (E)', value: 45, color: '#d97706' },
                          { name: 'DESIRABLE (D)', value: 115, color: '#475569' }
                        ]}
                        cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                        paddingAngle={2} dataKey="value" labelLine={false}
                      >
                        <Cell fill="#dc2626" />
                        <Cell fill="#d97706" />
                        <Cell fill="#475569" />
                      </Pie2>
                      <Tooltip formatter={(value) => [value, 'items']} />
                    </PieChart2>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 text-center">ABC Split</h3>
                <div className="h-40 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart2>
                      <Pie2
                        data={[
                          { name: 'A - High', value: 15, color: '#1e3a8a' },
                          { name: 'B - Med', value: 38, color: '#3b82f6' },
                          { name: 'C - Low', value: 130, color: '#93c5fd' }
                        ]}
                        cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                        paddingAngle={2} dataKey="value" labelLine={false}
                      >
                        <Cell fill="#1e3a8a" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#93c5fd" />
                      </Pie2>
                      <Tooltip formatter={(value) => [value, 'items']} />
                    </PieChart2>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ROP Alerts Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 card-lift">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Zap className="w-5 h-5 text-red-600" />
                Reorder Point Alerts
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-red-50 text-red-700 rounded">{ropAlerts.length} Active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Part Code</th>
                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Name</th>
                    <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">Stock</th>
                    <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">Min/ROP</th>
                    <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">Days Left</th>
                    <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">Dept</th>
                    <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ropAlerts.map((alert, idx) => {
                    const sevColors = {
                      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
                      HIGH: 'bg-amber-100 text-amber-800 border-amber-200',
                      MEDIUM: 'bg-blue-100 text-blue-800 border-blue-200',
                      LOW: 'bg-green-100 text-green-800 border-green-200'
                    }
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2"><code className="font-mono text-blue-700">{alert.item}</code></td>
                        <td className="px-3 py-2 text-slate-600 truncate max-w-[160px]">{alert.name}</td>
                        <td className="px-3 py-2 text-center font-mono tabular font-semibold">{alert.current}</td>
                        <td className="px-3 py-2 text-center text-[10px] font-mono text-slate-500">{alert.min} / {alert.rop}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${alert.daysLeft <= 3 ? 'bg-red-100 text-red-700' : alert.daysLeft <= 6 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {alert.daysLeft}d
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-100 text-slate-700">{alert.dept}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${sevColors[alert.criticality]}`}>
                            {alert.criticality}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}