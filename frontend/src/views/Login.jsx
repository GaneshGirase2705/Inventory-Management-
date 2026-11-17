import React, { useState } from 'react'
import { Zap, User, Lock, LogIn, AlertCircle, CheckCircle, Radio, Shield, Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('storekeeper')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const demoUsers = [
    { username: 'sce.shift1@powerplant.com', password: 'password123', role: 'Shift Charge Engineer', dept: 'Midnight Trip Override (SCE)' },
    { username: 'storekeeper', password: 'password123', role: 'Storekeeper', dept: 'Central Store Logistics' },
    { username: 'boiler.engineer@powerplant.com', password: 'password123', role: 'Maintenance Engineer', dept: 'Boiler & Turbine' },
    { username: 'boiler.incharge@powerplant.com', password: 'password123', role: 'HOD Maintenance', dept: 'Overhaul Approvals' },
    { username: 'qa.engineer@powerplant.com', password: 'password123', role: 'QA/QC Engineer', dept: 'Metallurgical MTC Clearances' },
  ]

  const handleLogin = (userCreds) => {
    const u = userCreds || { username, password }
    setLoading(true)
    setError('')
    setSuccess(false)

    setTimeout(() => {
      const mockUser = {
        fullName: u.username.includes('sce')
          ? 'V. Rao (Shift Charge Eng.)'
          : u.username.includes('boiler.incharge')
          ? 'S. Nambiar (HOD Maintenance)'
          : u.username.includes('qa')
          ? 'K. Deshmukh (QA/QC)'
          : u.username.includes('engineer')
          ? 'A. K. Mishra (Maintenance Eng.)'
          : 'Rajesh Sharma (Storekeeper)',
        role: u.username.includes('sce')
          ? 'SHIFT_CHARGE_ENGINEER'
          : u.username.includes('incharge')
          ? 'HOD_MAINTENANCE'
          : u.username.includes('qa')
          ? 'QA_QC_ENGINEER'
          : 'STOREKEEPER',
        department: 'GENERAL',
        username: u.username,
      }

      localStorage.setItem('sms_token', 'scada-jwt-' + Date.now())
      localStorage.setItem('sms_user', JSON.stringify(mockUser))
      setSuccess(true)
      setTimeout(() => navigate('/'), 600)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Subtle Tech Grids */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Plant Telemetry SCADA Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-glow-cyan mb-3 border border-blue-400/40">
            <Zap className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white font-mono uppercase">
            Thermal Power Plant SMS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Store & Critical Spares Management Console
          </p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-full font-mono text-[10px]">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">UNIT 1 & 2: 1000 MW [ONLINE]</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6">
          {success && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-300 rounded-xl flex items-center gap-2 text-xs font-mono animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Authentication Verified. Entering SCADA Console...</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-950/80 border border-rose-600 text-rose-300 rounded-xl flex items-center gap-2 text-xs font-mono animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold uppercase text-[10px]">
                Operator Credentials / Email:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold uppercase text-[10px]">
                Access Key / Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all font-mono"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating Operator...' : 'Authenticate & Enter Console'}</span>
            </button>
          </form>

          {/* One-Click Role Launchers */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Instant One-Click Role Simulator:
            </span>
            <div className="space-y-1.5 font-mono text-[11px]">
              {demoUsers.map((u) => (
                <button
                  key={u.username}
                  onClick={() => handleLogin(u)}
                  className="w-full p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-between text-left transition-colors text-slate-300 hover:text-white"
                >
                  <div>
                    <span className="font-bold text-white block">{u.role}</span>
                    <span className="text-[9px] text-slate-500">{u.dept}</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-bold">&rarr; Login</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
