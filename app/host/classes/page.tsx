"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"

interface ClassItem {
  id: string
  title: string
  description?: string
  level: string
  durationMins: number
  maxCapacity: number
  price: string
  status: string
  startDate?: string | null
  endDate?: string | null
}

export default function HostClassesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [classes, setClasses] = useState<ClassItem[]>([])
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
        const res = await fetch('/api/host/classes')
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load classes')
        }
        setClasses(data.classes || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load classes')
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
          <p className="text-gray-600">Loading classes…</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Your Classes</h1>
            <p className="text-sm text-gray-600 mt-1">Manage the classes you teach or host</p>
          </div>
          <button
            onClick={() => router.push('/host/classes/new')}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            + New Class
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You haven’t created any classes yet.</p>
            <button
              onClick={() => router.push('/host/classes/new')}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Create your first class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map(c => (
              <div key={c.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{c.level} • {c.durationMins} mins • {c.maxCapacity} spots</p>
                    <p className="text-sm text-gray-700 mt-1">${c.price}</p>
                    {c.startDate && (
                      <p className="text-xs text-gray-500 mt-1">Start: {new Date(c.startDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {c.status}
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
