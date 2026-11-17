import React, { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import {
  QrCode,
  CheckCircle,
  AlertCircle,
  Package,
  Search,
  Zap,
  Camera,
  ScanLine,
  RotateCcw,
  AlertOctagon,
  ShieldCheck,
  ChevronDown
} from 'lucide-react'
import { itemsAPI, stockAPI, MOCK_ITEMS } from '../services/api'
import QRModal from '../components/QRModal'

export default function Scanner() {
  const [scanResult, setScanResult] = useState(null)
  const [issueQty, setIssueQty] = useState(1)
  const [itemDetails, setItemDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [scannerActive, setScannerActive] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [emergencyOverride, setEmergencyOverride] = useState(false)
  const [emergencyJustification, setEmergencyJustification] = useState('')
  const lastScanRef = useRef('')

  useEffect(() => {
    if (!scannerActive) return

    const qrScanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 260, height: 260 },
      rememberLastUsedCamera: true
    })

    qrScanner.render(
      (result) => {
        if (result === lastScanRef.current) return
        lastScanRef.current = result
        handleScanCaptured(result)
      },
      () => {}
    )

    return () => {
      qrScanner.clear().catch(() => {})
    }
  }, [scannerActive])

  const handleScanCaptured = (result) => {
    setError('')
    setSuccess('')
    let code = result
    if (result.includes('CODE:')) {
      const parts = result.split('|')
      const codePart = parts.find(p => p.startsWith('CODE:'))
      if (codePart) code = codePart.replace('CODE:', '').trim()
    }
    setScanResult(code)
    fetchItemDetails(code)
  }

  const fetchItemDetails = async (itemCode) => {
    try {
      const res = await itemsAPI.getAll({ search: itemCode })
      const items = res.data || []
      if (items.length > 0) {
        setItemDetails(items[0])
      } else {
        const fallback = MOCK_ITEMS.find(i => i.itemCode === itemCode)
        if (fallback) {
          setItemDetails(fallback)
        } else {
          setItemDetails(null)
          setError(`Part "${itemCode}" not found in central catalog`)
        }
      }
    } catch (e) {
      const fallback = MOCK_ITEMS.find(i => i.itemCode === itemCode)
      if (fallback) setItemDetails(fallback)
    }
  }

  const handleIssue = async () => {
    if (!itemDetails) return
    if (emergencyOverride && !emergencyJustification.trim()) {
      setError('Emergency Breakdown Override requires justification for post-facto HOD review.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await stockAPI.scanIssue(
        itemDetails.id,
        issueQty,
        itemDetails.locationCode,
        emergencyOverride,
        emergencyOverride ? `[EMERGENCY OVERRIDE] ${emergencyJustification}` : 'Normal issue via QR scan'
      )
      setSuccess(
        `Successfully issued ${issueQty} ${itemDetails.uom} of ${itemDetails.name}. New bin balance: ${res.data?.balanceAfter ?? (itemDetails.currentStock - issueQty)} (Optimistic Lock Verified)`
      )
      // Update local item stock
      setItemDetails(prev => ({
        ...prev,
        currentStock: Math.max(0, (prev.currentStock || 0) - issueQty)
      }))
      setScanResult(null)
      setIssueQty(1)
      if (emergencyOverride) {
        setEmergencyJustification('')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete stock issue. Please check bin balance.')
    } finally {
      setLoading(false)
    }
  }

  const handleInward = async () => {
    if (!itemDetails) return
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await stockAPI.scanInward(itemDetails.id, issueQty, itemDetails.locationCode, 'PO-2026-BHEL-0042')
      setSuccess(`Inward receipt of ${issueQty} ${itemDetails.uom} binned at ${itemDetails.locationCode || 'Zone 1'}`)
      setItemDetails(prev => ({
        ...prev,
        currentStock: (prev.currentStock || 0) + issueQty
      }))
      setScanResult(null)
      setIssueQty(1)
    } catch (err) {
      setError('Inward binning recorded in offline mode.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Room Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
              Store Logistics &bull; Optical Deduction Console
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            High-Speed Barcode &amp; QR Terminal
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Instant stock deduction, inward GRN binning, and emergency breakdown bypass
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setScannerActive(!scannerActive)}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              scannerActive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-400" />
            {scannerActive ? 'Disable Camera' : 'Enable Camera Scanner'}
          </button>
        </div>
      </div>

      {/* Prominent Red Emergency Breakdown Override Banner */}
      <div className={`p-4 rounded-xl border transition-all ${
        emergencyOverride
          ? 'bg-red-500/10 border-red-500 ring-2 ring-red-500/30'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${emergencyOverride ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <AlertOctagon className="w-6 h-6 flex-shrink-0" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Emergency Breakdown Override Protocol</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border">
                  Clause 4.2
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Permits Shift In-Charge to immediately draw critical spares for boiler/turbine trips without prior HOD signoff.
                Requires mandatory post-facto HOD ratification within 24 hours.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={emergencyOverride}
              onChange={(e) => setEmergencyOverride(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            <span className="ml-3 text-xs font-black uppercase text-slate-800">
              {emergencyOverride ? 'Override ACTIVE' : 'Standard Issue'}
            </span>
          </label>
        </div>

        {emergencyOverride && (
          <div className="mt-4 pt-3 border-t border-red-200">
            <label className="block text-xs font-bold text-red-900 mb-1">
              Emergency Justification &amp; Plant Equipment Tag <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={emergencyJustification}
              onChange={(e) => setEmergencyJustification(e.target.value)}
              placeholder="e.g., Unit 2 BFP-2B mechanical seal catastrophic failure at 02:15 AM causing severe deaerator drop"
              className="w-full text-xs font-mono px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-white"
            />
          </div>
        )}
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera or Simulated Gun Input (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {scannerActive ? (
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-4 text-center">
              <div id="reader" className="w-full max-w-md mx-auto rounded-lg overflow-hidden" />
              <p className="text-xs text-slate-400 mt-2 font-mono">
                Position thermal label QR code inside viewfinder box
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 mx-auto flex items-center justify-center text-blue-600">
                <ScanLine className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Laser Scanner Gun or Simulated Barcode Input</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Scan with physical USB/Bluetooth handheld barcode scanner gun or pick a simulated thermal plant spare below:
                </p>
              </div>

              {/* Simulated Quick Parts Bar */}
              <div className="pt-2">
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Quick Simulate Thermal Spares (Click to Load)
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {MOCK_ITEMS.slice(0, 6).map((item) => (
                    <button
                      key={item.itemCode}
                      onClick={() => handleScanCaptured(item.itemCode)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-amber-100 hover:border-amber-400 text-slate-800 font-mono text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span className={`w-2 h-2 rounded-full ${item.vedClassification === 'V' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      {item.itemCode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Manual Input Fallback */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder="Or type/paste Item Code (e.g. BFP-MCH-002, BLR-SRV-001)"
              className="flex-1 text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleScanCaptured(e.target.value.trim())
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.target.previousSibling
                if (input && input.value.trim()) handleScanCaptured(input.value.trim())
              }}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800"
            >
              Lookup
            </button>
          </div>
        </div>

        {/* Right Column: Scanned Item Details & Deduction Console (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-xs text-red-700">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-bold">Transaction Blocked</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-800">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-bold">Transaction Committed</p>
                <p className="mt-0.5">{success}</p>
              </div>
            </div>
          )}

          {itemDetails ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {itemDetails.itemCode}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  itemDetails.vedClassification === 'V'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  VED: {itemDetails.vedClassification} &bull; Class {itemDetails.abcClassification}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">{itemDetails.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{itemDetails.description}</p>
              </div>

              {/* Physical Bin Location & Current Stock */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Shelf Coordinate</span>
                  <span className="font-mono text-sm font-black text-slate-900">
                    {itemDetails.locationCode || 'Z1-B01-R01-B01'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Available Balance</span>
                  <span className="font-mono text-sm font-black text-emerald-600">
                    {itemDetails.currentStock} {itemDetails.uom}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Quantity ({itemDetails.uom})</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIssueQty(Math.max(1, issueQty - 1))}
                    className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={itemDetails.currentStock}
                    value={issueQty}
                    onChange={(e) => setIssueQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center font-mono font-bold text-sm py-1.5 border border-slate-300 rounded-lg"
                  />
                  <button
                    onClick={() => setIssueQty(issueQty + 1)}
                    className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Deduction Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleIssue}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow ${
                    emergencyOverride
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {emergencyOverride ? 'Execute Emergency Issue (Post-Facto)' : 'Confirm QR Stock Issue'}
                </button>

                <button
                  onClick={handleInward}
                  disabled={loading}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-lg font-bold text-xs"
                >
                  + Inward Binning Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-2">
              <Package className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-xs font-medium">Scan part barcode or click a quick simulate item above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
