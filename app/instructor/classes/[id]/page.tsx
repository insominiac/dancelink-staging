'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth, useRequireInstructor } from '@/app/lib/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ClassDetailsPage({ params }: { params: { id: string } }) {
  useRequireInstructor()
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cls, setCls] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [instructorId, setInstructorId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params.id])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const profRes = await fetch(`/api/instructor/profile/${user!.id}`)
      if (!profRes.ok) throw new Error('Instructor profile not found')
      const prof = await profRes.json()
      const iid = prof.instructor.id as string
      setInstructorId(iid)

      const res = await fetch(`/api/instructor/classes/${params.id}?instructorId=${iid}`)
      if (!res.ok) throw new Error('Failed to load class')
      const data = await res.json()
      setCls(data.class)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load class')
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (isActive: boolean) => {
    if (!instructorId) return
    setBusy(true)
    try {
      const res = await fetch(`/api/instructor/classes/${params.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId, isActive }),
      })
      if (!res.ok) throw new Error('Failed to update publish status')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update publish status')
    } finally {
      setBusy(false)
    }
  }

  const duplicate = async () => {
    if (!instructorId) return
    setBusy(true)
    try {
      const res = await fetch(`/api/instructor/classes/${params.id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId }),
      })
      if (!res.ok) throw new Error('Failed to duplicate class')
      router.push('/instructor/classes')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to duplicate class')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!instructorId) return
    if (!confirm('Are you sure you want to delete this class? This cannot be undone.')) return
    setBusy(true)
    try {
      const res = await fetch(`/api/instructor/classes/${params.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to delete class')
      }
      router.push('/instructor/classes')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete class')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading class...</p>
        </div>
      </div>
    )
  }

  if (error || !cls) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded">
          {error || 'Class not found'}
        </div>
        <Link href="/instructor/classes" className="inline-block mt-4 text-purple-600">← Back to classes</Link>
      </div>
    )
  }

const attendees = (cls.bookings || []).map((b: any) => b.user)

  const tab = (searchParams?.get('tab') || 'overview') as 'overview' | 'attendance'

  const [attn, setAttn] = useState<{ bookingId: string; user: any; status: 'present' | 'absent' | null }[] | null>(null)

  useEffect(() => {
    const loadAttendance = async () => {
      if (!instructorId || tab !== 'attendance') return
      try {
        const res = await fetch(`/api/instructor/classes/${params.id}/attendance?instructorId=${instructorId}`)
        if (res.ok) {
          const data = await res.json()
          setAttn(data.attendees)
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadAttendance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructorId, tab, params.id])

  const toggleAttn = (bookingId: string, next: 'present' | 'absent' | null) => {
    if (!attn) return
    setAttn(attn.map((a) => (a.bookingId === bookingId ? { ...a, status: next } : a)))
  }

  const saveAttn = async () => {
    if (!instructorId || !attn) return
    const records = attn
      .filter((a) => a.status !== null)
      .map((a) => ({ bookingId: a.bookingId, status: a.status as 'present' | 'absent' }))
    if (!records.length) return
    setBusy(true)
    try {
      const res = await fetch(`/api/instructor/classes/${params.id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId, records }),
      })
      if (!res.ok) throw new Error('Failed to save attendance')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save attendance')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{cls.title}</h1>
          <p className="text-gray-600 mt-1">{cls.level} • {cls.scheduleTime || 'TBD'}{cls.venue ? ` • ${cls.venue.name}${cls.venue.city ? ', ' + cls.venue.city : ''}` : ''}</p>
        </div>
        <div className="space-x-2">
          <button disabled={busy} onClick={() => togglePublish(!cls.isActive)} className={`px-3 py-2 rounded ${cls.isActive ? 'bg-gray-100 text-gray-800' : 'bg-green-600 text-white'}`}>{cls.isActive ? 'Unpublish' : 'Publish'}</button>
<button disabled={busy} onClick={() => router.push(`/instructor/classes/${params.id}/edit`)} className="px-3 py-2 rounded bg-indigo-600 text-white">Edit</button>
          <button disabled={busy} onClick={duplicate} className="px-3 py-2 rounded bg-blue-600 text-white">Duplicate</button>
          <button disabled={busy} onClick={remove} className="px-3 py-2 rounded bg-red-600 text-white">Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {tab === 'overview' && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Level</div>
                <div className="text-gray-900">{cls.level}</div>
              </div>
              <div>
                <div className="text-gray-500">Duration</div>
                <div className="text-gray-900">{cls.durationMins || 0} mins</div>
              </div>
              <div>
                <div className="text-gray-500">Capacity</div>
                <div className="text-gray-900">{cls.maxCapacity || 0}</div>
              </div>
              <div>
                <div className="text-gray-500">Price</div>
                <div className="text-gray-900">${Number(cls.price || 0).toFixed(2)}</div>
              </div>
            </div>
            {cls.description && (
              <div className="mt-4">
                <div className="text-gray-500 text-sm mb-1">Description</div>
                <div className="text-gray-800 whitespace-pre-wrap">{cls.description}</div>
              </div>
            )}
          </div>
          )}

          {tab === 'attendance' && (
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Attendance</h2>
                <button disabled={busy} onClick={saveAttn} className="px-3 py-2 rounded bg-purple-600 text-white disabled:opacity-50">Save</button>
              </div>
              {!attn ? (
                <div className="text-sm text-gray-600">Loading attendees...</div>
              ) : attn.length ? (
                <ul className="divide-y">
                  {attn.map((a) => (
                    <li key={a.bookingId} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{a.user.fullName}</div>
                        <div className="text-xs text-gray-500">{a.user.email}</div>
                      </div>
                      <div className="space-x-2 text-sm">
                        <button onClick={() => toggleAttn(a.bookingId, 'present')} className={`px-2 py-1 rounded ${a.status === 'present' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Present</button>
                        <button onClick={() => toggleAttn(a.bookingId, 'absent')} className={`px-2 py-1 rounded ${a.status === 'absent' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Absent</button>
                        <button onClick={() => toggleAttn(a.bookingId, null)} className={`px-2 py-1 rounded ${a.status === null ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>Clear</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-600">No confirmed attendees yet.</div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href={`/instructor/classes/${params.id}`} className={`mr-2 ${tab === 'overview' ? 'text-purple-700 font-medium' : 'text-purple-600'}`}>Overview</Link>
              <Link href={`/instructor/classes/${params.id}?tab=attendance`} className={`${tab === 'attendance' ? 'text-purple-700 font-medium' : 'text-purple-600'}`}>Attendance</Link>
              <div className="text-gray-500">Messaging and rescheduling coming soon.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}