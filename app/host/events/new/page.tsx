"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"

interface VenueOption { id: string; name: string }

interface FormState {
  title: string
  description: string
  eventType: string
  venueId: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  price: string
  maxAttendees: string
  imageUrl?: string
}

export default function NewEventPage() {
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
    eventType: "Workshop",
    venueId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    price: "20",
    maxAttendees: "50",
    imageUrl: "",
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
        eventType: form.eventType,
        venueId: form.venueId,
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: form.startTime,
        endTime: form.endTime,
        price: form.price, // Decimal string
        maxAttendees: parseInt(form.maxAttendees || "0", 10),
        imageUrl: form.imageUrl || undefined,
      }

      const res = await fetch("/api/host/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create event")
      }

      setSuccess("Event created successfully!")
      setTimeout(() => router.push("/host"), 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event")
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-sm text-gray-600 mt-1">Schedule a workshop or performance (will be submitted for admin approval)</p>
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
                placeholder="e.g., Salsa Social Night"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                type="text"
                required
                value={form.eventType}
                onChange={e => update("eventType", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Workshop / Social / Performance"
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
              placeholder="Tell attendees what to expect"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Venue</label>
            <select
              required
              value={form.venueId}
              onChange={e => update("venueId", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a venue</option>
              {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            {loadingVenues && <p className="text-xs text-gray-500 mt-1">Loading venues…</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={e => update("startDate", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                required
                value={form.endDate}
                onChange={e => update("endDate", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="text"
                required
                value={form.startTime}
                onChange={e => update("startTime", e.target.value)}
                placeholder="e.g., 7:00 PM"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="text"
                required
                value={form.endTime}
                onChange={e => update("endTime", e.target.value)}
                placeholder="e.g., 10:00 PM"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Attendees</label>
              <input
                type="number"
                min={1}
                required
                value={form.maxAttendees}
                onChange={e => update("maxAttendees", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
            <input
              type="url"
              value={form.imageUrl || ""}
              onChange={e => update("imageUrl", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://images.example.com/event.jpg"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create Event"}
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
