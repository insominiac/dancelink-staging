'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'
import DanceStylesTabs from '../components/DanceStylesTabs'
import TranslatedText from '../components/TranslatedText'
import '../styles/homepage-grid.css'
import { apiUrl } from '@/app/lib/api'

interface Stats {
  students: number
  instructors: number
  classes: number
  events: number
  venues: number
  danceStyles: number
  totalBookings: number
}

interface FeaturedClass {
  id: string
  title: string
  description: string
  level: string
  price: string
  currentStudents: number
  spotsLeft: number
  classStyles: Array<{
    style: {
      name: string
      category: string
    }
  }>
  venue?: {
    name: string
    city: string
  }
}

interface PopularStyle {
  id: string
  name: string
  category: string
  _count: {
    classStyles: number
    eventStyles: number
  }
}

interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  price: number
  maxAttendees: number
  currentAttendees: number
  venue: {
    id: string
    name: string
    city: string
  } | null
  eventStyles: Array<{
    style: {
      id: string
      name: string
      category: string
    }
  }>
  isFeatured: boolean
}

interface HomepageContent {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  heroBackgroundImage: string | null
  aboutTitle: string
  aboutDescription: string
  testimonialsEnabled: boolean
  newsletterEnabled: boolean
}

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  phoneNumber: string
  address: string
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
  }
}

interface DanceStyle {
  id: string
  name: string
  category: string
  classCount: number
  eventCount: number
  studentCount: number
  totalCount: number
  icon: string
  subtitle: string
  description: string
  difficulty: string
  origin: string
  musicStyle: string
  characteristics: string[]
}

