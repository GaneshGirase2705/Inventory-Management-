import React, { createContext, useContext, useState, useEffect } from 'react'
import { itemsAPI, MOCK_ITEMS } from '../services/api'

const initialMockItems = (MOCK_ITEMS || []).map((i) => ({
  ...i,
  location: i.locationCode || i.location || 'Z1-B01-R01-B01',
  binLocation: i.locationCode || i.location || 'Z1-B01-R01-B01',
  abc: i.abcClassification || i.abc || 'A',
  ved: i.vedClassification || i.ved || 'V',
  stock: i.currentStock ?? 4,
}))

const StoreContext = createContext()

export const ROLES = [
  { id: 'STOREKEEPER', label: 'Storekeeper', jurisdiction: 'Gate & Bin Operations' },
  { id: 'MAINTENANCE_ENGINEER', label: 'Maintenance Eng.', jurisdiction: 'Boiler & TG Dept.' },
  { id: 'HOD_MAINTENANCE', label: 'Shift HOD', jurisdiction: 'Approvals & Overhaul' },
  { id: 'QA_QC_ENGINEER', label: 'QA/QC', jurisdiction: 'Metallurgical MTC Clearances' },
]

export function StoreProvider({ children }) {
  // Active Role in Control Room
  const [currentRole, setCurrentRole] = useState(ROLES[0])
  
  // Plant Telemetry
  const [telemetry, setTelemetry] = useState({
    unit1Mw: 500,
    unit2Mw: 500,
    unit1Status: 'ONLINE',
    unit2Status: 'ONLINE',
    shift: 'SHIFT B • 14:00–22:00',
    steamPressure: 17.4, // MPa
    steamTemp: 540,      // °C
  })

  // Emergency Breakdown Override State
  const [emergencyOverride, setEmergencyOverride] = useState(false)

  // Master Items Stock State
  const [items, setItems] = useState(initialMockItems || [])
  const [loadingItems, setLoadingItems] = useState(false)

  // Real-Time Immutable Audit Ticker Feed
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-1',
      time: '11:42',
      type: 'ISSUE',
      desc: '2x ID Fan Bearing 22230 -> Unit 1 Mechanical',
      user: 'R. Sharma (Storekeeper)',
      tag: 'REGULAR',
      code: 'IDF-BRG-012',
    },
    {
      id: 'log-2',
      time: '11:15',
      type: 'INWARD',
      desc: '10x Spiral Wound Gasket DN100 -> Zone 1 Bin Z1-B04-R02-B12',
      user: 'P. Verma (Storekeeper)',
      tag: 'QC_CLEARED',
      code: 'STM-GSK-008',
    },
    {
      id: 'log-3',
      time: '10:50',
      type: 'EMERGENCY_ISSUE',
      desc: '1x BFP Mech Seal Cartridge -> Unit 2 Boiler (Midnight Trip)',
      user: 'V. Rao (Shift Charge Eng.)',
      tag: 'POST_FACTO_24H',
      code: 'BFP-MCH-002',
    },
    {
      id: 'log-4',
      time: '10:12',
      type: 'QA_CLEARANCE',
      desc: '4x SA-182 F91 Safety Relief Valve Disc',
      user: 'K. Deshmukh (QA/QC)',
      tag: 'MTC_PASSED',
      code: 'BLR-SRV-001',
    },
    {
      id: 'log-5',
      time: '09:30',
      type: 'ROTABLE',
      desc: '1x 6.6kV 350kW Motor -> Workshop Overhaul (Rewinding)',
      user: 'A. Saxena (Electrical)',
      tag: 'UNDER_REPAIR',
      code: 'MTR-6KV-018',
    },
    {
      id: 'log-6',
      time: '08:45',
      type: 'INDENT_APPROVED',
      desc: '5x Coal Mill Grinding Roller Segment -> Approved by HOD CHP',
      user: 'S. Nambiar (HOD CHP)',
      tag: 'APPROVED',
      code: 'CLM-ROL-006',
    },
  ])

  // Toast Notifications
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4)
    setToasts((prev) => [...prev, { id, ...toast }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  // Thermal QR Label Modal State
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [activeQrItem, setActiveQrItem] = useState(initialMockItems[0] || null)

  const openQrModal = (item) => {
    if (item) {
      setActiveQrItem(item)
    } else if (items.length > 0) {
      setActiveQrItem(items[0])
    }
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  // Deduct Stock (Live Simulated QR Scan)
  const deductStock = (itemCode, qty = 1, reason = 'QR Handheld Scan Deduction') => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.itemCode === itemCode || item.code === itemCode) {
          const currentQty = item.currentStock ?? item.stock ?? 5
          const newQty = Math.max(0, currentQty - qty)
          return { ...item, currentStock: newQty, stock: newQty }
        }
        return item
      })
    )

    // Add entry to audit ticker
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const newLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      type: emergencyOverride ? 'EMERGENCY_ISSUE' : 'ISSUE',
      desc: `${qty}x ${itemCode} issued -> ${reason}`,
      user: `${currentRole.label} (${currentRole.jurisdiction})`,
      tag: emergencyOverride ? 'POST_FACTO_24H' : 'SCANNED_OK',
      code: itemCode,
    }
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 9)])

    addToast({
      title: emergencyOverride ? '🚨 Emergency Stock Deduction' : '✓ Stock Deducted via QR',
      message: `Issued ${qty} unit(s) of ${itemCode}. Stock balance updated immediately.`,
      type: emergencyOverride ? 'emergency' : 'success',
    })
  }

  // Inward Stock (GRN / Replenishment)
  const inwardStock = (itemCode, qty = 1, poNumber = 'PO-2026-GEN-01') => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.itemCode === itemCode || item.code === itemCode) {
          const currentQty = item.currentStock ?? item.stock ?? 0
          const newQty = currentQty + qty
          return { ...item, currentStock: newQty, stock: newQty }
        }
        return item
      })
    )

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const newLog = {
      id: `log-${Date.now()}`,
      time: timeStr,
      type: 'INWARD',
      desc: `${qty}x ${itemCode} binned from ${poNumber}`,
      user: `${currentRole.label}`,
      tag: 'QC_CLEARED',
      code: itemCode,
    }
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 9)])

    addToast({
      title: '✓ Stock Inward Confirmed',
      message: `Added +${qty} unit(s) of ${itemCode} to active bin storage.`,
      type: 'success',
    })
  }

  // Load items from API with fallback
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingItems(true)
        const res = await itemsAPI.getAll()
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data)
        }
      } catch (err) {
        console.warn('Backend unavailable, using initial mock spares catalog')
      } finally {
        setLoadingItems(false)
      }
    }
    loadData()
  }, [])

  return (
    <StoreContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        telemetry,
        emergencyOverride,
        setEmergencyOverride,
        items,
        loadingItems,
        auditLogs,
        toasts,
        addToast,
        qrModalOpen,
        activeQrItem,
        openQrModal,
        closeQrModal,
        deductStock,
        inwardStock,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
