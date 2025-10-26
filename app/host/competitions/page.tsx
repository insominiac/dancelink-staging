"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/lib/auth-context"

interface CompetitionRequest {
  id: string
  name: string
  startDate: string
  endDate: string
  venueName?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt?: string
}

export default function HostCompetitionsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<CompetitionRequest[]>([])
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
        const res = await fetch('/api/host/competitions')
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load competition requests')
        setRequests(data.requests || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load competition requests')
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
          <p className="text-gray-600">Loading competition requests…</p>
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
          <button onClick={() => router.refresh()} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Competition Requests</h1>
            <p className="text-sm text-gray-600 mt-1">Organize competitions subject to admin approval</p>
          </div>
          <button onClick={() => router.push('/host/competitions/new')} className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Request Competition</button>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You have no competition requests yet.</p>
            <button onClick={() => router.push('/host/competitions/new')} className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700">Create your first request</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map(r => (
              <div key={r.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{r.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}</p>
                    {r.venueName && <p className="text-sm text-gray-600">Venue: {r.venueName}</p>}
                    {r.createdAt && <p className="text-xs text-gray-500 mt-1">Requested {new Date(r.createdAt).toLocaleDateString()}</p>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'APPROVED' ? 'bg-green-100 text-green-700' : r.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
