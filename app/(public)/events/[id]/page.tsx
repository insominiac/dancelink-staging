'use client'

import { useEffect, useState } from 'react'
import { formatDateRangeSafe } from '@/app/lib/date'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GuestBookingForm from '@/app/(public)/components/GuestBookingForm'
import SEOHead from '@/components/SEOHead'

interface EventDetail {
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
  venue?: {
    name: string
    addressLine1?: string
    addressLine2?: string
    city: string
    state?: string
  }
  eventStyles?: any[]
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  // const { user, isAuthenticated } = useAuth()
  const [eventData, setEventData] = useState<EventDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEventDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const fetchEventDetails = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/public/events/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setEventData(data.event)
      }
    } catch (err) {
      console.error('Error fetching event details:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (!eventData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Link href="/events" className="text-purple-600 hover:text-purple-700">
            ← Back to events
          </Link>
        </div>
      </div>
    )
  }

  const spotsLeft = eventData.maxAttendees - eventData.currentAttendees
  const missing: string[] = []
  if (!eventData.venue?.name) missing.push('venue')
  if (!eventData.startTime) missing.push('time')
  if (!eventData.price || isNaN(parseFloat(eventData.price)) || parseFloat(eventData.price) <= 0) missing.push('price')
  if (!eventData.maxAttendees || eventData.maxAttendees <= 0) missing.push('capacity')
  const bookable = missing.length === 0
  const isAvailable = spotsLeft > 0 && eventData.status === 'PUBLISHED' && bookable
  const disabledReason = !bookable ? `Booking unavailable: missing ${missing.join(', ')}. Please check back later.` : undefined

  const formatEventDate = (startDate: string, endDate: string) => {
    return formatDateRangeSafe(startDate, endDate, 'en-US') || 'TBD'
  }

  const handleMobileBookNow = () => {
    const el = document.getElementById('booking')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 96px)' }}>
      {/* SEO Head and JSON-LD for Event */}
      {eventData && (
        <>
          <SEOHead 
            path={`/events/${eventData.id}`}
            fallbackTitle={`${eventData.title} | Dance Event`}
            fallbackDescription={eventData.description?.slice(0, 160) || 'Join this dance event'}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: eventData.title,
              description: eventData.description,
              startDate: eventData.startDate,
              endDate: eventData.endDate,
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              eventStatus: (spotsLeft > 0) ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventCancelled',
              location: eventData.venue ? {
                '@type': 'Place',
                name: eventData.venue.name,
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: eventData.venue.addressLine1 || eventData.venue.addressLine2,
                  addressLocality: eventData.venue.city,
                  addressRegion: eventData.venue.state
                }
              } : undefined,
              offers: {
                '@type': 'Offer',
                price: parseFloat(eventData.price || '0') || undefined,
                priceCurrency: 'USD',
                availability: spotsLeft > 0 ? 'http://schema.org/InStock' : 'http://schema.org/SoldOut'
              },
              organizer: {
                '@type': 'Organization',
                name: 'DanceLink - Connect, Learn, Dance'
              }
            }) }}
          />
        </>
      )}
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/events" className="text-purple-600 hover:text-purple-700">
          ← Back to events
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{eventData.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  eventData.eventType === 'Workshop' ? 'bg-blue-100 text-blue-800' :
                  eventData.eventType === 'Competition' ? 'bg-red-100 text-red-800' :
                  eventData.eventType === 'Showcase' ? 'bg-purple-100 text-purple-800' :
                  eventData.eventType === 'Social' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {eventData.eventType}
                </span>
              </div>
              <p className="text-gray-600 text-lg">{eventData.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Dates</h3>
                <p className="text-gray-600">{formatEventDate(eventData.startDate, eventData.endDate)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Time</h3>
                <p className="text-gray-600">{eventData.startTime} - {eventData.endTime}</p>
              </div>
              {eventData.venue && (
                <div className="col-span-2 border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{eventData.venue.name}</p>
                    {(eventData.venue.addressLine1 || eventData.venue.addressLine2) && (
                      <p className="text-gray-600">{eventData.venue.addressLine1} {eventData.venue.addressLine2}</p>
                    )}
                    <p className="text-gray-600">{eventData.venue.city}{eventData.venue.state && `, ${eventData.venue.state}`}</p>
                  </div>
                </div>
              )}
            </div>

            {eventData.eventStyles && eventData.eventStyles.length > 0 && (
              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Dance Styles</h3>
                <div className="flex flex-wrap gap-2">
                  {eventData.eventStyles.map((es: any) => (
                    <span key={es.style.id} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {es.style.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this event</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start"><span className="text-purple-600 mr-2">✓</span> Hosted by experienced organizers</li>
              <li className="flex items-start"><span className="text-purple-600 mr-2">✓</span> Great networking opportunities</li>
              <li className="flex items-start"><span className="text-purple-600 mr-2">✓</span> All levels welcome</li>
              <li className="flex items-start"><span className="text-purple-600 mr-2">✓</span> Safe and supportive environment</li>
            </ul>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div id="booking" className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900">${eventData.price}</p>
              <p className="text-gray-600">/person</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available spots:</span>
                <span className={`font-semibold ${
                  spotsLeft > 5 ? 'text-green-600' : spotsLeft > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {spotsLeft > 0 ? `${spotsLeft} left` : 'Sold out'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-semibold">{eventData.maxAttendees} people</span>
              </div>
            </div>

            <GuestBookingForm
              item={{
                id: eventData.id,
                title: eventData.title,
                price: eventData.price,
                type: 'event',
                spotsLeft: spotsLeft,
                maxCapacity: eventData.maxAttendees
              }}
              isAvailable={isAvailable}
              disabledReason={disabledReason}
            />
          </div>
        </div>
      </div>
      {/* Mobile Sticky Booking Bar */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-4 py-3 shadow-lg" style={{ background: 'white', paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
            <div>
              <div className="text-sm text-gray-500">Price</div>
              <div className="text-xl font-bold text-gray-900">${eventData.price} <span className="text-sm text-gray-500">/person</span></div>
            </div>
            <button
              onClick={handleMobileBookNow}
              disabled={!isAvailable}
              className="px-5 py-3 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))' }}
            >
              {isAvailable ? 'Book Now' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
