'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth, useRequireInstructor } from '@/app/lib/auth-context'

interface TxnRow { id: string; date: string; type: 'PAYMENT'|'REFUND'; status: string; amount: number; student: string; classTitle: string }

export default function InstructorEarningsPage() {
  useRequireInstructor()
  const { user } = useAuth()
  const [instructorId, setInstructorId] = useState<string | null>(null)
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [summary, setSummary] = useState<{ gross: number; refunds: number; net: number } | null>(null)
  const [txns, setTxns] = useState<TxnRow[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const thisMonthDefaults = () => {
    const now = new Date()
    const s = new Date(now.getFullYear(), now.getMonth(), 1)
    const e = new Date(); e.setHours(23,59,59,999)
    setFrom(s.toISOString().slice(0,16))
    setTo(e.toISOString().slice(0,16))
  }

  useEffect(() => { thisMonthDefaults() }, [])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const profRes = await fetch(`/api/instructor/profile/${user.id}`)
        if (!profRes.ok) throw new Error('Instructor not found')
        const prof = await profRes.json()
        setInstructorId(prof.instructor.id as string)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      }
    })()
  }, [user])

  const load = async () => {
    if (!instructorId) return
    setLoading(true)
    setError(null)
    try {
      const params: any = { instructorId }
      if (from) params.from = new Date(from).toISOString()
      if (to) params.to = new Date(to).toISOString()
      const q = new URLSearchParams(params)
      const [sumRes, txRes] = await Promise.all([
        fetch(`/api/instructor/earnings/summary?${q.toString()}`),
        fetch(`/api/instructor/earnings/transactions?${q.toString()}&page=${page}&pageSize=${pageSize}`)
      ])
      if (sumRes.ok) {
        const s = await sumRes.json()
        setSummary({ gross: s.totals.gross, refunds: s.totals.refunds, net: s.totals.net })
      }
      if (txRes.ok) {
        const t = await txRes.json()
        setTxns(t.items)
        setTotal(t.total)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch earnings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (instructorId && from && to) load() }, [instructorId, from, to, page])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Earnings & Payments</h1>
        <p className="text-gray-600">Track your teaching income and payment history</p>
      </div>

      {/* Filters */}
      <div className="mb-4 bg-white border rounded p-4">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load() }} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">From</label>
            <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">To</label>
            <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2"></div>
          <div>
            <button type="submit" className="w-full px-3 py-2 bg-gray-800 text-white rounded">Apply</button>
          </div>
        </form>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded p-5 border">
          <div className="text-sm text-gray-500">Gross</div>
          <div className="text-2xl font-bold">${summary ? summary.gross.toFixed(2) : '—'}</div>
        </div>
        <div className="bg-white rounded p-5 border">
          <div className="text-sm text-gray-500">Refunds</div>
          <div className="text-2xl font-bold text-red-600">-{summary ? summary.refunds.toFixed(2) : '—'}</div>
        </div>
        <div className="bg-white rounded p-5 border">
          <div className="text-sm text-gray-500">Net</div>
          <div className="text-2xl font-bold text-green-700">${summary ? summary.net.toFixed(2) : '—'}</div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <a href={`/api/instructor/earnings/export?instructorId=${instructorId || ''}${from ? `&from=${encodeURIComponent(new Date(from).toISOString())}`:''}${to ? `&to=${encodeURIComponent(new Date(to).toISOString())}`:''}`} className="px-3 py-2 border rounded text-sm">Export CSV</a>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {txns.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(r.date).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.status}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${r.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>{r.amount < 0 ? '-' : ''}${Math.abs(r.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.student}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.classTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 text-sm">
          <div>Page {page} of {totalPages}</div>
          <div className="space-x-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
