import React, { useState } from 'react'
import {
  X,
  Printer,
  QrCode,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  MapPin,
  Clock
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function ThermalQrModal() {
  const {
    qrModalOpen,
    activeQrItem,
    closeQrModal,
    items,
    deductStock,
    emergencyOverride,
  } = useStore()

  const [scanQty, setScanQty] = useState(1)
  const [selectedItemCode, setSelectedItemCode] = useState('')
  const [scanningLaser, setScanningLaser] = useState(false)
  const [lastScannedSuccess, setLastScannedSuccess] = useState(false)

  if (!qrModalOpen) return null

  // Resolve active item
  const currentItem =
    items.find((i) => (i.itemCode || i.code) === (selectedItemCode || (activeQrItem?.itemCode || activeQrItem?.code))) ||
    activeQrItem ||
    items[0]

  const itemCode = currentItem?.itemCode || currentItem?.code || 'BLR-SRV-001'
  const itemName = currentItem?.name || currentItem?.itemName || 'Main Steam Safety Relief Valve Disc SA-182 F91'
  const location = currentItem?.location || currentItem?.binLocation || 'Z1-B01-R01-B01'
  const ved = (currentItem?.ved || currentItem?.vedClass || 'V').toUpperCase()
  const abc = (currentItem?.abc || currentItem?.abcClass || 'A').toUpperCase()
  const currentStock = currentItem?.currentStock ?? currentItem?.stock ?? 4
  const msl = currentItem?.minStockLevel || currentItem?.minStock || 2

  const handleSimulateScan = () => {
    setScanningLaser(true)
    setLastScannedSuccess(false)
    setTimeout(() => {
      setScanningLaser(false)
      setLastScannedSuccess(true)
      deductStock(itemCode, scanQty, emergencyOverride ? 'Emergency Breakdown Trip Override' : 'Routine Store QR Handheld Issue')
      setTimeout(() => setLastScannedSuccess(false), 2500)
    }, 700)
  }

  const handlePrint = () => {
    window.print()
  }

  // Generate SVG QR Matrix
  const qrMatrix = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,1,0],
    [0,1,0,1,1,0,0,1,1,0,0,1,0,1,0,1,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,1,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1,0],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,1,1,1,0,1,1,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,1,1],
  ]

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Industrial Thermal Label & Issue Scanner
                {emergencyOverride && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                    Emergency Override Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono">Zebra ZT410 • 2" × 1" Die-Cut Continuous Direct Thermal</p>
            </div>
          </div>
          <button
            onClick={closeQrModal}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Item Selector Dropdown */}
          <div className="flex items-center justify-between gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
              Select Thermal Spare:
            </label>
            <select
              value={itemCode}
              onChange={(e) => setSelectedItemCode(e.target.value)}
              className="w-full text-xs font-mono font-medium bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {items.map((item) => (
                <option key={item.itemCode || item.code} value={item.itemCode || item.code}>
                  [{item.itemCode || item.code}] {item.name || item.itemName} (Stock: {item.currentStock ?? item.stock})
                </option>
              ))}
            </select>
          </div>

          {/* REALISTIC 2" x 1" INDUSTRIAL THERMAL STICKER PREVIEW */}
          <div className="flex flex-col items-center">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <span>Physical 2" × 1" Thermal Sticker Preview</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600">300 DPI Direct Thermal</span>
            </div>

            <div
              id="thermal-label-print"
              className="relative w-full max-w-[460px] bg-white rounded-lg border-2 border-dashed border-slate-400 p-4 shadow-md text-slate-900 select-none overflow-hidden"
            >
              {/* Laser Scanning Animation Overlay */}
              {scanningLaser && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  <div className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-laser-scan"></div>
                  <div className="absolute inset-0 bg-red-500/10"></div>
                </div>
              )}

              {/* Plant Authority Header */}
              <div className="flex items-center justify-between border-b border-black pb-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 bg-black text-white text-[9px] font-black flex items-center justify-center rounded-sm">
                    TP
                  </div>
                  <span className="text-[11px] font-black tracking-tighter uppercase font-mono">
                    NTPC / STATE THERMAL STORE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className={`px-1 py-0.2 rounded font-bold ${
                    ved === 'V' ? 'bg-black text-white' : 'border border-black'
                  }`}>
                    VED: {ved}
                  </span>
                  <span className="border border-black px-1 rounded font-bold">
                    ABC: {abc}
                  </span>
                </div>
              </div>

              {/* Core Label Content: SVG QR Code + JetBrains Mono Part Specs */}
              <div className="grid grid-cols-12 gap-3 items-center">
                {/* SVG QR Code */}
                <div className="col-span-4 flex flex-col items-center justify-center p-1 bg-white border border-slate-900 rounded">
                  <svg viewBox="0 0 17 17" className="w-24 h-24 shape-rendering-crispEdges">
                    {qrMatrix.map((row, rIdx) =>
                      row.map((cell, cIdx) =>
                        cell ? (
                          <rect
                            key={`${rIdx}-${cIdx}`}
                            x={cIdx}
                            y={rIdx}
                            width="1"
                            height="1"
                            fill="#000000"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                  <span className="text-[8px] font-mono tracking-widest text-slate-600 mt-1">
                    VERIFIED_SPARE
                  </span>
                </div>

                {/* Part Spec Details */}
                <div className="col-span-8 flex flex-col justify-between h-full pl-1">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Item Part Code</div>
                    <div className="text-base font-extrabold font-mono tracking-tight text-black leading-none mb-1">
                      {itemCode}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-snug">
                      {itemName}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-300 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase">Bin Location</div>
                      <div className="text-xs font-mono font-bold text-black bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 inline-block">
                        {location}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase">Current Stock</div>
                      <div className="text-xs font-mono font-bold text-black">
                        {currentStock} UNITS {currentStock <= msl && <span className="text-rose-600 text-[10px]">(MSL: {msl})</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barcode & QA Clearance Stamp */}
              <div className="mt-2 pt-1.5 border-t border-dashed border-slate-400 flex items-center justify-between text-[9px] font-mono text-slate-600">
                <div className="flex items-center gap-1 text-emerald-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>QA/QC CLEARANCE: CERT-MTC-2026-PASS</span>
                </div>
                <span>DATE: {new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>
          </div>

          {/* Interactive Handheld Scan / Deduct Controls */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Issue Qty:</label>
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setScanQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-mono font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-mono font-bold text-sm text-slate-900 border-x border-slate-200">
                    {scanQty}
                  </span>
                  <button
                    onClick={() => setScanQty((q) => Math.min(currentStock || 10, q + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-mono font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-medium text-xs shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  Print Label (Zebra)
                </button>

                <button
                  onClick={handleSimulateScan}
                  disabled={scanningLaser || currentStock <= 0}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all ${
                    emergencyOverride
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                  } disabled:opacity-50`}
                >
                  {scanningLaser ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin text-amber-300" />
                      Scanning Barcode...
                    </>
                  ) : lastScannedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      Stock Deducted!
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      Simulate Handheld QR Scan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Emergency Breakdown notice */}
            {emergencyOverride && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs font-mono">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>
                  EMERGENCY ISSUE LOGGED: Pre-approval bypassed under SCE Authority. 24H Post-Facto SLA initiated.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Item Hash: SHA256-{(itemCode).replace(/-/g, '').toLowerCase()}</span>
          <span>Stock Balance: {currentStock} Available</span>
        </div>
      </div>
    </div>
  )
}
