"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from '@/app/lib/auth-context'
import Image from 'next/image'

interface Academy {
  id: string
  name: string
  city?: string
  country?: string
  status: string
  createdAt?: string
  logoUrl?: string | null
}

export default function HostAcademiesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [academies, setAcademies] = useState<Academy[]>([])
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
        const res = await fetch('/api/host/academies')
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load academies')
        }
        setAcademies(data.academies || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load academies')
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
          <p className="text-gray-600">Loading academies…</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Your Academies</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your dance academy profiles</p>
          </div>
          <button
            onClick={() => router.push('/host/academies/new')}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            + New Academy
          </button>
        </div>

        {academies.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You haven’t added any academies yet.</p>
            <button
              onClick={() => router.push('/host/academies/new')}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Create your first academy
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academies.map(a => (
              <div key={a.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-start gap-4">
{a.logoUrl ? (
                    <Image 
                      src={a.logoUrl} 
                      alt={a.name} 
                      width={56} 
                      height={56}
                      loading="lazy"
                      className="w-14 h-14 rounded object-cover" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded bg-gray-100 flex items-center justify-center text-2xl">🏫</div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{a.name}</h3>
                        {(a.city || a.country) && (
                          <p className="text-sm text-gray-600">{[a.city, a.country].filter(Boolean).join(', ')}</p>
                        )}
                        {a.createdAt && (
                          <p className="text-xs text-gray-500 mt-1">Created {new Date(a.createdAt).toLocaleDateString()}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${a.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  {/* Future actions: Edit/Delete */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
