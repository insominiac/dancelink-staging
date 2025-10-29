"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'

interface AcademyDetail {
  id: string
  name: string
  description?: string | null
  website?: string | null
  city?: string | null
  country?: string | null
  logoUrl?: string | null
  hostId: string
}

interface VenueItem { id: string; name: string; city?: string; state?: string; country?: string }
interface ClassItem { id: string; title: string; level: string; price: string; startDate?: string | null }
interface EventItem { id: string; title: string; eventType: string; startDate: string; endDate: string; price: string }

export default function AcademyDetailPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [academy, setAcademy] = useState<AcademyDetail | null>(null)
  const [venues, setVenues] = useState<VenueItem[]>([])
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [events, setEvents] = useState<EventItem[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/public/academies/${params.id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load academy')
        setAcademy(data.academy)
        setVenues(data.venues || [])
        setClasses(data.classes || [])
        setEvents(data.events || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load academy')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderBottomColor: 'var(--primary-gold)'}}></div>
          <p className="text-gray-600 mt-4">{t('ui.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !academy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🫤</div>
          <h1 className="text-2xl font-bold mb-2" style={{color: 'var(--primary-dark)'}}>Academy Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This academy is unavailable.'}</p>
          <Link href="/academies" className="dance-btn dance-btn-primary">Back to Academies</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{background: 'var(--neutral-light)'}}>
      {/* Hero */}
      <section className="relative py-16 md:py-20 overflow-hidden mt-20" style={{
        background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))'
      }}>
        <div className="dance-container relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-5">
                <span className="mr-2">🏫</span>
                <span className="text-sm font-medium">Academy</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 dance-font text-white">{academy.name}</h1>
              <p className="text-white/90">{[academy.city, academy.country].filter(Boolean).join(', ')}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/classes" className="px-6 py-3 bg-white text-gray-800 rounded-full font-semibold hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300">Browse Classes</Link>
              <Link href="/events" className="px-6 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-gray-800 hover:transform hover:scale-105 hover:shadow-xl transition-all duration-300">View Events</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="dance-container py-12">
        {/* About */}
        {(academy.description || academy.website) && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3" style={{color: 'var(--primary-dark)'}}>About</h2>
            {academy.description && (
              <p className="text-gray-700 mb-3">{academy.description}</p>
            )}
            {academy.website && (
              <a href={academy.website} target="_blank" rel="noreferrer" className="text-purple-600 hover:underline">{academy.website}</a>
            )}
          </div>
        )}

        {/* Venues */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{color: 'var(--primary-dark)'}}>Venues</h2>
          </div>
          {venues.length === 0 ? (
            <p className="text-gray-600">No venues to display.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venues.map(v => (
                <div key={v.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-lg font-medium">{v.name}</div>
                  <div className="text-sm text-gray-600">{[v.city, v.state, v.country].filter(Boolean).join(', ')}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Classes */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{color: 'var(--primary-dark)'}}>Featured Classes</h2>
            <Link href="/classes" className="text-sm text-purple-600 hover:underline">View all classes</Link>
          </div>
          {classes.length === 0 ? (
            <p className="text-gray-600">No classes to display.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map(c => (
                <div key={c.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-gray-600">{c.level}</div>
                  <div className="text-sm text-gray-800 mt-1">${c.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Events */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{color: 'var(--primary-dark)'}}>Featured Events</h2>
            <Link href="/events" className="text-sm text-purple-600 hover:underline">View all events</Link>
          </div>
          {events.length === 0 ? (
            <p className="text-gray-600">No events to display.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(e => (
                <div key={e.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="font-medium">{e.title}</div>
                  <div className="text-sm text-gray-600">{e.eventType}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
