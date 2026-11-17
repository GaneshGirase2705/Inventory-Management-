import React, { useState } from 'react'
import {
  AlertOctagon,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  User,
  ShieldAlert,
  ArrowRight,
  Plus,
  QrCode,
  Check,
  AlertTriangle,
  ChevronRight
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Indents() {
  const {
    emergencyOverride,
    setEmergencyOverride,
    currentRole,
    items,
    deductStock,
    openQrModal,
    addToast
  } = useStore()

  // Tab filter
  const [activeTab, setActiveTab] = useState('ALL')
  // New Indent Modal / Drawer
  const [showNewIndent, setShowNewIndent] = useState(false)

  // Initial Real-World Power Plant Indents
  const [indents, setIndents] = useState([
    {
      id: 'IND-2026-0041',
      unit: 'Unit 1 (500 MW)',
      department: 'Boiler Maintenance',
      workOrder: 'WO-BLR-2026-0812',
      itemCode: 'SPH-TUB-004',
      itemName: 'Platen Superheater Tube Bend SA213-T91 (54mm OD x 8mm WT)',
      qty: 2,
      priority: 'EMERGENCY',
      status: 'EMERGENCY_ISSUED',
      requestedBy: 'A. K. Mishra (Sr. Boiler Eng.)',
      time: '10:45 AM Today',
      reason: 'Pendant superheater tube leak causing pressure drop. Midnight unit trip prevented.',
      postFactoSla: '22h 45m remaining',
    },
    {
      id: 'IND-2026-0042',
      unit: 'Unit 2 (500 MW)',
      department: 'Turbine / TG',
      workOrder: 'WO-TG-2026-0419',
      itemCode: 'BFP-MCH-002',
      itemName: 'Boiler Feed Pump Mechanical Seal Cartridge Assembly',
      qty: 1,
      priority: 'HIGH',
      status: 'PENDING_HOD',
      requestedBy: 'S. Patwardhan (TG Maintenance)',
      time: '09:20 AM Today',
      reason: 'BFP-2B drive-end gland packing excessive leakage. Planned seal change.',
      postFactoSla: null,
    },
    {
      id: 'IND-2026-0043',
      unit: 'Balance of Plant (BoP)',
      department: 'Coal Handling Plant (CHP)',
      workOrder: 'WO-CHP-2026-1102',
      itemCode: 'CLM-ROL-006',
      itemName: 'Coal Mill Grinding Roller Segment High Chrome Alloy',
      qty: 4,
      priority: 'NORMAL',
      status: 'APPROVED',
      requestedBy: 'R. K. Sengupta (CHP In-Charge)',
      time: 'Yesterday, 16:30',
      reason: 'Mill 1E preventive wear overhaul schedule. Clearance approved by HOD.',
      postFactoSla: null,
    },
    {
      id: 'IND-2026-0044',
      unit: 'Unit 1 (500 MW)',
      department: 'Electrical Maintenance',
      workOrder: 'WO-ELE-2026-0331',
      itemCode: 'MTR-6KV-018',
      itemName: '6.6kV 3-Phase 350kW Induction Motor (Class H, IP55)',
      qty: 1,
      priority: 'HIGH',
      status: 'COMPLETED',
      requestedBy: 'V. S. Saxena (Divisional Eng.)',
      time: 'Yesterday, 11:00',
      reason: 'Primary Air (PA) Fan 1A motor thermal trip. Spare installed and synchronised.',
      postFactoSla: null,
    },
  ])

  // New Indent Form State
  const [newIndentData, setNewIndentData] = useState({
    department: 'Boiler Maintenance',
    unit: 'Unit 1 (500 MW)',
    workOrder: 'WO-BLR-2026-0994',
    itemCode: 'BLR-SRV-001',
    qty: 1,
    priority: emergencyOverride ? 'EMERGENCY' : 'NORMAL',
    reason: emergencyOverride ? 'Urgent midnight boiler trip material requisition.' : 'Preventive overhaul maintenance requisition.',
  })

  // Filter indents based on tab
  const filteredIndents = indents.filter((ind) => {
    if (activeTab === 'PENDING') return ind.status === 'PENDING_HOD'
    if (activeTab === 'EMERGENCY') return ind.priority === 'EMERGENCY' || ind.status === 'EMERGENCY_ISSUED'
    if (activeTab === 'COMPLETED') return ind.status === 'COMPLETED' || ind.status === 'APPROVED'
    return true
  })

  // Action: Approve
  const handleApprove = (id) => {
    setIndents((prev) =>
      prev.map((ind) => (ind.id === id ? { ...ind, status: 'APPROVED' } : ind))
    )
    addToast({
      title: '✓ Indent Approved',
      message: `${id} approved by ${currentRole.label}. Ready for QR storekeeper deduction.`,
      type: 'success',
    })
  }

  // Action: Reject
  const handleReject = (id) => {
    setIndents((prev) =>
      prev.map((ind) => (ind.id === id ? { ...ind, status: 'REJECTED' } : ind))
    )
    addToast({
      title: 'Indent Rejected',
      message: `${id} was rejected. Feedback returned to originating engineer.`,
      type: 'warning',
    })
  }

  // Action: Issue via QR
  const handleIssueIndent = (ind) => {
    deductStock(ind.itemCode, ind.qty, `Issued for Indent ${ind.id} (${ind.workOrder})`)
    setIndents((prev) =>
      prev.map((item) => (item.id === ind.id ? { ...item, status: 'COMPLETED' } : item))
    )
    const target = items.find((i) => (i.itemCode || i.code) === ind.itemCode)
    if (target) {
      openQrModal(target)
    }
  }

  // Action: Create Indent
  const handleCreateIndent = (e) => {
    e.preventDefault()
    const targetItem = items.find((i) => (i.itemCode || i.code) === newIndentData.itemCode)
    const newId = `IND-2026-${String(indents.length + 42).padStart(4, '0')}`

    const isEmergency = emergencyOverride || newIndentData.priority === 'EMERGENCY'

    const created = {
      id: newId,
      unit: newIndentData.unit,
      department: newIndentData.department,
      workOrder: newIndentData.workOrder,
      itemCode: newIndentData.itemCode,
      itemName: targetItem?.name || targetItem?.itemName || 'Critical Spare Assembly',
      qty: Number(newIndentData.qty),
      priority: isEmergency ? 'EMERGENCY' : 'NORMAL',
      status: isEmergency ? 'EMERGENCY_ISSUED' : 'PENDING_HOD',
      requestedBy: `${currentRole.label} (${currentRole.jurisdiction})`,
      time: 'Just now',
      reason: newIndentData.reason,
      postFactoSla: isEmergency ? '24h 00m remaining' : null,
    }

    setIndents([created, ...indents])
    setShowNewIndent(false)

    if (isEmergency) {
      deductStock(newIndentData.itemCode, Number(newIndentData.qty), `Emergency Breakdown Issue (${newId})`)
    }

    addToast({
      title: isEmergency ? '🚨 Emergency Indent Dispatched' : '✓ Digital Indent Initiated',
      message: `${newId} generated for ${newIndentData.department}. ${
        isEmergency ? 'Material issued immediately under 24H SLA.' : 'Routed to Shift HOD for approval.'
      }`,
      type: isEmergency ? 'emergency' : 'success',
    })
  }

  return (
    <div className={`space-y-6 transition-all duration-300 ${
      emergencyOverride ? 'p-1 rounded-2xl ring-2 ring-rose-500 shadow-glow-rose' : ''
    }`}>
      {/* -------------------------------------------------------------------- */}
      {/* PROMINENT HIGH-CONTRAST EMERGENCY BREAKDOWN OVERRIDE SWITCH BANNER   */}
      {/* -------------------------------------------------------------------- */}
      <div
        className={`rounded-2xl p-5 border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          emergencyOverride
            ? 'bg-rose-950/90 text-white border-rose-500 shadow-glow-rose'
            : 'bg-white border-slate-200/80 shadow-scada-card text-slate-900'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              emergencyOverride ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-50 text-rose-600 border border-rose-200'
            }`}
          >
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold uppercase font-mono tracking-tight">
                Emergency Breakdown Override (Unit Trip / Boiler Tube Leak)
              </h2>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  emergencyOverride
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-600 border border-slate-300'
                }`}
              >
                SCE Authority Clause 4.2
              </span>
            </div>
            <p className={`text-xs mt-1 ${emergencyOverride ? 'text-rose-200' : 'text-slate-500'}`}>
              For midnight boiler or turbine trips: Bypasses standard HOD pre-approval. Tags stock deduction with mandatory 24-hour post-facto HOD sign-off SLA.
            </p>
          </div>
        </div>

        {/* Master Toggle Switch */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs font-mono font-bold ${emergencyOverride ? 'text-rose-300' : 'text-slate-600'}`}>
            {emergencyOverride ? 'OVERRIDE ENGAGED' : 'STANDARD WORKFLOW'}
          </span>
          <button
            onClick={() => setEmergencyOverride(!emergencyOverride)}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
              emergencyOverride ? 'bg-rose-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                emergencyOverride ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* QUEUE CONTROLS & NEW REQUISITION BUTTON                              */}
      {/* -------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200 font-mono text-xs">
          {[
            { id: 'ALL', label: 'All Indents' },
            { id: 'PENDING', label: 'Pending HOD' },
            { id: 'EMERGENCY', label: 'Emergency Trip SLAs' },
            { id: 'COMPLETED', label: 'Issued / Closed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Create Indent Button */}
        <button
          onClick={() => setShowNewIndent(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold shadow-md transition-all ${
            emergencyOverride
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{emergencyOverride ? '⚡ Immediate Emergency Issue' : '+ Create Departmental Indent'}</span>
        </button>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* REQUISITION QUEUE CARDS                                              */}
      {/* -------------------------------------------------------------------- */}
      <div className="space-y-4">
        {filteredIndents.map((ind) => {
          const isEmergency = ind.priority === 'EMERGENCY' || ind.status === 'EMERGENCY_ISSUED'
          const isPending = ind.status === 'PENDING_HOD'
          const isApproved = ind.status === 'APPROVED'

          return (
            <div
              key={ind.id}
              className={`bg-white rounded-xl border p-5 shadow-scada-card transition-all ${
                isEmergency
                  ? 'border-rose-400 bg-gradient-to-r from-rose-500/[0.03] to-transparent'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Indent Header & Plant Unit Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-xs text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                      {ind.id}
                    </span>

                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {ind.unit}
                    </span>

                    <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {ind.department}
                    </span>

                    <span className="font-mono text-[11px] text-slate-500">
                      WO: <strong className="text-slate-800">{ind.workOrder}</strong>
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        isEmergency
                          ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                          : isPending
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : isApproved
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {ind.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Requested Item Code & Name */}
                  <div className="pt-1">
                    <span className="font-mono font-black text-sm text-slate-900 mr-2">
                      [{ind.itemCode}]
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{ind.itemName}</span>
                    <span className="font-mono font-bold text-sm text-blue-700 ml-2">
                      (Qty: {ind.qty} units)
                    </span>
                  </div>

                  {/* Operational Reason & Requested By */}
                  <p className="text-xs text-slate-600 font-mono pt-1">
                    Reason: <span className="text-slate-800">{ind.reason}</span>
                  </p>

                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
                    <span>Requested by: {ind.requestedBy}</span>
                    <span>Time: {ind.time}</span>
                    {ind.postFactoSla && (
                      <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        24H SLA: {ind.postFactoSla}
                      </span>
                    )}
                  </div>
                </div>

                {/* Requisition Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-2 lg:pt-0">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleApprove(ind.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve Indent
                      </button>

                      <button
                        onClick={() => handleReject(ind.id)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-mono text-xs font-semibold transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        Reject
                      </button>
                    </>
                  )}

                  {(isApproved || isEmergency || emergencyOverride) && ind.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleIssueIndent(ind)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold shadow-md transition-all ${
                        isEmergency || emergencyOverride
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Issue via QR Scan
                    </button>
                  )}

                  {ind.status === 'COMPLETED' && (
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Issued & Deducted
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* NEW DIGITAL REQUISITION MODAL                                        */}
      {/* -------------------------------------------------------------------- */}
      {showNewIndent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden font-mono">
            <div className="p-5 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-sm font-bold uppercase tracking-tight">
                  {emergencyOverride ? '🚨 Emergency Breakdown Requisition' : 'Create Departmental Store Indent'}
                </h2>
              </div>
              <button
                onClick={() => setShowNewIndent(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIndent} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                    Department:
                  </label>
                  <select
                    value={newIndentData.department}
                    onChange={(e) => setNewIndentData({ ...newIndentData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none"
                  >
                    <option value="Boiler Maintenance">Boiler Maintenance</option>
                    <option value="Turbine / TG">Turbine / TG</option>
                    <option value="Coal Handling Plant (CHP)">Coal Handling Plant (CHP)</option>
                    <option value="Ash Handling Plant (AHP)">Ash Handling Plant (AHP)</option>
                    <option value="Electrical Maintenance">Electrical Maintenance</option>
                    <option value="Control & Instrumentation (C&I)">Control & Instrumentation (C&I)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                    Plant Unit:
                  </label>
                  <select
                    value={newIndentData.unit}
                    onChange={(e) => setNewIndentData({ ...newIndentData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none"
                  >
                    <option value="Unit 1 (500 MW)">Unit 1 (500 MW)</option>
                    <option value="Unit 2 (500 MW)">Unit 2 (500 MW)</option>
                    <option value="Balance of Plant (BoP)">Balance of Plant (BoP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                    Spare Part Required:
                  </label>
                  <select
                    value={newIndentData.itemCode}
                    onChange={(e) => setNewIndentData({ ...newIndentData, itemCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-blue-700 focus:outline-none"
                  >
                    {items.map((i) => (
                      <option key={i.itemCode || i.code} value={i.itemCode || i.code}>
                        {i.itemCode || i.code} — {i.name || i.itemName} (Stock: {i.currentStock ?? i.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newIndentData.qty}
                    onChange={(e) => setNewIndentData({ ...newIndentData, qty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                  Work Order / Job Reference:
                </label>
                <input
                  type="text"
                  value={newIndentData.workOrder}
                  onChange={(e) => setNewIndentData({ ...newIndentData, workOrder: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-semibold uppercase text-[10px]">
                  Operational Justification:
                </label>
                <textarea
                  rows="2"
                  value={newIndentData.reason}
                  onChange={(e) => setNewIndentData({ ...newIndentData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                  required
                />
              </div>

              {emergencyOverride && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px]">
                  <strong>⚠️ EMERGENCY OVERRIDE ENGAGED:</strong> Indent will bypass pre-approval and stock will be issued immediately. A 24-hour post-facto audit entry will be logged for HOD review.
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewIndent(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-xl font-bold shadow-md transition-all ${
                    emergencyOverride ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {emergencyOverride ? '⚡ Issue Spares Immediately' : 'Submit for HOD Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
