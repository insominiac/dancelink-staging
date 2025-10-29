'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth, useRequireInstructor } from '@/app/lib/auth-context'

interface ClassListItem {
  id: string
  title: string
  level?: string
  isActive: boolean
  startDate: string | null
  scheduleTime: string | null
  durationMins: number | null
  venue: string
  enrolled: number
  capacity: number
  styles: string[]
}

export default function InstructorClassesPage() {
  const { user, loading } = useAuth()
  useRequireInstructor()
  const [items, setItems] = useState<ClassListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [error, setError] = useState<string | null>(null)
  const [instructorId, setInstructorId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user) {
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, status])

  const load = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      // Find instructorId for current user
      const profRes = await fetch(`/api/instructor/profile/${user.id}`)
      if (!profRes.ok) throw new Error('Failed to load instructor profile')
      const prof = await profRes.json()
      const iid = prof.instructor.id as string
      setInstructorId(iid)

      const params = new URLSearchParams({ instructorId: iid, page: String(page), pageSize: String(pageSize), status })
      if (search.trim()) params.set('search', search.trim())
      const res = await fetch(`/api/instructor/classes?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load classes')
      const data = await res.json()
      setItems(data.items)
      setTotal(data.total)
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : 'Failed to load classes')
    } finally {
      setIsLoading(false)
    }
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your classes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded">
          {error}
        </div>
        <button onClick={load} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded">Retry</button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600 mt-2">Manage your teaching schedule and class details</p>
        </div>
        <div>
          <Link href="/instructor/classes/new" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">New Class</Link>
        </div>
      </div>

      <div className="mb-4 bg-white border rounded p-4">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Status</label>
            <select value={status} onChange={(e) => { setStatus(e.target.value as any); setPage(1); }} className="w-full border rounded px-3 py-2">
              <option value="all">All</option>
              <option value="active">Published</option>
              <option value="inactive">Draft</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600 mb-1">Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title or description" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <button type="submit" className="w-full px-3 py-2 bg-gray-800 text-white rounded">Apply</button>
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <span className="text-6xl mb-4 block">📚</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
          <p className="text-gray-600 mb-6">Create your first class to get started.</p>
          <Link href="/instructor/classes/new" className="px-4 py-2 bg-purple-600 text-white rounded">Create Class</Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{c.title}</div>
                      {c.styles?.length ? (
                        <div className="text-xs text-gray-500">{c.styles.join(', ')}</div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {c.scheduleTime ? c.scheduleTime : 'TBD'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.venue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.enrolled}/{c.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {c.isActive ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/instructor/classes/${c.id}`} className="text-purple-600 hover:text-purple-900">Details →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 text-sm">
            <div>
              Page {page} of {totalPages}
            </div>
            <div className="space-x-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
