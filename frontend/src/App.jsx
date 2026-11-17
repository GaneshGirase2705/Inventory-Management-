import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  QrCode,
  FileText,
  BarChart3,
  LogOut,
  Zap,
  User,
  Grid,
  AlertOctagon,
  Clock,
  ShieldCheck
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory Catalog', href: '/inventory', icon: Package },
  { name: 'Warehouse Bin Grid', href: '/bin-grid', icon: Grid },
  { name: 'QR Scanner & Issue', href: '/scanner', icon: QrCode },
  { name: 'Indent Portal', href: '/indents', icon: FileText },
  { name: 'Analytics & AI ROP', href: '/analytics', icon: BarChart3 },
]

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('sms_token')
    localStorage.removeItem('sms_user')
    navigate('/login', { replace: true })
  }

  const user = JSON.parse(localStorage.getItem('sms_user') || '{"fullName":"Rajesh Sharma","role":"STOREKEEPER","department":"GENERAL","username":"storekeeper"}')

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Industrial Dark Slate Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col flex-shrink-0 z-20">
        {/* Plant Control Room Header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-wide uppercase text-white">Power Plant SMS</h1>
              <p className="text-[10px] font-mono text-slate-400 uppercase">Store &amp; Spares Lifecycle</p>
            </div>
          </div>

          {/* Plant Unit Live Status Pill */}
          <div className="mt-4 px-3 py-2 rounded-md bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold tracking-tight text-emerald-400">UNIT 1 &amp; 2 ONLINE</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">1000 MW</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Profile & Shift Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user.fullName || user.username}</p>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
                {user.role?.replace('_', ' ')} &bull; {user.department || 'GENERAL'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Control Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Shift A (06:00 &mdash; 14:00)</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Optimistic Concurrency Active (@Version)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/scanner"
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm uppercase tracking-wide"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              Emergency Issue
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
