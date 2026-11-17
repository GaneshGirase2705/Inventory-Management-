import React, { useState } from 'react'
import {
  Search,
  Filter,
  Package,
  QrCode,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  ArrowUpDown,
  Download,
  Plus
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Inventory() {
  const { items, openQrModal, deductStock, inwardStock } = useStore()

  const [search, setSearch] = useState('')
  const [vedFilter, setVedFilter] = useState('ALL')
  const [abcFilter, setAbcFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // Categories list
  const categories = ['ALL', ...new Set(items.map((i) => i.category || 'General').filter(Boolean))]

  // Filter items
  const filtered = items.filter((item) => {
    const code = (item.itemCode || item.code || '').toLowerCase()
    const name = (item.name || item.itemName || '').toLowerCase()
    const loc = (item.location || item.binLocation || '').toLowerCase()
    const s = search.toLowerCase()
    const matchesSearch = !search || code.includes(s) || name.includes(s) || loc.includes(s)

    const ved = (item.ved || item.vedClass || 'V').toUpperCase()
    const matchesVed = vedFilter === 'ALL' || ved === vedFilter

    const abc = (item.abc || item.abcClass || 'A').toUpperCase()
    const matchesAbc = abcFilter === 'ALL' || abc === abcFilter

    const cat = item.category || 'General'
    const matchesCat = categoryFilter === 'ALL' || cat === categoryFilter

    return matchesSearch && matchesVed && matchesAbc && matchesCat
  })

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* HEADER BANNER                                                        */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-scada-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 font-mono uppercase tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Master Thermal Spares Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete inventory ledger across Boiler, Turbine, CHP, AHP, Electrical, and C&I divisions with ABC-VED classifications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Total Active Spares: {items.length}
          </span>
          <button
            onClick={() => openQrModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Batch Label Scanner</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* SEARCH & FILTERS BAR                                                 */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Part Code (BLR-SRV-001), Description, or Bin..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white text-xs text-slate-800 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* VED Filter */}
          <div className="sm:col-span-2">
            <select
              value={vedFilter}
              onChange={(e) => setVedFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none"
            >
              <option value="ALL">VED: ALL</option>
              <option value="V">VED: Vital (V)</option>
              <option value="E">VED: Essential (E)</option>
              <option value="D">VED: Desirable (D)</option>
            </select>
          </div>

          {/* ABC Filter */}
          <div className="sm:col-span-2">
            <select
              value={abcFilter}
              onChange={(e) => setAbcFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-bold focus:outline-none"
            >
              <option value="ALL">ABC: ALL</option>
              <option value="A">ABC: High (A)</option>
              <option value="B">ABC: Medium (B)</option>
              <option value="C">ABC: Low (C)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none truncate"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'Category: ALL' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* HIGH-PRECISION SCADA INVENTORY TABLE                                 */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-scada-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-4">Part Code</th>
                <th className="py-3 px-4 font-sans">Description & Specs</th>
                <th className="py-3 px-4 text-center">VED</th>
                <th className="py-3 px-4 text-center">ABC</th>
                <th className="py-3 px-4">Warehouse Bin</th>
                <th className="py-3 px-4 text-right">In-Stock</th>
                <th className="py-3 px-4 text-right">MSL</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const code = item.itemCode || item.code
                const name = item.name || item.itemName
                const ved = (item.ved || item.vedClass || 'V').toUpperCase()
                const abc = (item.abc || item.abcClass || 'A').toUpperCase()
                const loc = item.location || item.binLocation || 'Z1-B01-R01-B01'
                const stock = item.currentStock ?? item.stock ?? 0
                const msl = item.minStockLevel ?? item.minStock ?? 2
                const isBelowMsl = stock <= msl

                return (
                  <tr
                    key={code}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    {/* Part Code */}
                    <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">
                      <span className="bg-slate-100 group-hover:bg-blue-100 px-2 py-0.5 rounded text-blue-700 font-bold border border-slate-200 group-hover:border-blue-300 transition-colors">
                        {code}
                      </span>
                    </td>

                    {/* Name & Category */}
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-800 text-xs">{name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.category || 'General'}
                      </div>
                    </td>

                    {/* VED Pill */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          ved === 'V'
                            ? 'bg-rose-500/10 text-rose-700 border border-rose-500/30'
                            : ved === 'E'
                            ? 'bg-amber-500/10 text-amber-800 border border-amber-500/30'
                            : 'bg-sky-500/10 text-sky-700 border border-sky-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ved === 'V' ? 'bg-rose-500' : ved === 'E' ? 'bg-amber-500' : 'bg-sky-500'
                          }`}
                        ></span>
                        {ved}
                      </span>
                    </td>

                    {/* ABC Pill */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                        {abc}
                      </span>
                    </td>

                    {/* Bin Location */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">
                        {loc}
                      </span>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3 px-4 text-right tabular-nums whitespace-nowrap">
                      <span
                        className={`font-black text-xs ${
                          isBelowMsl ? 'text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200' : 'text-slate-900'
                        }`}
                      >
                        {stock} pcs
                      </span>
                    </td>

                    {/* Minimum Stock Level */}
                    <td className="py-3 px-4 text-right tabular-nums text-slate-500 whitespace-nowrap">
                      {msl} pcs
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => openQrModal(item)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
                        title="Print 2x1 Thermal QR Sticker"
                      >
                        <Printer className="w-3.5 h-3.5 text-blue-500" />
                        <span>Print QR</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Showing {filtered.length} of {items.length} power plant spares</span>
          <span>PostgreSQL pgvector Catalog Active</span>
        </div>
      </div>
    </div>
  )
}
