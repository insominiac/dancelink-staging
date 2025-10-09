"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'

interface AcademySummary {
  id: string
  name: string
  city?: string | null
  country?: string | null
  logoUrl?: string | null
  createdAt?: string
}

export default function AcademiesListPage() {
  const { t } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(true)
  const [academies, setAcademies] = useState<AcademySummary[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/public/academies')
        const data = await res.json()
        if (res.ok) setAcademies(data.academies || [])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div style={{background: 'var(--neutral-light)'}}>
      <section className="relative py-16 md:py-20 overflow-hidden mt-20" style={{
        background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))'
      }}>
        <div className="dance-container text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-5">
            <span className="mr-2">🏫</span>
            <span className="text-sm font-medium">Academies</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 dance-font text-white">
            Discover Our Partner Academies
          </h1>
          <p className="text-base md:text-lg text-white/90 mb-2 max-w-2xl mx-auto">
            Explore verified academies hosting classes and events.
          </p>
        </div>
      </section>

      <div className="dance-container py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderBottomColor: 'var(--primary-gold)'}}></div>
          </div>
        ) : academies.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🗂️</div>
            <h3 className="text-2xl font-semibold mb-3" style={{color: 'var(--primary-dark)'}}>No Academies Found</h3>
            <p className="text-gray-600">Please check back later.</p>
          </div>
        ) : (
          <div className="dance-card-grid">
            {academies.map(a => (
              <Link key={a.id} href={`/academies/${a.id}`} className="dance-class-card bg-white" style={{ background: 'white' }}>
                <div className="dance-class-content text-gray-800">
                  <div className="text-2xl mb-2">🏫</div>
                  <h3 className="text-xl font-semibold mb-1">{a.name}</h3>
                  <p className="text-sm text-gray-600">{[a.city, a.country].filter(Boolean).join(', ')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
