"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"

interface VenueOption { id: string; name: string }

interface FormState {
  title: string
  description: string
  level: string
  durationMins: string
  maxCapacity: string
  price: string
  venueId?: string
  scheduleDays?: string
  scheduleTime?: string
  startDate?: string
  endDate?: string
}

export default function NewClassPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [venues, setVenues] = useState<VenueOption[]>([])
  const [loadingVenues, setLoadingVenues] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    level: "Beginner",
    durationMins: "60",
    maxCapacity: "20",
    price: "25",
    venueId: "",
    scheduleDays: "",
    scheduleTime: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    if (!loading && user && user.role !== "HOST" && user.role !== "ADMIN") {
      router.replace("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoadingVenues(true)
        const res = await fetch("/api/host/venues")
        if (res.ok) {
          const data = await res.json()
          setVenues((data.venues || []).map((v: any) => ({ id: v.id, name: v.name })))
        }
      } catch (e) {
        // ignore
      } finally {
        setLoadingVenues(false)
      }
    }
    loadVenues()
  }, [])

  const update = (k: keyof FormState, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)
    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        level: form.level,
        durationMins: parseInt(form.durationMins || "0", 10),
        maxCapacity: parseInt(form.maxCapacity || "0", 10),
        price: form.price, // send as string for Decimal
      }
      if (form.venueId) payload.venueId = form.venueId
      if (form.scheduleDays) payload.scheduleDays = form.scheduleDays
      if (form.scheduleTime) payload.scheduleTime = form.scheduleTime
      if (form.startDate) payload.startDate = form.startDate
      if (form.endDate) payload.endDate = form.endDate

      const res = await fetch("/api/host/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create class")
      }
      setSuccess("Class created successfully!")
      setTimeout(() => router.push("/host"), 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create class")
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
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Class</h1>
          <p className="text-sm text-gray-600 mt-1">Set up a new dance class (will be submitted for admin approval)</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => update("title", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Salsa Beginners"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <input
                type="text"
                required
                value={form.level}
                onChange={e => update("level", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Beginner / Intermediate / Advanced"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              value={form.description}
              onChange={e => update("description", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Describe what students will learn"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (mins)</label>
              <input
                type="number"
                min={1}
                required
                value={form.durationMins}
                onChange={e => update("durationMins", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
              <input
                type="number"
                min={1}
                required
                value={form.maxCapacity}
                onChange={e => update("maxCapacity", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                required
                value={form.price}
                onChange={e => update("price", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Venue (optional)</label>
              <select
                value={form.venueId}
                onChange={e => update("venueId", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">No venue yet</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              {loadingVenues && <p className="text-xs text-gray-500 mt-1">Loading venues…</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Schedule (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={form.scheduleDays}
                  onChange={e => update("scheduleDays", e.target.value)}
                  placeholder="Days (e.g., Tue, Thu)"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={form.scheduleTime}
                  onChange={e => update("scheduleTime", e.target.value)}
                  placeholder="Time (e.g., 7:00 PM)"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date (optional)</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => update("startDate", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date (optional)</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => update("endDate", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create Class"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/host")}
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
