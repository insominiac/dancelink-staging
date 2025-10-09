"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"

interface HostEvent {
  id: string
  title: string
  description?: string
  eventType: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  price: string
  maxAttendees: number
  status: string
  imageUrl?: string | null
}

export default function HostEventsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<HostEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user && user.role !== 'HOST' && user.role !== 'ADMIN') {
      router.replace('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/host/events')
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load events')
        }
        setEvents(data.events || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load events')
      } finally {
        setIsLoading(false)
      }
    }
    if (!loading && user) load()
  }, [loading, user])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading events…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Events</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your workshops and performances</p>
          </div>
          <button
            onClick={() => router.push('/host/events/new')}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            + New Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You haven’t created any events yet.</p>
            <button
              onClick={() => router.push('/host/events/new')}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Create your first event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(ev => (
              <div key={ev.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{ev.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{ev.eventType} • {ev.maxAttendees} max • ${ev.price}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(ev.startDate).toLocaleDateString()} {ev.startTime} – {new Date(ev.endDate).toLocaleDateString()} {ev.endTime}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${ev.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {ev.status}
                  </span>
                </div>
                {/* Placeholder for future actions */}
                <div className="mt-4 flex items-center gap-3">
                  {/* <button className="text-sm text-indigo-600 hover:underline">Edit</button> */}
                  {/* <button className="text-sm text-red-600 hover:underline">Delete</button> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
