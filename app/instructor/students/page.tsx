'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth, useRequireInstructor } from '@/app/lib/auth-context'

interface StudentRow {
  id: string
  name: string
  email: string
  totalBookings: number
  lastBookingAt: string | null
  attendanceRate: number | null
}

export default function InstructorStudentsPage() {
  useRequireInstructor()
  const { user, loading } = useAuth()
  const [items, setItems] = useState<StudentRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [q, setQ] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [instructorId, setInstructorId] = useState<string | null>(null)

  useEffect(() => {
    if (user) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page])

  const load = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const profRes = await fetch(`/api/instructor/profile/${user.id}`)
      if (!profRes.ok) throw new Error('Instructor profile not found')
      const prof = await profRes.json()
      const iid = prof.instructor.id as string
      setInstructorId(iid)

      const params = new URLSearchParams({ instructorId: iid, page: String(page), pageSize: String(pageSize) })
      if (q.trim()) params.set('search', q.trim())
      const res = await fetch(`/api/instructor/students?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load students')
      const data = await res.json()
      setItems(data.items)
      setTotal(data.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load students')
    } finally {
      setIsLoading(false)
    }
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-600 mt-2">View and manage your enrolled students</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/api/instructor/students/export?instructorId=${instructorId || ''}`} className="px-3 py-2 border rounded text-sm">Export CSV</a>
        </div>
      </div>

      <div className="mb-4 bg-white border rounded p-4">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600 mb-1">Search</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or email" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <button type="submit" className="w-full px-3 py-2 bg-gray-800 text-white rounded">Apply</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading || isLoading ? (
          <div className="p-12 text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-5xl block mb-2">👥</span>
            <div className="text-gray-600">No students found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Classes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.totalBookings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.attendanceRate === null ? '—' : `${Math.round(s.attendanceRate * 100)}%`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link href={`/instructor/students/${s.id}`} className="text-purple-600 hover:text-purple-900">View →</Link>
                    </td>
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
