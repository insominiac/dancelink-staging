'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TranslatedText from '../../components/TranslatedText'
import { apiUrl } from '@/app/lib/api'
import '@/lib/i18n'

export default function AboutPage() {
  const { t } = useTranslation('common')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const [aboutContent, setAboutContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setIsMounted(true)
  }, [])


  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(apiUrl('public/content/about'), { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setAboutContent(data)
        }
      } catch (error) {
        console.error('Error fetching about content:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [])
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      // Here you would typically send the email to your backend
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  if (!aboutContent && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  if (!aboutContent && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">⚠️ Failed to load content</p>
          <p className="text-gray-600">Unable to fetch page content from database</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative py-16 md:py-20 overflow-hidden mt-20"
        style={{
          background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))'
        }}
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M30 5 L35 15 L45 15 L37.5 22.5 L40 32.5 L30 25 L20 32.5 L22.5 22.5 L15 15 L25 15 Z" fill="%23ffffff" fill-opacity="0.3"/%3E%3C/svg%3E")',
            backgroundSize: '30px 30px'
          }}
        ></div>
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-10 text-2xl opacity-20 text-white animate-pulse">✦</div>
          <div className="absolute top-12 right-10 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '1s'}}>✧</div>
          <div className="absolute bottom-8 left-1/2 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '2s'}}>✨</div>
        </div>
        
        <div className="relative z-10 dance-container text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-5">
            <span className="mr-2">ℹ️</span>
            <span className="text-sm font-medium"><TranslatedText text={aboutContent?.heroBadgeText} /></span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 dance-font text-white">
            <TranslatedText text={aboutContent?.heroTitle} />
          </h1>
          
          <p className="text-base md:text-lg text-white/90 mb-7 max-w-2xl mx-auto leading-relaxed">
            <TranslatedText text={aboutContent?.heroSubtitle} />
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            {aboutContent?.heroFeatures && Array.isArray(aboutContent.heroFeatures) && aboutContent.heroFeatures.map((feature: any, index: number) => (
              <div key={index} className="flex items-center text-white/90">
                <span className="mr-2">{feature.icon}</span>
                <span><TranslatedText text={feature.text} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20" style={{background: 'var(--neutral-light)'}}>
        <div className="dance-container">
          <div className="dance-section-header">
            <h2 className="dance-section-title"><TranslatedText text={aboutContent?.statsTitle} /></h2>
            <p><TranslatedText text={aboutContent?.statsDescription} /></p>
          </div>
          <div className="dance-card-grid">
            {aboutContent?.stats && Array.isArray(aboutContent.stats) && aboutContent.stats.map((stat: any, index: number) => (
              <div key={index} className="dance-card text-center">
                <div className="text-5xl font-bold mb-2" style={{
                  background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {stat.number || stat.value}
                </div>
                <div className="font-medium mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={stat.label} /></div>
                <div className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={stat.description} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="dance-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-center lg:text-left mb-8">
                <div className="text-6xl mb-4">💃</div>
                <h2 className="text-4xl font-bold mb-6" style={{color: 'var(--primary-dark)'}}><TranslatedText text={aboutContent?.storyTitle} /></h2>
              </div>
              <p className="text-lg leading-relaxed mb-6" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={aboutContent?.storyDescription1} />
              </p>
              <p className="text-lg leading-relaxed mb-8" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={aboutContent?.storyDescription2} />
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/classes" 
                  className="dance-btn dance-btn-primary hover:transform hover:scale-105 transition-all duration-300"
                >
                  Browse Classes
                </Link>
                <Link 
                  href="/contact" 
                  className="dance-btn dance-btn-secondary hover:transform hover:scale-105 transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            
            <div>
              <div className="dance-card">
                <h3 className="text-2xl font-bold mb-8 text-center" style={{color: 'var(--primary-dark)'}}>✨ <TranslatedText text={aboutContent?.whyChooseUsTitle} /></h3>
                <div className="space-y-6">
                  {aboutContent?.features && Array.isArray(aboutContent.features) && aboutContent.features.map((feature: any, index: number) => (
                    <div key={index} className="dance-card" style={{marginBottom: '1rem'}}>
                      <div className="flex items-start">
                        <div className="text-2xl mr-4 mt-1" style={{
                          background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>{feature.icon}</div>
                        <div>
                          <h4 className="font-semibold mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={feature.title} /></h4>
                          <p className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={feature.description} /></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-20" style={{background: 'var(--neutral-light)'}}>
        <div className="dance-container">
          <div className="dance-card">
            <div className="max-w-2xl mx-auto text-center">
              <div className="dance-hero-gradient p-8 text-white">
                <div className="text-6xl mb-4">📧</div>
                <h2 className="text-3xl font-bold mb-4 dance-font"><TranslatedText text={aboutContent?.newsletterTitle} /></h2>
                <p className="text-lg mb-8" style={{color: 'var(--neutral-light)'}}>
                  <TranslatedText text={aboutContent?.newsletterDescription} />
                </p>
                
                {subscribed ? (
                  <div className="dance-card" style={{background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-lg font-semibold">Thank You!</p>
                    <p style={{color: 'var(--neutral-light)'}}>You're subscribed to our newsletter</p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="max-w-lg mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isMounted ? t('aboutPage.newsletterPlaceholder') : 'Enter your email address'}
                        className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 border-0"
                        style={{color: 'var(--primary-dark)', backgroundColor: 'var(--neutral-light)'}}
                        required
                      />
                      <button
                        type="submit"
                        className="dance-btn dance-btn-accent hover:transform hover:scale-105 transition-all duration-300"
                      >
                        Subscribe
                      </button>
                    </div>
                  </form>
                )}
                
                <div className="dance-card-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '2rem'}}>
                  {aboutContent?.newsletterBenefits && Array.isArray(aboutContent.newsletterBenefits) && aboutContent.newsletterBenefits.map((benefit: any, index: number) => (
                    <div key={index} className="dance-card text-center" style={{background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                      <span className="text-2xl mb-2 block">{benefit.icon}</span>
                      <span className="text-sm font-medium"><TranslatedText text={benefit.text} /></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Final CTA Section */}
      <section className="dance-cta">
        <div 
          className="dance-hero-background"
          style={{
            opacity: 0.1
          }}
        ></div>
        <div className="dance-container">
          <div className="text-center">
            <div className="dance-badge mb-6">
              <span className="mr-2">🎆</span>
              <span className="text-sm font-medium"><TranslatedText text={aboutContent?.ctaBadgeText} /></span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 dance-font">
              <TranslatedText text={aboutContent?.ctaTitle} />
            </h2>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--neutral-light)'}}>
              <TranslatedText text={aboutContent?.ctaDescription} />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {aboutContent?.ctaButtons && Array.isArray(aboutContent.ctaButtons) && aboutContent.ctaButtons.map((button: any, index: number) => (
                <Link 
                  key={index}
                  href={button.link}
                  className={`dance-btn ${button.style} hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300`}
                >
                  <TranslatedText text={button.text} />
                </Link>
              ))}
            </div>
            
            <div className="dance-card-grid">
              {aboutContent?.ctaFeatures && Array.isArray(aboutContent.ctaFeatures) && aboutContent.ctaFeatures.map((feature: any, index: number) => (
                <div key={index} className="group text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h4 className="font-bold text-white mb-2"><TranslatedText text={feature.title} /></h4>
                  <p className="text-sm" style={{color: 'var(--neutral-light)'}}><TranslatedText text={feature.description} /></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
