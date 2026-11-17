import React, { useState } from 'react'
import {
  FileScan,
  Zap,
  CheckCircle2,
  AlertCircle,
  Printer,
  ShieldCheck,
  Truck,
  FileText,
  UploadCloud,
  ChevronRight,
  Sparkles,
  QrCode,
  Layers,
  ArrowRight
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function GrnStudio() {
  const { inwardStock, openQrModal, items, addToast } = useStore()

  // OCR scanning state
  const [scanning, setScanning] = useState(false)
  const [scannedDone, setScannedDone] = useState(false)

  // GRN Form State (Auto-populated by AI OCR)
  const [formData, setFormData] = useState({
    poNumber: 'PO-2026-NTPC-0042',
    vendorName: 'Bharat Heavy Electricals Ltd (BHEL)',
    vehicleNumber: 'MH-12-RN-8842',
    challanNumber: 'DC-2026-BLR-8942',
    itemCode: 'BLR-SRV-001',
    itemName: 'Main Steam Safety Relief Valve Disc SA-182 F91',
    receivedQty: 4,
    targetBin: 'Z1-B01-R01-B01',
    mtcVerified: true,
    materialGrade: 'SA-182 F91 (Superheater Spec)',
    pressureRating: '2500# / 185 kg/cm²',
    qcRemarks: 'Metallurgical hardness test certified. Hydrostatic test 280 bar PASS.',
  })

  // Simulate AI OCR Scan on Challan
  const handleSimulateOcr = () => {
    setScanning(true)
    setScannedDone(false)

    setTimeout(() => {
      setScanning(false)
      setScannedDone(true)
      setFormData({
        poNumber: 'PO-2026-NTPC-0042',
        vendorName: 'Bharat Heavy Electricals Ltd (BHEL)',
        vehicleNumber: 'MH-12-RN-8842',
        challanNumber: 'DC-2026-BLR-8942',
        itemCode: 'BLR-SRV-001',
        itemName: 'Main Steam Safety Relief Valve Disc SA-182 F91',
        receivedQty: 4,
        targetBin: 'Z1-B01-R01-B01',
        mtcVerified: true,
        materialGrade: 'SA-182 F91 (Superheater Spec)',
        pressureRating: '2500# / 185 kg/cm²',
        qcRemarks: 'Spectro-analysis confirmed Cr-Mo-V alloy composition. Hydro test PASS.',
      })

      addToast({
        title: '⚡ Challan OCR Processed',
        message: 'Extracted 3 line items with 99.2% AI confidence from BHEL Delivery Challan.',
        type: 'success',
      })
    }, 1400)
  }

  // Submit GRN and trigger thermal QR label
  const handleSubmitGrn = (e) => {
    e.preventDefault()
    inwardStock(formData.itemCode, Number(formData.receivedQty), formData.poNumber)

    const targetItem = items.find((i) => (i.itemCode || i.code) === formData.itemCode) || {
      itemCode: formData.itemCode,
      name: formData.itemName,
      location: formData.targetBin,
      ved: 'V',
      abc: 'A',
      currentStock: formData.receivedQty,
      minStockLevel: 2,
    }

    // Open Thermal QR Modal
    openQrModal(targetItem)
  }

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* HEADER BANNER                                                        */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 font-mono uppercase tracking-tight flex items-center gap-2">
            <FileScan className="w-5 h-5 text-cyan-600" />
            Inward GRN & AI Challan OCR Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automate paper delivery challan ingestion via computer vision OCR, verify QA metallurgical test certs, and print thermal QR bin stickers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
            Vision OCR: 99.2% Accuracy
          </span>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* SPLIT-SCREEN LAYOUT: CHALLAN SCANNER (LEFT) & GRN FORM (RIGHT)       */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================================================================== */}
        {/* LEFT PANEL: SUPPLIER DELIVERY CHALLAN OCR STUDIO                   */}
        {/* ================================================================== */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Physical Challan / Invoice Scan Zone
              </span>
              <span className="text-[10px] font-mono text-slate-400">PDF / TIFF / JPEG Scan</span>
            </div>

            {/* Document Scanner Preview with Animated Laser Scan */}
            <div className="relative bg-slate-900 rounded-xl p-4 border border-slate-700/80 shadow-inner overflow-hidden select-none">
              {/* Laser Scanning Animation */}
              {scanning && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] animate-laser-scan"></div>
                  <div className="absolute inset-0 bg-cyan-500/10"></div>
                </div>
              )}

              {/* Realistic Paper Challan Mockup */}
              <div className="bg-white rounded-lg p-4 font-mono text-slate-900 shadow-lg text-[10px] leading-tight space-y-3 border border-slate-300">
                {/* Challan Header */}
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <div>
                    <div className="font-extrabold text-xs text-black uppercase tracking-tight">
                      BHARAT HEAVY ELECTRICALS LIMITED
                    </div>
                    <div className="text-[9px] text-slate-600">Power Sector Supply Division • Tiruchirappalli</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-black">DELIVERY CHALLAN</div>
                    <div className="text-[9px] text-slate-700 font-bold">DC-2026-BLR-8942</div>
                  </div>
                </div>

                {/* Logistics Details */}
                <div className="grid grid-cols-2 gap-2 text-[9px] bg-slate-50 p-2 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500">PO Ref:</span> <span className="font-bold">PO-2026-NTPC-0042</span>
                    <br />
                    <span className="text-slate-500">Date:</span> <span>17-NOV-2026</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Transporter:</span> <span>VRL Logistics Ltd</span>
                    <br />
                    <span className="text-slate-500">Vehicle No:</span> <span className="font-bold">MH-12-RN-8842</span>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-300 rounded overflow-hidden">
                  <table className="w-full text-left text-[9px]">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-1">#</th>
                        <th className="p-1">Item Code</th>
                        <th className="p-1">Description</th>
                        <th className="p-1 text-right">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="bg-yellow-50/50">
                        <td className="p-1">01</td>
                        <td className="p-1 font-bold text-blue-700">BLR-SRV-001</td>
                        <td className="p-1">Safety Valve Disc SA-182 F91</td>
                        <td className="p-1 text-right font-bold">4 PCS</td>
                      </tr>
                      <tr>
                        <td className="p-1">02</td>
                        <td className="p-1 font-bold text-blue-700">BFP-MCH-002</td>
                        <td className="p-1">BFP Mech Seal Cartridge 200 bar</td>
                        <td className="p-1 text-right font-bold">2 PCS</td>
                      </tr>
                      <tr>
                        <td className="p-1">03</td>
                        <td className="p-1 font-bold text-blue-700">STM-GSK-008</td>
                        <td className="p-1">Graphite Gasket 600# DN100</td>
                        <td className="p-1 text-right font-bold">20 PCS</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Stamp & Certification */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-300 text-[8px] text-slate-500">
                  <span>DISPATCH STAMP: BHEL QC INSPECTION CLEARED</span>
                  <span className="font-bold text-emerald-800">HYDROSTATIC TEST: 280 BAR OK</span>
                </div>
              </div>

              {/* Confidence Extraction Overlays */}
              {scannedDone && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-mono animate-in fade-in">
                  <div className="bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 p-1.5 rounded-lg">
                    <span className="font-bold block">99.2% MATCH</span>
                    <span className="text-[8px] text-slate-400">PO Cross-Validated</span>
                  </div>
                  <div className="bg-blue-950/80 border border-blue-600/60 text-blue-300 p-1.5 rounded-lg">
                    <span className="font-bold block">VEHICLE VERIFIED</span>
                    <span className="text-[8px] text-slate-400">MH-12-RN-8842</span>
                  </div>
                  <div className="bg-cyan-950/80 border border-cyan-600/60 text-cyan-300 p-1.5 rounded-lg">
                    <span className="font-bold block">3 LINE ITEMS</span>
                    <span className="text-[8px] text-slate-400">Ready for Binning</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trigger Scan Button */}
          <div className="mt-4">
            <button
              onClick={handleSimulateOcr}
              disabled={scanning}
              className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-mono text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-amber-300" />
                  Running Neural Vision OCR Extraction...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  ⚡ Simulate AI OCR Scan on Challan
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* RIGHT PANEL: CLEAN GRN ENTRY & QA/QC CERTIFICATION FORM           */}
        {/* ================================================================== */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-bold font-mono text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Digital Goods Receipt Note (GRN) Form
            </span>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
              Auto-Populated by OCR
            </span>
          </div>

          <form onSubmit={handleSubmitGrn} className="space-y-4 font-mono text-xs">
            {/* PO & Challan Number */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                  Purchase Order No:
                </label>
                <input
                  type="text"
                  value={formData.poNumber}
                  onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                  Delivery Challan No:
                </label>
                <input
                  type="text"
                  value={formData.challanNumber}
                  onChange={(e) => setFormData({ ...formData, challanNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Vendor & Vehicle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                  Vendor / Supplier:
                </label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                  Gate Vehicle Number:
                </label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Item & Qty */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                  Verified Part Code:
                </label>
                <select
                  value={formData.itemCode}
                  onChange={(e) => {
                    const selected = items.find((i) => (i.itemCode || i.code) === e.target.value)
                    setFormData({
                      ...formData,
                      itemCode: e.target.value,
                      itemName: selected?.name || selected?.itemName || formData.itemName,
                      targetBin: selected?.location || selected?.binLocation || formData.targetBin,
                    })
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {items.map((i) => (
                    <option key={i.itemCode || i.code} value={i.itemCode || i.code}>
                      {i.itemCode || i.code} — {i.name || i.itemName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                  Received Qty:
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.receivedQty}
                  onChange={(e) => setFormData({ ...formData, receivedQty: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Target Warehouse Bin */}
            <div>
              <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                Target Warehouse Bin Allocation:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.targetBin}
                  onChange={(e) => setFormData({ ...formData, targetBin: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-50/50 border border-blue-200 rounded-lg font-bold text-blue-900 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 whitespace-nowrap">Zone 1 Shelf</span>
              </div>
            </div>

            {/* QA/QC METALLURGICAL TEST CERTIFICATE VERIFICATION */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800 text-[11px] uppercase">
                    QA/QC Test Certificate Verification
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.mtcVerified}
                    onChange={(e) => setFormData({ ...formData, mtcVerified: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {formData.mtcVerified && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Material Grade:</span>
                    <span className="font-bold text-slate-800">{formData.materialGrade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Design Pressure / Rating:</span>
                    <span className="font-bold text-slate-800">{formData.pressureRating}</span>
                  </div>
                  <div className="text-slate-500">
                    <span>Inspection Clearance Note:</span>
                    <p className="text-emerald-800 font-semibold mt-0.5">{formData.qcRemarks}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all mt-4 font-mono"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>✓ Confirm GRN Receipt & Generate Thermal QR Label</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
