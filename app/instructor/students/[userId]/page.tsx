'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth, useRequireInstructor } from '@/app/lib/auth-context'

export default function StudentDetailsPage({ params }: { params: { userId: string } }) {
  useRequireInstructor()
  const { user } = useAuth()
  const [instructorId, setInstructorId] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [classes, setClasses] = useState<any[]>([])
  const [enrollClassId, setEnrollClassId] = useState('')

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const profRes = await fetch(`/api/instructor/profile/${user.id}`)
        if (!profRes.ok) throw new Error('Instructor not found')
        const prof = await profRes.json()
        const iid = prof.instructor.id as string
        setInstructorId(iid)

        const [detailRes, classesRes] = await Promise.all([
          fetch(`/api/instructor/students/${params.userId}?instructorId=${iid}`),
          fetch(`/api/instructor/classes?instructorId=${iid}&status=active&page=1&pageSize=100`),
        ])
        if (!detailRes.ok) throw new Error('Failed to load student')
        const detail = await detailRes.json()
        setData(detail.data)
        setNote(detail.data.summary.latestNote || '')

        if (classesRes.ok) {
          const cls = await classesRes.json()
          setClasses(cls.items || [])
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load student')
      } finally {
        setLoading(false)
      }
    })()
  }, [user, params.userId])

  const saveNote = async () => {
    if (!instructorId) return
    setBusy(true)
    try {
      const res = await fetch(`/api/instructor/students/${params.userId}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId, note }),
      })
      if (!res.ok) throw new Error('Failed to save note')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save note')
    } finally {
      setBusy(false)
    }
  }

  const enroll = async () => {
    if (!instructorId || !enrollClassId) return
    setBusy(true)
    try {
      const res = await fetch(`/api/instructor/students/${params.userId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId, classId: enrollClassId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to enroll')
      }
      // reload
      const detailRes = await fetch(`/api/instructor/students/${params.userId}?instructorId=${instructorId}`)
      if (detailRes.ok) setData((await detailRes.json()).data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to enroll')
    } finally {
      setBusy(false)
    }
  }

  const cancel = async (bookingId: string) => {
    if (!instructorId) return
    if (!confirm('Cancel this enrollment?')) return
    setBusy(true)
    try {
      const res = await fetch(`/api/instructor/students/${params.userId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId, bookingId }),
      })
      if (!res.ok) throw new Error('Failed to cancel')
      const detailRes = await fetch(`/api/instructor/students/${params.userId}?instructorId=${instructorId}`)
      if (detailRes.ok) setData((await detailRes.json()).data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to cancel')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded">{error || 'Student not found'}</div>
        <Link href="/instructor/students" className="inline-block mt-4 text-purple-600">← Back to students</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.student.name}</h1>
          <p className="text-gray-600">{data.student.email}</p>
        </div>
        <Link href="/instructor/students" className="text-sm text-gray-600">Back to list</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Total Classes</div>
                <div className="text-gray-900">{data.summary.totalBookings}</div>
              </div>
              <div>
                <div className="text-gray-500">Attendance</div>
                <div className="text-gray-900">{data.summary.attendanceRate === null ? '—' : `${Math.round(data.summary.attendanceRate * 100)}%`}</div>
              </div>
              <div>
                <div className="text-gray-500">Present</div>
                <div className="text-gray-900">{data.summary.present}</div>
              </div>
              <div>
                <div className="text-gray-500">Absent</div>
                <div className="text-gray-900">{data.summary.absent}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Classes</h2>
              <div className="flex items-center gap-2">
                <select value={enrollClassId} onChange={(e) => setEnrollClassId(e.target.value)} className="border rounded px-2 py-1 text-sm">
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.title} ({c.scheduleTime || 'TBD'})</option>
                  ))}
                </select>
                <button disabled={!enrollClassId || busy} onClick={enroll} className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50">Enroll</button>
              </div>
            </div>
            {data.bookings.length ? (
              <ul className="divide-y">
                {data.bookings.map((b: any) => (
                  <li key={b.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{b.classTitle || 'Unknown Class'}</div>
                      <div className="text-xs text-gray-500">{b.startDate ? new Date(b.startDate).toLocaleString() : ''} • {b.venue}</div>
                    </div>
                    {b.status === 'CONFIRMED' && (
                      <button disabled={busy} onClick={() => cancel(b.id)} className="text-sm text-red-600">Cancel</button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-600">No class history yet.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">Instructor Notes</h3>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={6} className="w-full border rounded px-3 py-2" placeholder="Progress notes, feedback, goals..." />
            <button disabled={busy} onClick={saveNote} className="mt-3 px-3 py-2 bg-purple-600 text-white rounded disabled:opacity-50">Save Note</button>
          </div>
        </div>
      </div>
    </div>
  )
}