import React, { useState } from 'react'
import { Tag, Zap, Check, Barcode, Copy } from 'lucide-react'

const VED_COLORS = { V: 'bg-red-100 text-red-800 border-red-200', E: 'bg-amber-100 text-amber-800 border-amber-200', D: 'bg-slate-100 text-slate-700 border-slate-200' }

export default function QRModal({ item, onClose }) {
  const [copied, setCopied] = useState(false)
  const [scanConfirmed, setScanConfirmed] = useState(false)

  const qrData = JSON.stringify({
    type: 'THERMAL_PLANT_SMS',
    itemCode: item.itemCode,
    name: item.name,
    location: item.currentLocation,
    batch: item.batchNo,
    uom: item.uom,
    ved: item.vedClassification,
    abc: item.abcClassification,
    rot: item.isRotable,
    timestamp: Date.now()
  })

  const handleCopy = () => {
    navigator.clipboard.writeText(qrData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleScanConfirm = () => {
    setScanConfirmed(true)
    setTimeout(() => { setScanConfirmed(false); onClose() }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/60 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-900">Thermal Label Preview</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">✕</button>
        </div>
        <div className="p-5 space-y-4">
          {/* Thermal Label */}
          <div className="thermal-label border-2 border-slate-300 rounded-lg p-4 bg-white">
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-1.5 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                <Zap className="w-3 h-3" />
                THERMAL PLANT SMS
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Part Code:</span>
                <span className="font-mono font-bold text-slate-900 tabular">{item.itemCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Description:</span>
                <span className="font-medium text-slate-900 truncate max-w-[160px]">{item.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bin Location:</span>
                <span className="font-mono font-medium text-blue-700">{item.currentLocation || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Batch:</span>
                <span className="font-mono text-sm text-slate-700">{item.batchNo || '—'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">VED:</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${VED_COLORS[item.vedClassification]}`}>
                  {item.vedClassification}
                </span>
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <div className="w-24 h-24 bg-white p-1 border border-slate-300 rounded">
                <div className="w-full h-full bg-slate-900 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-[8px] font-mono">
                    QR CODE
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-[10px] text-slate-400 font-mono">Scan to verify • {new Date().toLocaleDateString()}</div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
            <button onClick={handleCopy} className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Copied QR Data!</span>
                </>
              ) : (
                <>
                  <Tag className="w-5 h-5 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Copy QR Payload</span>
                </>
              )}
            </button>
            <button
              onClick={handleScanConfirm}
              disabled={scanConfirmed}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {scanConfirmed ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span className="text-sm font-medium">Stock Deducted!</span>
                </>
              ) : (
                <>
                  <Barcode className="w-5 h-5" />
                  <span className="text-sm font-medium">Confirm QR Scan & Deduct Stock</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}