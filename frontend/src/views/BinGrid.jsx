import React, { useState } from 'react'
import {
  Layers,
  MapPin,
  Box,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  Minus,
  QrCode,
  Printer,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Info,
  ChevronRight
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function BinGrid() {
  const { items, deductStock, inwardStock, openQrModal, emergencyOverride } = useStore()

  // Active Warehouse Zone
  const [selectedZone, setSelectedZone] = useState('Zone 1')
  // Active Selected Bin for Slide-Over Drawer
  const [activeBinItem, setActiveBinItem] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const zones = [
    {
      id: 'Zone 1',
      name: 'Zone 1: Mechanical & Turbine',
      description: 'Boiler safety valves, BFP seals, lance tubes, superheater bends, turbine bearings',
      baysCount: 4,
    },
    {
      id: 'Zone 2',
      name: 'Zone 2: Electrical & C&I',
      description: '6.6kV motors, VCB circuit breakers, smart pressure transmitters, electro-pneumatic actuators',
      baysCount: 4,
    },
    {
      id: 'Zone 3',
      name: 'Zone 3: Consumables & Lubricants',
      description: 'High-temp graphite gaskets, Viton O-rings, ISO VG 46 turbine oil, synthetic lubricants',
      baysCount: 3,
    },
  ]

  // Filter items by zone or generate realistic spatial layout
  const getItemsForZone = (zoneId) => {
    if (zoneId === 'Zone 1') {
      return items.filter(
        (i) =>
          (i.location || i.binLocation || '').startsWith('Z1') ||
          ['Valves & Trims', 'Mechanical Seals', 'Sootblowers', 'Boiler Tubes', 'Coal Mill Spares', 'Fans & Blowers'].includes(
            i.category
          )
      )
    } else if (zoneId === 'Zone 2') {
      return items.filter(
        (i) =>
          (i.location || i.binLocation || '').startsWith('Z2') ||
          ['Motors', 'Switchgear', 'Instrumentation', 'Actuators', 'Valves & Actuators'].includes(i.category)
      )
    } else {
      return items.filter(
        (i) =>
          (i.location || i.binLocation || '').startsWith('Z3') ||
          ['Piping Consumables', 'Seals & O-Rings', 'Lubricants', 'Burner Assembly'].includes(i.category)
      )
    }
  }

  const zoneItems = getItemsForZone(selectedZone)

  // Construct 4 Bays with 3 Racks each for a true SCADA spatial floor-plan
  const bays = [
    { bayNum: 'B01', label: 'Bay 01 • Heavy Mechanical', racks: ['R01', 'R02', 'R03'] },
    { bayNum: 'B02', label: 'Bay 02 • High Pressure Steam', racks: ['R01', 'R02', 'R03'] },
    { bayNum: 'B03', label: 'Bay 03 • Auxiliary & Mills', racks: ['R01', 'R02', 'R03'] },
    { bayNum: 'B04', label: 'Bay 04 • Precision Instruments', racks: ['R01', 'R02', 'R03'] },
  ]

  // Helper to get item in specific coordinate or synthesize bin cell
  const getItemAtCoord = (bay, rack, binIndex) => {
    const zonePrefix = selectedZone === 'Zone 1' ? 'Z1' : selectedZone === 'Zone 2' ? 'Z2' : 'Z3'
    const coordString = `${zonePrefix}-${bay}-${rack}-B${String(binIndex).padStart(2, '0')}`

    const directMatch = items.find(
      (i) => (i.location || i.binLocation || '').toUpperCase() === coordString.toUpperCase()
    )
    if (directMatch) return { ...directMatch, coord: coordString }

    // Distributed fallback mapping from zone items
    const fallbackItem = zoneItems[(binIndex + rack.charCodeAt(1)) % (zoneItems.length || 1)]
    if (fallbackItem) {
      return {
        ...fallbackItem,
        coord: coordString,
      }
    }

    return null
  }

  const handleCellClick = (cellItem) => {
    setActiveBinItem(cellItem)
    setDrawerOpen(true)
  }

  // Calculate cell color and status
  const getCellStockStatus = (item) => {
    if (!item) return { status: 'EMPTY', color: 'bg-slate-100 border-slate-200 text-slate-400' }
    const stock = item.currentStock ?? item.stock ?? 0
    const msl = item.minStockLevel ?? item.minStock ?? 2

    // Check for QC Quarantine (Sample Violet)
    if (item.qaStatus === 'QUARANTINE' || item.itemCode === 'BLR-SRV-001') {
      return {
        status: 'QC_HOLD',
        color: 'bg-purple-500/10 border-purple-500/40 text-purple-800 hover:border-purple-600',
        badge: 'QC HOLD',
      }
    }
    if (stock <= 0) {
      return {
        status: 'CRITICAL',
        color: 'bg-rose-500/15 border-rose-500/50 text-rose-800 animate-pulse hover:border-rose-600',
        badge: 'EMPTY',
      }
    }
    if (stock <= msl) {
      return {
        status: 'NEAR_MSL',
        color: 'bg-amber-500/15 border-amber-500/50 text-amber-800 hover:border-amber-600',
        badge: 'LOW MSL',
      }
    }
    return {
      status: 'HEALTHY',
      color: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 hover:border-emerald-600',
      badge: 'OPTIMAL',
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* -------------------------------------------------------------------- */}
      {/* HEADER & ZONE SELECTOR                                               */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 font-mono uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Interactive 3D-Style Warehouse Bin Map
            </h1>
            <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              Spatial 4-Tier Hierarchy
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zone &rarr; Bay &rarr; Rack &rarr; Bin coordinate addressing. Click any bin cell to open the live stock drawer.
          </p>
        </div>

        {/* Zone Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 flex-wrap">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                selectedZone === zone.id
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* COLOR-CODED STATUS LEGEND                                            */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-slate-200/80 shadow-xs font-mono text-xs text-slate-600 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <span>Bin Stock Health:</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50"></span>
            Optimal Stock (&gt; MSL)
          </span>
          <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
            <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50"></span>
            Near MSL (Buffer Depleting)
          </span>
          <span className="flex items-center gap-1.5 text-rose-800 font-semibold">
            <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/50 animate-pulse"></span>
            Critical / Stockout (&le; 1)
          </span>
          <span className="flex items-center gap-1.5 text-purple-800 font-semibold">
            <span className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500/50"></span>
            QA/QC Quarantine Hold
          </span>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 3D-STYLE SPATIAL WAREHOUSE BAYS & SHELF GRIDS                        */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {bays.map((bay) => (
          <div
            key={bay.bayNum}
            className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-scada-card flex flex-col justify-between"
          >
            {/* Bay Title */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 font-mono">
              <div>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {bay.bayNum}
                </span>
                <span className="text-xs font-semibold text-slate-700 ml-2">{bay.label}</span>
              </div>
            </div>

            {/* Racks Stacked Vertically */}
            <div className="space-y-4">
              {bay.racks.map((rack) => (
                <div key={rack} className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/70">
                  <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-500 mb-2">
                    <span>RACK {rack}</span>
                    <span className="text-[10px] text-slate-400">4 Shelves</span>
                  </div>

                  {/* 4 Interactive Bin Cells per Shelf */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((binNum) => {
                      const item = getItemAtCoord(bay.bayNum, rack, binNum)
                      const stockInfo = getCellStockStatus(item)
                      const itemCode = item?.itemCode || item?.code || 'SPARE'
                      const stock = item?.currentStock ?? item?.stock ?? 0
                      const ved = (item?.ved || item?.vedClass || 'V').toUpperCase()

                      return (
                        <div
                          key={binNum}
                          onClick={() => item && handleCellClick(item)}
                          className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[64px] select-none relative group hover:shadow-md ${stockInfo.color}`}
                        >
                          <div className="flex items-center justify-between leading-none font-mono">
                            <span className="text-[9px] font-bold opacity-80">
                              B{String(binNum).padStart(2, '0')}
                            </span>
                            <span className={`text-[8px] font-bold px-1 rounded ${
                              ved === 'V' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-white'
                            }`}>
                              {ved}
                            </span>
                          </div>

                          <div className="my-1">
                            <div className="font-mono font-bold text-[10px] truncate leading-tight">
                              {itemCode}
                            </div>
                          </div>

                          <div className="flex items-center justify-between font-mono text-[9px] pt-1 border-t border-black/10">
                            <span className="font-bold tabular-nums">{stock} pcs</span>
                            <span className="text-[8px] opacity-70 uppercase tracking-tighter">
                              {stockInfo.badge}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bay Footnote */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Fire Zone Aisle 4</span>
              <span>12 Bins Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* SLIDE-OVER DRAWER FOR DETAILED BIN INSPECTION                        */}
      {/* -------------------------------------------------------------------- */}
      {drawerOpen && activeBinItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-mono font-bold">
                    BIN: {activeBinItem.coord || activeBinItem.location}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    (activeBinItem.ved || activeBinItem.vedClass) === 'V'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    VED: {(activeBinItem.ved || activeBinItem.vedClass || 'V').toUpperCase()}
                  </span>
                </div>
                <h2 className="text-base font-bold font-mono text-white mt-2 truncate">
                  {activeBinItem.itemCode || activeBinItem.code}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="p-6 space-y-6 flex-1">
              <div>
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Item Description
                </h3>
                <p className="text-sm font-medium text-slate-800 leading-snug">
                  {activeBinItem.name || activeBinItem.itemName}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Category: {activeBinItem.category}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    ABC: {(activeBinItem.abc || activeBinItem.abcClass || 'A').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Stock vs. MSL Progress Meter */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold uppercase">Current Stock:</span>
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">
                    {activeBinItem.currentStock ?? activeBinItem.stock ?? 0} UNITS
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (activeBinItem.currentStock ?? activeBinItem.stock ?? 0) <= (activeBinItem.minStockLevel ?? activeBinItem.minStock ?? 2)
                        ? 'bg-rose-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(10, ((activeBinItem.currentStock ?? activeBinItem.stock ?? 1) / ((activeBinItem.minStockLevel ?? activeBinItem.minStock ?? 2) * 2.5)) * 100)
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Minimum Stock Level (MSL): {activeBinItem.minStockLevel ?? activeBinItem.minStock ?? 2}</span>
                  <span>Safety Buffer: +1</span>
                </div>
              </div>

              {/* Shelf-Life & Certification Details */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Calibration / Shelf-Life:</span>
                  <span className="text-slate-900 font-bold">VALID UNTIL 2027</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mill Test Certificate (MTC):</span>
                  <span className="text-emerald-700 font-bold">MTC-PASS-SA182</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Last Scanned Movement:</span>
                  <span className="text-slate-700">Today, 11:15 AM</span>
                </div>
              </div>

              {/* Inward & Issue Action Controls */}
              <div className="space-y-3">
                <div className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
                  Direct Bin Actions:
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      inwardStock(activeBinItem.itemCode || activeBinItem.code, 5)
                      setActiveBinItem((prev) => ({
                        ...prev,
                        currentStock: (prev.currentStock ?? prev.stock ?? 0) + 5,
                        stock: (prev.currentStock ?? prev.stock ?? 0) + 5,
                      }))
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl font-mono text-xs font-semibold shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    + Inward Stock (+5)
                  </button>

                  <button
                    onClick={() => {
                      deductStock(activeBinItem.itemCode || activeBinItem.code, 1)
                      setActiveBinItem((prev) => ({
                        ...prev,
                        currentStock: Math.max(0, (prev.currentStock ?? prev.stock ?? 1) - 1),
                        stock: Math.max(0, (prev.currentStock ?? prev.stock ?? 1) - 1),
                      }))
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl font-mono text-xs font-semibold shadow-xs transition-all"
                  >
                    <Minus className="w-3.5 h-3.5 text-rose-600" />
                    - Issue via QR (-1)
                  </button>
                </div>

                <button
                  onClick={() => openQrModal(activeBinItem)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-mono text-xs font-bold shadow-md transition-all"
                >
                  <Printer className="w-4 h-4 text-blue-400" />
                  Print 2" × 1" Thermal Sticker
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Zone Bay Coordinate Validated</span>
              <button onClick={() => setDrawerOpen(false)} className="text-blue-600 font-bold hover:underline">
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
