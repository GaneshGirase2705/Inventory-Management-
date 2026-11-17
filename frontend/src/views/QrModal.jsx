import React from 'react'
import { X, Printer, QrCode, ShieldCheck, MapPin, Tag } from 'lucide-react'

export default function QrModal({ item, onClose }) {
  if (!item) return null

  const handlePrint = () => {
    window.print()
  }

  // Fallback QR code generator URL using standard QR image service or backend
  const qrImageUrl = item.qrCodeUrl?.startsWith('http')
    ? item.qrCodeUrl
    : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SMS-PART|CODE:${item.itemCode}|LOC:${item.locationCode || 'Z1-B01-R01-B01'}|NAME:${encodeURIComponent(item.name)}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide uppercase">Print Thermal Bin Tag</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label Area */}
        <div className="p-6">
          <div
            id="printable-thermal-label"
            className="border-2 border-dashed border-slate-400 p-5 rounded-lg bg-slate-50 text-slate-900 font-sans shadow-inner"
          >
            {/* Plant Header */}
            <div className="border-b-2 border-slate-900 pb-2 mb-3 flex justify-between items-center">
              <div>
                <h2 className="text-xs font-black tracking-widest text-slate-800 uppercase">
                  NTPC / STATE THERMAL POWER
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase">CENTRAL STORE &amp; SPARES</p>
              </div>
              <span className="text-[9px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                UNIT 1 &amp; 2
              </span>
            </div>

            {/* QR Code & Critical Details */}
            <div className="flex gap-4 items-center">
              <div className="bg-white p-2 border border-slate-300 rounded shadow-sm flex-shrink-0">
                <img
                  src={qrImageUrl}
                  alt={`QR for ${item.itemCode}`}
                  className="w-28 h-28 object-contain"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Part Identifier</div>
                <div className="font-mono text-base font-black text-slate-900 tracking-tight">
                  {item.itemCode}
                </div>
                <div className="text-xs font-medium text-slate-700 truncate" title={item.name}>
                  {item.name}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.vedClassification === 'V'
                      ? 'bg-red-600 text-white'
                      : item.vedClassification === 'E'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-600 text-white'
                  }`}>
                    VED: {item.vedClassification}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
                    ABC: {item.abcClassification}
                  </span>
                </div>
              </div>
            </div>

            {/* Bin Coordinates & Barcode footer */}
            <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-amber-100/70 border border-amber-300 rounded p-1.5">
                <span className="text-[9px] font-bold text-amber-900 uppercase block">Shelf Coordinate</span>
                <span className="font-mono font-black text-amber-950 text-xs">
                  {item.locationCode || 'Z1-B01-R01-B01'}
                </span>
              </div>
              <div className="bg-slate-200/70 border border-slate-300 rounded p-1.5">
                <span className="text-[9px] font-bold text-slate-600 uppercase block">OEM Part No</span>
                <span className="font-mono font-bold text-slate-900 text-[11px] truncate block">
                  {item.partNumber || 'BHEL-OEM-GEN'}
                </span>
              </div>
            </div>

            {item.requiresQaClearance && (
              <div className="mt-2 flex items-center justify-between text-[10px] text-green-800 font-bold bg-green-50 px-2 py-1 rounded border border-green-200">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> QA Clearance Mandatory
                </span>
                <span className="font-mono">VERIFIED</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-100 px-6 py-4 flex items-center justify-between border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Formatted for 4" × 2" Zebra / Citizen thermal printers
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 flex items-center gap-2 shadow"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              Print Label
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
