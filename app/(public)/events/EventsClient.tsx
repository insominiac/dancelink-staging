"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import TranslatedText, { useAutoTranslate } from '../../components/TranslatedText'
import '@/lib/i18n'
import { formatDateRangeSafe, isEmptyDate } from '@/app/lib/date'
import { apiUrl } from '@/app/lib/api'

interface Event {
  id: string
  title: string
  description: string
  eventType: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  price: string
  maxAttendees: number
  currentAttendees: number
  status: string
  isFeatured: boolean
  venue?: { name: string; city: string }
  eventStyles?: any[]
  imageUrl?: string
}

interface EventsPageContent {
  heroTitle: string
  heroSubtitle: string
  
  // Featured Events
  featuredTitle: string
  featuredDescription: string
  
  // Search
  searchTitle: string
  searchDescription: string
  
  // No Events
  noEventsTitle?: string
  noEventsDescription?: string
}

export default function EventsClient({
  initialEvents,
  initialFeaturedEvents,
  initialPageContent,
  initialLang,
}: {
  initialEvents: Event[]
  initialFeaturedEvents: Event[]
  initialPageContent: EventsPageContent | null
  initialLang: string
}) {
  const { t, i18n } = useTranslation('common')
  const [isMounted, setIsMounted] = useState(false)
  const [events, setEvents] = useState<Event[]>(initialEvents || [])
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>(initialFeaturedEvents || [])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(initialEvents || [])
  const [pageContent, setPageContent] = useState<EventsPageContent | null>(initialPageContent)
  const [isLoading, setIsLoading] = useState(!initialPageContent)
  const [filters, setFilters] = useState({ eventType: 'all', month: 'all', priceRange: 'all' })
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch events client-side if initialEvents is empty
  useEffect(() => {
    const fetchEventsIfNeeded = async () => {
      if (initialEvents.length === 0 && isMounted) {
        console.log('[Events Client] Initial events empty, fetching from client-side')
        try {
          // Fetch featured events
          const featuredRes = await fetch('/api/public/events?featuredOnly=true')
          if (featuredRes.ok) {
            const data = await featuredRes.json()
            const fetchedFeaturedEvents = data.events || []
            console.log('[Events Client] Fetched', fetchedFeaturedEvents.length, 'featured events client-side')
            setFeaturedEvents(fetchedFeaturedEvents)
          } else {
            console.warn('[Events Client] Failed to fetch featured events client-side:', featuredRes.status)
          }
          
          // Fetch all events
          const res = await fetch('/api/public/events')
          if (res.ok) {
            const data = await res.json()
            const fetchedEvents = data.events || []
            console.log('[Events Client] Fetched', fetchedEvents.length, 'events client-side')
            setEvents(fetchedEvents)
            setFilteredEvents(fetchedEvents)
          } else {
            console.warn('[Events Client] Failed to fetch events client-side:', res.status)
          }
        } catch (error) {
          console.error('[Events Client] Error fetching events client-side:', error)
          // Try direct fetch to external API as last resort
          try {
            // Fetch featured events
            const featuredRes = await fetch('https://dance-api-omega.vercel.app/api/public/events?featuredOnly=true')
            if (featuredRes.ok) {
              const data = await featuredRes.json()
              const fetchedFeaturedEvents = data.events || []
              console.log('[Events Client] Fetched', fetchedFeaturedEvents.length, 'featured events from external API')
              setFeaturedEvents(fetchedFeaturedEvents)
            }
            
            // Fetch all events
            const res = await fetch('https://dance-api-omega.vercel.app/api/public/events')
            if (res.ok) {
              const data = await res.json()
              const fetchedEvents = data.events || []
              console.log('[Events Client] Fetched', fetchedEvents.length, 'events from external API')
              setEvents(fetchedEvents)
              setFilteredEvents(fetchedEvents)
            }
          } catch (directError) {
            console.error('[Events Client] Direct fetch also failed:', directError)
          }
        }
      }
    }
    
    fetchEventsIfNeeded()
  }, [initialEvents, isMounted])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Ensure client i18n matches server-detected language
  useEffect(() => {
    if (initialLang && i18n.language !== initialLang) {
      i18n.changeLanguage(initialLang)
    }
  }, [initialLang, i18n])

  useEffect(() => {
    let filtered = [...events]
    if (searchTerm) {
      filtered = filtered.filter(e => (
        (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      ))
    }
    if (filters.eventType !== 'all') {
      filtered = filtered.filter(e => e.eventType === filters.eventType)
    }
    if (filters.month !== 'all') {
      filtered = filtered.filter(e => !isEmptyDate(e.startDate) && (new Date(e.startDate).getMonth()) === parseInt(filters.month))
    }
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(e => {
        const price = parseFloat(e.price)
        return price >= min && (max ? price <= max : true)
      })
    }
    setFilteredEvents(filtered)
  }, [events, filters, searchTerm])

  const getSpotsLeft = (event: Event) => event.maxAttendees - event.currentAttendees

  const formatEventDate = (startDate: string, endDate: string) => {
    return formatDateRangeSafe(startDate, endDate, 'en-US') || (isMounted ? 'TBD' : 'TBD')
  }

  if (isLoading || !pageContent) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderBottomColor: 'var(--primary-gold)'}}></div>
      </div>
    )
  }

  // Translate hero title client-side for languages without static resources
  const heroTitleTranslated = useAutoTranslate(pageContent?.heroTitle)
  const heroTitleParts = (heroTitleTranslated || '').trim().split(' ')
  const heroTitleLast = heroTitleParts.pop() || ''
  const heroTitleLeading = heroTitleParts.join(' ')

  return (
    <div className="min-h-screen" style={{background: 'var(--neutral-light)'}}>
      {/* Hero Section */}
      <section 
        className="relative py-16 md:py-20 overflow-hidden mt-20"
        style={{ background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))' }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 5 L35 15 L45 15 L37.5 22.5 L40 32.5 L30 25 L20 32.5 L22.5 22.5 L15 15 L25 15 Z" fill="%23ffffff" fill-opacity="0.3"/%3E%3C/svg%3E")',
          backgroundSize: '30px 30px'
        }} />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-10 text-2xl opacity-20 text-white animate-pulse">🎭</div>
          <div className="absolute top-12 right-10 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '1s'}}>🎆</div>
          <div className="absolute bottom-8 left-1/2 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '2s'}}>✨</div>
        </div>

        <div className="relative z-10 dance-container text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 dance-font text-white">
            {heroTitleLeading} <span className="text-yellow-100 dance-font">{heroTitleLast}</span>
          </h1>

          <p className="text-base md:text-lg text-white/90 mb-7 max-w-2xl mx-auto leading-relaxed">
            {pageContent.heroSubtitle ? <TranslatedText text={pageContent.heroSubtitle} /> : null}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="dance-container">
          {/* Featured Events Section */}
          {featuredEvents.length > 0 && (
            <>
              <div className="dance-section-header mb-12">
                <h2 className="dance-section-title">{pageContent.featuredTitle ? <TranslatedText text={pageContent.featuredTitle} /> : null}</h2>
                <p className="max-w-2xl mx-auto">{pageContent.featuredDescription ? <TranslatedText text={pageContent.featuredDescription} /> : null}</p>
              </div>
              <div className="dance-card-grid mb-16">
                {featuredEvents.map((event) => {
                  const spotsLeft = getSpotsLeft(event)
                  return (
                    <div key={event.id} className="dance-card group relative overflow-hidden transform hover:-translate-y-2 transition-all duration-500">
                      <div className="relative h-48 overflow-hidden" style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))'}}>
                        {event.imageUrl && (
                          <Image 
                            src={event.imageUrl} 
                            alt={event.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0" style={{background: 'rgba(26, 15, 31, 0.3)'}}></div>
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-bold text-white ${
                            event.eventType === 'Workshop' ? 'bg-blue-500' :
                            event.eventType === 'Competition' ? 'bg-red-500' :
                            event.eventType === 'Performance' ? 'bg-purple-500' :
                            event.eventType === 'Social Dance' ? 'bg-green-500' :
                            event.eventType === 'Gala' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}>
                            {event.eventType}
                          </span>
                        </div>
                        {event.isFeatured && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 text-xs font-bold rounded-full flex items-center text-white" style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))'}}>
                              <span className="mr-1">⭐</span> FEATURED
                            </span>
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <div className={`px-3 py-1 text-xs rounded-full font-bold text-white ${
                            spotsLeft <= 0 ? 'bg-red-500' :
                            spotsLeft <= 10 ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}>
                            {spotsLeft > 0 ? (isMounted ? t('events.spotsLeftCount', { count: spotsLeft }) : `${spotsLeft} spots left`) : (isMounted ? t('events.soldOut') : 'Sold Out')}
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                            {event.title}
                          </h3>
                          <p style={{color: 'var(--neutral-light)'}} className="text-sm font-medium uppercase tracking-wide">
                            {formatEventDate(event.startDate, event.endDate)}
                          </p>
                        </div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-6">
                        <p style={{color: 'var(--neutral-gray)'}} className="mb-6 leading-relaxed line-clamp-2">
                          {event.description}
                        </p>
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center" style={{color: 'var(--primary-dark)'}}>
                            <span className="mr-3 text-lg">⏱️</span>
                            <span className="font-medium">{event.startTime} - {event.endTime}</span>
                          </div>
                          <div className="flex items-center" style={{color: 'var(--primary-dark)'}}>
                            <span className="mr-3 text-lg">📍</span>
                            <span className="font-medium">{event.venue?.name || (isMounted ? t('classes.tbd') : 'TBD')}</span>
                          </div>
                          <div className="flex items-center" style={{color: 'var(--primary-dark)'}}>
                            <span className="mr-3 text-lg">👥</span>
                            <span className="font-medium">
                              {spotsLeft > 0 
                                ? (isMounted ? t('classes.schedule.spotsLeftCount', { count: spotsLeft }) : `${spotsLeft} spots left`)
                                : (isMounted ? t('classes.schedule.soldOut') : 'Sold out')
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div>
                            <span className="text-3xl font-bold" style={{color: 'var(--primary-dark)'}}>${event.price}</span>
                            <span className="text-sm ml-1" style={{color: 'var(--neutral-gray)'}}>/person</span>
                          </div>
                          <Link href={`/events/${event.id}`} className="dance-btn dance-btn-accent hover:transform hover:scale-105 transition-all duration-300 px-4 py-2 text-sm">
                            {isMounted ? t('ui.viewDetails') : 'View Details'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Search Section Header */}
          <div className="dance-section-header mb-12">
            <h2 className="dance-section-title">{pageContent.searchTitle ? <TranslatedText text={pageContent.searchTitle} /> : null}</h2>
            <p className="max-w-2xl mx-auto">{pageContent.searchDescription ? <TranslatedText text={pageContent.searchDescription} /> : null}</p>
          </div>

          {/* Search and Filters */}
          <div className="dance-search-container mb-12">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={isMounted ? t('events.searchPlaceholder') : '🔍 Search events by name or description...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dance-search-input"
                />
              </div>
              <button onClick={() => {}} className="dance-btn dance-btn-accent hover:transform hover:scale-105 transition-all duration-300 px-4 py-2 text-sm">
                {isMounted ? t('events.searchEvents') : 'Search Events'}
              </button>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <select value={filters.eventType} onChange={(e) => setFilters({...filters, eventType: e.target.value})} className="dance-filter-select">
                <option value="all">{isMounted ? t('events.filters.all') : 'All Types'}</option>
                <option value="Workshop">{isMounted ? t('events.types.workshop') : 'Workshop'}</option>
                <option value="Competition">{isMounted ? t('events.types.competition') : 'Competition'}</option>
                <option value="Performance">{isMounted ? t('events.types.performance') : 'Performance'}</option>
                <option value="Social Dance">{isMounted ? t('events.types.socialDance') : 'Social Dance'}</option>
                <option value="Gala">{isMounted ? t('events.types.gala') : 'Gala'}</option>
                <option value="Kids Event">{isMounted ? t('events.types.kidsEvent') : 'Kids Event'}</option>
              </select>
              <select value={filters.priceRange} onChange={(e) => setFilters({...filters, priceRange: e.target.value})} className="dance-filter-select">
                <option value="all">{isMounted ? t('events.priceRanges.anyPrice') : 'Any Price'}</option>
                <option value="0-25">{isMounted ? t('events.priceRanges.under25') : 'Under $25'}</option>
                <option value="25-50">{isMounted ? t('events.priceRanges.from25to50') : '$25 - $50'}</option>
                <option value="50-100">{isMounted ? t('events.priceRanges.from50to100') : '$50 - $100'}</option>
                <option value="100-9999">{isMounted ? t('events.priceRanges.over100') : 'Over $100'}</option>
              </select>
              <button onClick={() => { setFilters({ eventType: 'all', month: 'all', priceRange: 'all' }); setSearchTerm('') }} className="dance-btn dance-btn-secondary hover:transform hover:scale-105 transition-all duration-300 px-4 py-2 text-sm">
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8 text-center">
            <p className="text-lg" style={{color: 'var(--neutral-gray)'}}>
              <span className="font-semibold" style={{color: 'var(--primary-gold)'}}>{filteredEvents.length}</span> events found
            </p>
          </div>

          {/* All Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="dance-card-grid mb-16">
              {filteredEvents.map((event) => {
                const spotsLeft = getSpotsLeft(event)
                return (
                  <div key={event.id} className="dance-card group relative overflow-hidden transform hover:-translate-y-2 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden" style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))'}}>
                      {event.imageUrl && (
                        <Image 
                          src={event.imageUrl} 
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0" style={{background: 'rgba(26, 15, 31, 0.3)'}}></div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-bold text-white ${
                          event.eventType === 'Workshop' ? 'bg-blue-500' :
                          event.eventType === 'Competition' ? 'bg-red-500' :
                          event.eventType === 'Performance' ? 'bg-purple-500' :
                          event.eventType === 'Social Dance' ? 'bg-green-500' :
                          event.eventType === 'Gala' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}>
                          {event.eventType}
                        </span>
                      </div>
                      {event.isFeatured && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 text-xs font-bold rounded-full flex items-center text-white" style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))'}}>
                            <span className="mr-1">⭐</span> FEATURED
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <div className={`px-3 py-1 text-xs rounded-full font-bold text-white ${
                          spotsLeft <= 0 ? 'bg-red-500' :
                          spotsLeft <= 10 ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}>
                          {spotsLeft > 0 ? (isMounted ? t('events.spotsLeftCount', { count: spotsLeft }) : `${spotsLeft} spots left`) : (isMounted ? t('events.soldOut') : 'Sold Out')}
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                          {event.title}
                        </h3>
                        <p style={{color: 'var(--neutral-light)'}} className="text-sm font-medium uppercase tracking-wide">
                          {formatEventDate(event.startDate, event.endDate)}
                        </p>
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <p style={{color: 'var(--neutral-gray)'}} className="mb-6 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center" style={{color: 'var(--primary-dark)'}}>
                          <span className="mr-3 text-lg">⏱️</span>
                          <span className="font-medium">{event.startTime} - {event.endTime}</span>
                        </div>
                        <div className="flex items-center" style={{color: 'var(--primary-dark)'}}>
                          <span className="mr-3 text-lg">📍</span>
                          <span className="font-medium">{event.venue?.name || (isMounted ? t('classes.tbd') : 'TBD')}</span>
                        </div>
                        <div className="flex items-center" style={{color: 'var(--primary-dark)'}}>
                          <span className="mr-3 text-lg">👥</span>
                          <span className="font-medium">
                            {spotsLeft > 0 
                              ? (isMounted ? t('classes.schedule.spotsLeftCount', { count: spotsLeft }) : `${spotsLeft} spots left`)
                              : (isMounted ? t('classes.schedule.soldOut') : 'Sold out')
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div>
                          <span className="text-3xl font-bold" style={{color: 'var(--primary-dark)'}}>${event.price}</span>
                          <span className="text-sm ml-1" style={{color: 'var(--neutral-gray)'}}>/person</span>
                        </div>
                        <Link href={`/events/${event.id}`} className="dance-btn dance-btn-accent hover:transform hover:scale-105 transition-all duration-300 px-4 py-2 text-sm">
                          {isMounted ? t('ui.viewDetails') : 'View Details'}
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🎭</div>
              <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>{pageContent.noEventsTitle ? <TranslatedText text={pageContent.noEventsTitle} /> : null}</h3>
              <p className="max-w-md mx-auto" style={{color: 'var(--neutral-gray)'}}>{pageContent.noEventsDescription ? <TranslatedText text={pageContent.noEventsDescription} /> : null}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
