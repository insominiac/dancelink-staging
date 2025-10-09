'use client'

import { useEffect, useState } from 'react'
import { useAuth, useRequireInstructor } from '@/app/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function EditClassPage({ params }: { params: { id: string } }) {
  useRequireInstructor()
  const { user } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [instructorId, setInstructorId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: '',
    durationMins: 60,
    maxCapacity: 20,
    price: 0,
    scheduleTime: '',
    startDate: '' as string,
  })
  const [submitting, setSubmitting] = useState(false)

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

        const res = await fetch(`/api/instructor/classes/${params.id}?instructorId=${iid}`)
        if (!res.ok) throw new Error('Failed to load class')
        const data = await res.json()
        const c = data.class
        setForm({
          title: c.title || '',
          description: c.description || '',
          level: c.level || '',
          durationMins: c.durationMins || 60,
          maxCapacity: c.maxCapacity || 20,
          price: Number(c.price || 0),
          scheduleTime: c.scheduleTime || '',
          startDate: c.startDate ? new Date(c.startDate).toISOString().slice(0, 16) : '',
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load class')
      } finally {
        setLoading(false)
      }
    })()
  }, [user, params.id])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({
      ...f,
      [name]: name === 'durationMins' || name === 'maxCapacity' || name === 'price' ? Number(value) : value,
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!instructorId) return
    setSubmitting(true)
    setError(null)
    try {
      const payload: any = {
        instructorId,
        title: form.title,
        description: form.description,
        level: form.level,
        durationMins: Number(form.durationMins),
        maxCapacity: Number(form.maxCapacity),
        price: Number(form.price),
        scheduleTime: form.scheduleTime || null,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      }

      const res = await fetch(`/api/instructor/classes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to update class')
      }
      router.push(`/instructor/classes/${params.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update class')
    } finally {
      setSubmitting(false)
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

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 text-red-800 border border-red-200 p-4 rounded">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Class</h1>

      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input name="title" value={form.title} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={form.description} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" rows={4} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input name="level" value={form.level} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (mins)</label>
            <input type="number" name="durationMins" value={form.durationMins} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input type="number" name="maxCapacity" value={form.maxCapacity} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" step="0.01" name="price" value={form.price} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time (e.g., 18:00)</label>
            <input name="scheduleTime" value={form.scheduleTime} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="datetime-local" name="startDate" value={form.startDate} onChange={onChange} className="mt-1 block w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="pt-4">
          <button disabled={submitting} type="submit" className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}