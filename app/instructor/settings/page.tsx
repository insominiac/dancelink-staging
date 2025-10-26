'use client'

import { useEffect, useState } from 'react'
import { useAuth, useRequireInstructor } from '@/app/lib/auth-context'

export default function InstructorSettingsPage() {
  useRequireInstructor()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    bio: '',
    specialty: '',
    experienceYears: 0,
    websiteUrl: '',
    instagramHandle: '',
    profileImage: '',
    isActive: true,
  })

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/instructor/profile/${user.id}`)
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()
        setForm({
          fullName: data.user.fullName || '',
          phone: data.user.phone || '',
          bio: data.instructor.bio || '',
          specialty: (data.instructor.specialties && data.instructor.specialties[0]) || '',
          experienceYears: data.instructor.experience || 0,
          websiteUrl: data.user.websiteUrl || '',
          instagramHandle: data.user.instagramHandle || '',
          profileImage: data.user.profileImage || '',
          isActive: data.instructor.isActive,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : name === 'experienceYears' ? Number(value) : value }))
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/instructor/profile/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to save settings')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Instructor Settings</h1>
        <p className="text-gray-600">Manage your instructor profile and preferences</p>
      </div>

      {loading ? (
        <div className="bg-white rounded border p-6 text-center text-gray-600">Loading...</div>
      ) : (
        <form onSubmit={onSave} className="bg-white rounded-lg border p-6 space-y-5">
          {error && <div className="bg-red-50 text-red-800 border border-red-200 p-3 rounded">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Full Name</label>
              <input name="fullName" value={form.fullName} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Bio</label>
            <textarea name="bio" value={form.bio} onChange={onChange} rows={4} className="mt-1 w-full border rounded px-3 py-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Specialty</label>
              <input name="specialty" value={form.specialty} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Experience (years)</label>
              <input type="number" name="experienceYears" value={form.experienceYears} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
              <label className="text-sm text-gray-700">Active Instructor</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Website URL</label>
              <input name="websiteUrl" value={form.websiteUrl} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Instagram Handle</label>
              <input name="instagramHandle" value={form.instagramHandle} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Profile Image URL</label>
              <input name="profileImage" value={form.profileImage} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="pt-2">
            <button disabled={saving} type="submit" className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
