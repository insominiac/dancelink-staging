'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/lib/auth-context'

interface FormState {
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  country: string
  postalCode: string
  phone?: string
  websiteUrl?: string
}

export default function NewVenuePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    websiteUrl: ''
  })

  useEffect(() => {
    if (!loading && user && user.role !== 'HOST' && user.role !== 'ADMIN') {
      router.replace('/')
    }
  }, [user, loading, router])

  const update = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/host/venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to create venue')
      }

      setSuccess('Venue created successfully!')
      // Redirect to host dashboard or venues listing if added later
      setTimeout(() => router.push('/host'), 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create venue')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Venue</h1>
          <p className="text-sm text-gray-600 mt-1">Add a new location for your classes and events</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Venue Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => update('name', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Demo Dance Academy - Main Studio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
            <input
              type="text"
              required
              value={form.addressLine1}
              onChange={e => update('addressLine1', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address Line 2 (optional)</label>
            <input
              type="text"
              value={form.addressLine2 || ''}
              onChange={e => update('addressLine2', e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Suite / Floor"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={e => update('city', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State / Region</label>
              <input
                type="text"
                required
                value={form.state}
                onChange={e => update('state', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                required
                value={form.country}
                onChange={e => update('country', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                required
                value={form.postalCode}
                onChange={e => update('postalCode', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
              <input
                type="text"
                value={form.phone || ''}
                onChange={e => update('phone', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website (optional)</label>
              <input
                type="url"
                value={form.websiteUrl || ''}
                onChange={e => update('websiteUrl', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create Venue'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/host')}
              className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