export default function HomePage() {
  const { t } = useTranslation('common')
  const [isMounted, setIsMounted] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [featuredClasses, setFeaturedClasses] = useState<FeaturedClass[]>([])
  const [popularStyles, setPopularStyles] = useState<PopularStyle[]>([])
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null)
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null)
  const [danceStyles, setDanceStyles] = useState<DanceStyle[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, featuredRes, homepageRes, settingsRes, danceStylesRes, eventsRes] = await Promise.all([
          fetch(apiUrl('public/stats'), { cache: 'no-store' }),
          fetch(apiUrl('public/featured'), { cache: 'no-store' }),
          fetch(apiUrl('public/content/homepage'), { cache: 'no-store' }),
          fetch(apiUrl('public/content/settings'), { cache: 'no-store' }),
          fetch(apiUrl('public/dance-styles'), { cache: 'no-store' }),
          fetch(apiUrl('public/events'), { cache: 'no-store' })
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData.stats)
        }

        if (featuredRes.ok) {
          const featuredData = await featuredRes.json()
          setFeaturedClasses(featuredData.featuredClasses.slice(0, 3))
          setPopularStyles(featuredData.popularStyles.slice(0, 3))
        }

        if (homepageRes.ok) {
          const homepageData = await homepageRes.json()
          setHomepageContent(homepageData)
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setSiteSettings(settingsData)
        }

        if (danceStylesRes.ok) {
          const danceStylesData = await danceStylesRes.json()
          if (danceStylesData.success && danceStylesData.data?.styles) {
            setDanceStyles(danceStylesData.data.styles)
          }
        } else {
          console.error('Dance styles API failed:', danceStylesRes.status)
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          setEvents(eventsData.events?.slice(0, 3) || []) // Get first 3 events
        } else {
          console.error('Events API failed:', eventsRes.status)
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStyleImage = (styleName: string) => {
    const images: { [key: string]: string } = {
      'Salsa': 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=400&auto=format&fit=crop',
      'Bachata': 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=400&auto=format&fit=crop',
      'Kizomba': 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=400&auto=format&fit=crop',
      'Hip Hop': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop',
      'Contemporary': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop',
      'Ballet': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?q=80&w=400&auto=format&fit=crop'
    }
    return images[styleName] || 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=400&auto=format&fit=crop'
  }

  const formatEventDate = (dateString: string) => {
    const eventDate = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
    
    const diffTime = eventDay.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} days`
    
    return eventDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: eventDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
  const heroBg = homepageContent?.heroBackgroundImage || null

  // Determine language and compute hero title fallback handling
  const { i18n } = useTranslation('common')
  const lang = (i18n.language || 'en').split('-')[0]
  const heroKeyText = isMounted ? t('hero.title') : 'Master the Art of Dance'
  const heroNeedsAuto = isMounted && lang !== 'en' && heroKeyText === 'Master the Art of Dance'

  // Static, realistic numbers for the Stats section
  const staticStats = {
    students: 23874,
    danceStyles: 48,
    instructors: 162,
    venues: 27,
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section 
        className="dance-hero relative overflow-hidden"
        style={{
          background: '#000'
        }}
      >
        {heroBg && (
          <Image
            src={heroBg}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            quality={85}
            style={{ objectFit: 'cover', zIndex: 0 }}
          />
        )}
        
        {isLoading ? (
          <div className="dance-hero-content relative z-20">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">💃</span>
                </div>
              </div>
              <p className="text-white text-lg font-medium animate-pulse">Loading content...</p>
            </div>
          </div>
        ) : (
          <div className="dance-hero-content relative z-20">
            <p className="dance-hero-subtitle">{homepageContent?.heroSubtitle ? <TranslatedText text={homepageContent.heroSubtitle} /> : null}</p>
            <h1 className="dance-hero-title dance-font">
              {homepageContent?.heroTitle ? <TranslatedText text={homepageContent.heroTitle} /> : null}
            </h1>
            <p className="dance-hero-description">
              {homepageContent?.heroSubtitle ? <TranslatedText text={homepageContent.heroSubtitle} /> : null}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center cta-group">
              <Link href="/classes" className="dance-btn dance-btn-primary w-full sm:w-auto text-center hover:transform hover:scale-105 transition-all duration-300">
                {homepageContent?.heroButtonText ? <TranslatedText text={homepageContent.heroButtonText} /> : null}
              </Link>
              <Link href="/contact" className="dance-btn dance-btn-secondary w-full sm:w-auto text-center hover:transform hover:scale-105 transition-all duration-300">
                {isMounted ? t('hero.bookFreeTrial') : null}
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="py-20" style={{background: 'var(--neutral-light)'}}>
        <div className="dance-container">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-600 border-t-transparent"></div>
                <span className="text-lg font-medium" style={{color: 'var(--primary-dark)'}}>Loading content...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="dance-section-header reveal active">
                <h2 className="dance-section-title">
                  {homepageContent?.aboutTitle ? <TranslatedText text={homepageContent.aboutTitle} /> : null}
                </h2>
                <p>
                  {homepageContent?.aboutDescription ? <TranslatedText text={homepageContent.aboutDescription} /> : null}
                </p>
              </div>
              <div className="dance-card-grid text-black">
                <div className="dance-card reveal active">
                  <div className="text-center">
                    <div className="text-5xl mb-4" style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>🎓</div>
                    <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--primary-dark)'}}>{isMounted ? t('about.expertInstructors') : 'Expert Instructors'}</h3>
                    <p className="text-black" style={{color: 'black'}}>{isMounted ? t('about.expertInstructorsDesc') : 'Learn from certified professionals with years of experience in their craft'}</p>
                  </div>
                </div>
                <div className="dance-card reveal active">
                  <div className="text-center">
                    <div className="text-5xl mb-4" style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>🏃</div>
                    <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--primary-dark)'}}>{isMounted ? t('about.allLevelsWelcome') : 'All Levels Welcome'}</h3>
                    <p className="text-black" style={{color: 'black'}}>{isMounted ? t('about.allLevelsWelcomeDesc') : 'From complete beginners to advanced dancers, we have the perfect class for you'}</p>
                  </div>
                </div>
                <div className="dance-card reveal active">
                  <div className="text-center">
                    <div className="text-5xl mb-4" style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>📍</div>
                    <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--primary-dark)'}}>{isMounted ? t('about.modernFacilities') : 'Modern Facilities'}</h3>
                    <p className="text-black" style={{color: 'black'}}>{isMounted ? t('about.modernFacilitiesDesc') : 'Dance in beautiful studios equipped with the latest sound systems and amenities'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Join as Host or Register Section */}
      <section className="py-20" style={{background: 'linear-gradient(135deg, var(--primary-gold) 0%, var(--accent-rose) 100%)', color: 'white', position: 'relative', overflow: 'hidden'}}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">💃</div>
          <div className="absolute top-20 right-20 text-5xl">🕺</div>
          <div className="absolute bottom-20 left-1/4 text-7xl">✨</div>
          <div className="absolute bottom-10 right-1/3 text-6xl">🎵</div>
        </div>
        
        <div className="dance-container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 dance-font" style={{color: 'white'}}>
              🌟 {isMounted ? t('join.title') : 'Join Our Community'}
            </h2>
            <p className="text-xl md:text-2xl mb-2" style={{color: 'white'}}>
              {isMounted ? t('join.subtitle') : 'Whether you want to teach or learn, we have a place for you!'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Become a Host Card */}
            <div className="bg-white rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))'}}>
              <div className="text-6xl mb-6">🎓</div>
              <h3 className="text-3xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                {isMounted ? t('join.becomeHost') : 'Become a Host'}
              </h3>
              <p className="text-lg mb-6" style={{color: 'var(--neutral-gray)'}}>
                {isMounted ? t('join.hostDescription') : 'Share your passion for dance! Teach classes, host events, and build your community.'}
              </p>
              <ul className="text-left mb-8 space-y-3" style={{color: 'var(--neutral-gray)'}}>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✨</span>
                  <span>{isMounted ? t('join.hostBenefit1') : 'Set your own schedule and rates'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💰</span>
                  <span>{isMounted ? t('join.hostBenefit2') : 'Earn money doing what you love'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🌍</span>
                  <span>{isMounted ? t('join.hostBenefit3') : 'Reach students worldwide'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">📊</span>
                  <span>{isMounted ? t('join.hostBenefit4') : 'Professional tools and support'}</span>
                </li>
              </ul>
              <Link href="/become-a-host" className="inline-block px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl" 
                    style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))', color: 'white'}}>
                🚀 {isMounted ? t('join.becomeHost') : 'Become A Host'}
              </Link>
            </div>

            {/* Join as Student Card */}
            <div className="bg-white rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))'}}>
              <div className="text-6xl mb-6">💃</div>
              <h3 className="text-3xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                {isMounted ? t('join.joinAsStudent') : 'Join as Student'}
              </h3>
              <p className="text-lg mb-6" style={{color: 'var(--neutral-gray)'}}>
                {isMounted ? t('join.studentDescription') : 'Start your dance journey today! Learn from expert instructors and connect with fellow dancers.'}
              </p>
              <ul className="text-left mb-8 space-y-3" style={{color: 'var(--neutral-gray)'}}>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🎯</span>
                  <span>{isMounted ? t('join.studentBenefit1') : 'Access to diverse dance styles'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">👥</span>
                  <span>{isMounted ? t('join.studentBenefit2') : 'Join a vibrant community'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">📅</span>
                  <span>{isMounted ? t('join.studentBenefit3') : 'Flexible class schedules'}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🎁</span>
                  <span>{isMounted ? t('join.studentBenefit4') : 'First class free trial'}</span>
                </li>
              </ul>
              <Link href="/register" className="inline-block px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl" 
                    style={{background: 'linear-gradient(135deg, var(--accent-rose), var(--primary-gold))', color: 'white'}}>
                🎉 {isMounted ? t('join.registerNow') : 'Register Now'}
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm opacity-75 mb-4">
              {isMounted ? t('join.trusted') : 'Trusted by thousands of dancers and instructors worldwide'}
            </p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-sm">{isMounted ? t('join.verifiedInstructors') : 'Verified Instructors'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-sm">{isMounted ? t('join.securePayments') : 'Secure Payments'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-sm">{isMounted ? t('join.support') : '24/7 Support'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dance Styles Section */}
      <DanceStylesTabs danceStyles={danceStyles} />

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="dance-container">
          <div className="dance-section-header">
            <h2 className="dance-section-title">
              🎉 {isMounted ? t('events.upcoming') : 'Upcoming Events'}
            </h2>
            <p>
              {isMounted ? t('events.description') : 'Join our vibrant dance community at these exciting upcoming events and workshops'}
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="dance-card-grid">
              {events.map((event) => {
                const eventDate = new Date(event.startDate)
                const eventEndDate = new Date(event.endDate)
                const spotsLeft = event.maxAttendees - event.currentAttendees
                const primaryStyle = event.eventStyles[0]?.style
                const styleFromList = primaryStyle
                  ? danceStyles.find(s => s.id === primaryStyle.id || s.name.toLowerCase() === primaryStyle.name.toLowerCase())
                  : null
                const styleImage = styleFromList?.icon || (primaryStyle ? getStyleImage(primaryStyle.name) : getStyleImage('Salsa'))
                
                return (
                  <Link key={event.id} href={`/events/${event.id}`} className="dance-class-card" style={{
                    background: `linear-gradient(rgba(26, 26, 46, 0.4), rgba(26, 26, 46, 0.7)), url('${styleImage}') center/cover`
                  }}>
                    <div className="dance-class-content">
                      <h3 className="text-2xl font-semibold mb-2"><TranslatedText text={event.title} /></h3>
                      <p className="text-sm uppercase tracking-wide" style={{color: 'var(--primary-gold)'}}>
                        {formatEventDate(event.startDate)}
                        {event.venue && ` • ${event.venue.name}`}
                      </p>
                      <p className="mt-3 opacity-0 class-description text-white"><TranslatedText text={event.description} /></p>
                      <div className="mt-4 flex justify-between items-center opacity-0 class-details">
                        <span className="text-lg font-bold">
                          {event.price > 0 ? `$${event.price}` : (isMounted ? t('events.free') : 'Free')}
                        </span>
                        <span className="text-sm">
                          {isMounted 
                            ? (spotsLeft > 0 
                                ? t('events.spotsLeftCount', { count: spotsLeft }) 
                                : t('events.soldOut'))
                            : (spotsLeft > 0 ? `${spotsLeft} spots left` : 'Sold out')}
                        </span>
                      </div>
                      {event.isFeatured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ {isMounted ? t('events.featured') : 'Featured'}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🗓️</div>
              <h3 className="text-2xl font-semibold mb-4" style={{color: 'var(--primary-dark)'}}>
                {isMounted ? t('events.noUpcoming') : 'No Upcoming Events'}
              </h3>
              <p className="text-lg opacity-75 mb-8">
                {isMounted ? t('events.stayTuned') : "Stay tuned! We're planning some amazing dance events for you."}
              </p>
              <Link href="/contact" className="dance-btn dance-btn-primary">
                📧 {isMounted ? t('events.getNotified') : 'Get Notified'}
              </Link>
            </div>
          )}
          
          {events.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/events" className="dance-btn dance-btn-primary hover:transform hover:scale-105 transition-all duration-300">
                🎪 {isMounted ? t('events.viewAll') : 'View All Events'}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20" style={{background: 'var(--primary-dark)', color: 'white'}}>
        <div className="dance-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {isLoading ? (
              // Loading placeholder
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <div className="text-5xl font-bold mb-2 animate-pulse" style={{color: 'var(--primary-gold)'}}>---</div>
                  <div className="text-white opacity-80 animate-pulse">Loading...</div>
                </div>
              ))
            ) : (
              <>
                <div>
                  <div className="text-5xl font-bold mb-2 stats-number" style={{color: 'var(--primary-gold)'}}>
                    {staticStats.students.toLocaleString()}+
                  </div>
                  <div className="text-white opacity-80 stats-label">{t('stats.happyStudents')}</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2 stats-number" style={{color: 'var(--primary-gold)'}}>
                    {staticStats.danceStyles.toLocaleString()}+
                  </div>
                  <div className="text-white opacity-80 stats-label">{t('stats.danceStyles')}</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2 stats-number" style={{color: 'var(--primary-gold)'}}>
                    {staticStats.instructors.toLocaleString()}+
                  </div>
                  <div className="text-white opacity-80 stats-label">{t('stats.expertInstructors')}</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2 stats-number" style={{color: 'var(--primary-gold)'}}>
                    {staticStats.venues.toLocaleString()}
                  </div>
                  <div className="text-white opacity-80 stats-label">{t('stats.studioLocations')}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))', color: 'white'}}>
        <div className="dance-container text-center">
          <h2 className="text-4xl font-bold mb-4 dance-font">🌟 {isMounted ? t('cta.title') : ''}</h2>
          <p className="text-xl mb-8 opacity-90">
            {isMounted ? t('cta.description') : ''}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Link href="/contact" className="px-8 py-4 bg-white rounded-full font-bold text-lg hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300" 
                  style={{color: 'var(--primary-dark)'}}>
              🎁 {isMounted ? t('cta.startFreeTrial') : ''}
            </Link>
            <Link href="/classes" className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-gray-800 hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300">
              {isMounted ? t('cta.browseClasses') : ''}
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-80">
            {isMounted ? t('cta.benefits') : ''}
          </p>
        </div>
      </section>
    </div>
  )
}
