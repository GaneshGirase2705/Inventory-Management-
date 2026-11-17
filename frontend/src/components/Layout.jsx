import React, { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  Layers,
  FileScan,
  AlertOctagon,
  Sparkles,
  PackageSearch,
  Search,
  Clock,
  Shield,
  Zap,
  Printer,
  QrCode,
  LogOut,
  ChevronRight,
  ExternalLink,
  Flame,
  Radio,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { useStore, ROLES } from '../context/StoreContext'
import ThermalQrModal from './ThermalQrModal'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    currentRole,
    setCurrentRole,
    telemetry,
    emergencyOverride,
    setEmergencyOverride,
    openQrModal,
    items,
    toasts,
  } = useStore()

  // Global Cmd+K Instant Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchInputRef = useRef(null)

  // Filter items matching search query
  const searchResults = searchQuery.trim()
    ? items.filter(
        (item) =>
          (item.itemCode || item.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.name || item.itemName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.location || item.binLocation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

  // Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navItems = [
    {
      name: 'Command Center',
      path: '/',
      icon: Activity,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    },
    {
      name: 'Warehouse Bin Map',
      path: '/bin-grid',
      icon: Layers,
      badge: 'Z1–Z3',
      badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    },
    {
      name: 'Inward GRN & OCR Studio',
      path: '/inward-grn',
      icon: FileScan,
      badge: 'AI OCR',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    },
    {
      name: 'Emergency & Indents',
      path: '/indents',
      icon: AlertOctagon,
      badge: emergencyOverride ? 'TRIP OVERRIDE' : '12 Open',
      badgeColor: emergencyOverride
        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    },
    {
      name: 'AI Parts & Anomalies',
      path: '/ai-finder',
      icon: Sparkles,
      badge: 'pgvector',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
    },
    {
      name: 'Master Spares Catalog',
      path: '/inventory',
      icon: PackageSearch,
      badge: `${items.length} Spares`,
      badgeColor: 'bg-slate-700/50 text-slate-300 border border-slate-600',
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem('sms_token')
    localStorage.removeItem('sms_user')
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#F4F6F9] font-sans text-slate-900 overflow-hidden">
      {/* ---------------------------------------------------------------------- */}
      {/* LEFT SIDEBAR: Deep Obsidian-Slate (bg-[#0B1120] border-r border-slate-800) */}
      {/* ---------------------------------------------------------------------- */}
      <aside className="w-64 bg-[#0B1120] border-r border-slate-800 text-slate-300 flex flex-col flex-shrink-0 z-30 select-none">
        {/* Plant Branding & Live Status Header */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400/30 flex items-center justify-center flex-shrink-0 shadow-glow-cyan">
              <Zap className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white font-mono">SCADA_SMS</span>
                <span className="text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Thermal Store Telemetry</p>
            </div>
          </div>

          {/* GLOWING LIVE PLANT TELEMETRY BADGE */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 shadow-inner">
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Generation Telemetry
              </span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold">1000 MW</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-300 font-medium">UNIT 1: 500 MW</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-emerald"></span>
                  [ONLINE]
                </span>
              </div>
              <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-300 font-medium">UNIT 2: 500 MW</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-emerald"></span>
                  [ONLINE]
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>MS: 17.4 MPa</span>
              <span>TEMP: 540°C</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1 dark-scroll">
          <div className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500">
            Navigation Console
          </div>

          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path))
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded leading-none flex-shrink-0 ${
                    isActive ? 'bg-blue-800/60 text-blue-100 border border-blue-400/40' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Quick Launch QR Button */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => openQrModal()}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all font-mono"
          >
            <QrCode className="w-4 h-4" />
            <span>Print QR / Scan Issue</span>
          </button>
        </div>

        {/* User Role Card & Logout */}
        <div className="p-3 border-t border-slate-800 bg-[#070b14] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-slate-200 flex-shrink-0">
              {currentRole.label.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-white font-semibold truncate leading-tight">{currentRole.label}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{currentRole.jurisdiction}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="w-7 h-7 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ------------------------------------------------------------------ */}
        {/* TOP COMMAND HEADER: Sticky Frosted-Glass Bar                       */}
        {/* ------------------------------------------------------------------ */}
        <header className="sticky top-0 z-20 h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/90 px-6 flex items-center justify-between gap-4 shadow-sm">
          {/* Cmd+K Instant Global Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                placeholder="Search Part Code (BFP-SEAL-402), Bin (Z1-B04), or Equipment..."
                className="w-full pl-9 pr-14 py-2 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 rounded-xl border border-slate-300/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all font-mono"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white border border-slate-300 rounded text-slate-500 shadow-2xs">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Instant Search Dropdown Results */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-scada-elevated z-50 overflow-hidden divide-y divide-slate-100">
                <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Matched Thermal Spares ({searchResults.length})</span>
                  <span>Instant Part Finder</span>
                </div>
                {searchResults.map((item) => (
                  <div
                    key={item.itemCode || item.code}
                    onMouseDown={() => {
                      openQrModal(item)
                      setSearchQuery('')
                    }}
                    className="p-3 hover:bg-blue-50/60 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                          {item.itemCode || item.code}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          (item.ved || item.vedClass) === 'V'
                            ? 'bg-rose-100 text-rose-700 border border-rose-300'
                            : 'bg-amber-100 text-amber-700 border border-amber-300'
                        }`}>
                          VED: {item.ved || item.vedClass || 'V'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 truncate mt-0.5">
                        {item.name || item.itemName}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] font-mono text-slate-500">Bin: {item.location || item.binLocation}</div>
                      <div className="text-xs font-mono font-bold text-slate-900">
                        {item.currentStock ?? item.stock} in stock
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Controls: Shift Indicator + Role Switcher Pill */}
          <div className="flex items-center gap-3">
            {/* Active Shift Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{telemetry.shift}</span>
            </div>

            {/* Emergency Breakdown Trigger Badge */}
            {emergencyOverride && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-300 rounded-xl text-xs font-mono font-bold text-rose-700 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>OVERRIDE ON</span>
              </div>
            )}

            {/* ROLE SWITCHER PILL */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {ROLES.map((role) => {
                const isSelected = currentRole.id === role.id
                return (
                  <button
                    key={role.id}
                    onClick={() => setCurrentRole(role)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {role.label}
                  </button>
                )
              })}
            </div>

            {/* Global Print QR Button */}
            <button
              onClick={() => openQrModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all font-mono"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Print Label</span>
            </button>
          </div>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/* MAIN SCADA CANVAS (bg-[#F4F6F9])                                   */}
        {/* ------------------------------------------------------------------ */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Outlet />
        </main>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* GLOBAL THERMAL QR LABEL & SCANNER MODAL                                */}
      {/* ---------------------------------------------------------------------- */}
      <ThermalQrModal />

      {/* ---------------------------------------------------------------------- */}
      {/* SLEEK INDUSTRIAL BOTTOM-RIGHT TOAST NOTIFICATION STACK                */}
      {/* ---------------------------------------------------------------------- */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-scada-elevated border flex items-start gap-3 animate-in slide-in-from-bottom duration-300 ${
              toast.type === 'emergency'
                ? 'bg-rose-950 text-white border-rose-700 shadow-glow-rose'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {toast.type === 'emergency' ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <div className="text-xs font-bold font-mono tracking-tight">{toast.title}</div>
              <div className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
