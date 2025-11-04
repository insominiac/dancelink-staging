'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TranslatedText from '../../components/TranslatedText'
import '@/lib/i18n'

export default function AboutPage() {
  const { t } = useTranslation('common')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
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
            <span className="text-sm font-medium"><TranslatedText text={isMounted ? t('aboutPage.heroBadgeText') : 'Our Story & Mission'} /></span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 dance-font text-white">
            <TranslatedText text={isMounted ? t('aboutPage.heroTitle') : 'About DanceLink'} />
          </h1>
          
          <p className="text-base md:text-lg text-white/90 mb-7 max-w-2xl mx-auto leading-relaxed">
            <TranslatedText text={isMounted ? t('aboutPage.heroSubtitle') : 'Connecting dancers through the universal language of movement. Discover our passion for dance and commitment to excellence.'} />
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <div className="flex items-center text-white/90">
              <span className="mr-2">🌟</span>
              <span><TranslatedText text={isMounted ? t('aboutPage.heroFeatures.awardWinning') : 'Award-winning platform'} /></span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="mr-2">💃</span>
              <span><TranslatedText text={isMounted ? t('aboutPage.heroFeatures.expertInstructors') : 'Expert instructors'} /></span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="mr-2">❤️</span>
              <span><TranslatedText text={isMounted ? t('aboutPage.heroFeatures.passionateCommunity') : 'Passionate community'} /></span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20" style={{background: 'var(--neutral-light)'}}>
        <div className="dance-container">
          <div className="dance-section-header">
            <h2 className="dance-section-title"><TranslatedText text={isMounted ? t('aboutPage.statsTitle') : 'Our Impact in Numbers'} /></h2>
            <p><TranslatedText text={isMounted ? t('aboutPage.statsDescription') : 'See how we\'re making a difference in the dance community with our platform and dedicated instructors'} /></p>
          </div>
          <div className="dance-card-grid">
            <div className="dance-card text-center">
              <div className="text-5xl font-bold mb-2" style={{
                background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                500+
              </div>
              <div className="font-medium mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('aboutPage.stats.happyStudents') : 'Happy Students'} /></div>
              <div className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={isMounted ? t('aboutPage.stats.happyStudentsDesc') : 'And growing daily'} /></div>
            </div>
            <div className="dance-card text-center">
              <div className="text-5xl font-bold mb-2" style={{
                background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                15+
              </div>
              <div className="font-medium mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('aboutPage.stats.danceStyles') : 'Dance Styles'} /></div>
              <div className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={isMounted ? t('aboutPage.stats.danceStylesDesc') : 'From ballet to hip-hop'} /></div>
            </div>
            <div className="dance-card text-center">
              <div className="text-5xl font-bold mb-2" style={{
                background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                20+
              </div>
              <div className="font-medium mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('aboutPage.stats.expertInstructorsCount') : 'Expert Instructors'} /></div>
              <div className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={isMounted ? t('aboutPage.stats.expertInstructorsDesc') : 'Professional & certified'} /></div>
            </div>
            <div className="dance-card text-center">
              <div className="text-5xl font-bold mb-2" style={{
                background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                5
              </div>
              <div className="font-medium mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('aboutPage.stats.studioLocations') : 'Studio Locations'} /></div>
              <div className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={isMounted ? t('aboutPage.stats.studioLocationsDesc') : 'Across the city'} /></div>
            </div>
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
                <h2 className="text-4xl font-bold mb-6" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('aboutPage.ourStory') : 'Our Story'} /></h2>
              </div>
              <p className="text-lg leading-relaxed mb-6" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={isMounted ? t('aboutPage.storyDescription1') : 'DanceLink was founded with a simple belief: everyone deserves to experience the joy and connection that comes from dance. We started as a small community of passionate dancers and have grown into a thriving platform that connects thousands of students with world-class instructors.'} />
              </p>
              <p className="text-lg leading-relaxed mb-8" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={isMounted ? t('aboutPage.storyDescription2') : 'Our mission is to make dance accessible, welcoming, and transformative for people of all backgrounds and skill levels. Whether you\'re taking your first steps or perfecting advanced techniques, we\'re here to support your dance journey.'} />
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/classes" 
                  className="dance-btn dance-btn-primary hover:transform hover:scale-105 transition-all duration-300"
                >
                  <TranslatedText text={isMounted ? t('aboutPage.exploreClasses') : '💃 Explore Classes'} />
                </Link>
                <Link 
                  href="/contact" 
                  className="dance-btn dance-btn-secondary hover:transform hover:scale-105 transition-all duration-300"
                >
                  <TranslatedText text={isMounted ? t('aboutPage.contactUs') : '📞 Contact Us'} />
                </Link>
              </div>
            </div>
            
            <div>
              <div className="dance-card">
                <h3 className="text-2xl font-bold mb-8 text-center" style={{color: 'var(--primary-dark)'}}>✨ <TranslatedText text={isMounted ? t('aboutPage.whyChooseUsTitle') : 'Why Choose DanceLink?'} /></h3>
                <div className="space-y-6">
                  <div className="dance-card" style={{marginBottom: '1rem'}}>
                    <div className="flex items-start">
                      <div className="text-2xl mr-4 mt-1" style={{
                        background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>🏅️</div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('aboutPage.features.awardWinningInstructors.title') : 'Award-winning instructors'} /></h4>
                        <p className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={isMounted ? t('aboutPage.features.awardWinningInstructors.description') : 'Learn from certified professionals with years of experience'} /></p>
                      </div>
                    </div>
                  </div>
                  <div className="dance-card" style={{marginBottom: '1rem'}}>
                    <div className="flex items-start">
                      <div className="text-2xl mr-4 mt-1" style={{
                        background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>🏢</div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('aboutPage.features.stateOfTheArtStudios.title') : 'State-of-the-art studios'} /></h4>
                        <p className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={isMounted ? t('aboutPage.features.stateOfTheArtStudios.description') : 'Modern facilities equipped with the latest technology'} /></p>
                      </div>
                    </div>
                  </div>
                  <div className="dance-card" style={{marginBottom: '1rem'}}>
                    <div className="flex items-start">
                      <div className="text-2xl mr-4 mt-1" style={{
                        background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>👥</div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('aboutPage.features.welcomingCommunity.title') : 'Welcoming community'} /></h4>
                        <p className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={isMounted ? t('aboutPage.features.welcomingCommunity.description') : 'Join a supportive network of fellow dance enthusiasts'} /></p>
                      </div>
                    </div>
                  </div>
                  <div className="dance-card" style={{marginBottom: '1rem'}}>
                    <div className="flex items-start">
                      <div className="text-2xl mr-4 mt-1" style={{
                        background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>📈</div>
                      <div>
                        <h4 className="font-semibold mb-1" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('aboutPage.features.provenResults.title') : 'Proven results'} /></h4>
                        <p className="text-sm" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={isMounted ? t('aboutPage.features.provenResults.description') : 'Track your progress and celebrate your achievements'} /></p>
                      </div>
                    </div>
                  </div>
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
                <h2 className="text-3xl font-bold mb-4 dance-font"><TranslatedText text={isMounted ? t('aboutPage.newsletterTitle') : 'Stay in the Loop!'} /></h2>
                <p className="text-lg mb-8" style={{color: 'var(--neutral-light)'}}>
                  <TranslatedText text={isMounted ? t('aboutPage.newsletterDescription') : 'Get exclusive access to new classes, special events, and dance tips delivered to your inbox weekly.'} />
                </p>
                
                {subscribed ? (
                  <div className="dance-card" style={{background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-lg font-semibold"><TranslatedText text={isMounted ? t('aboutPage.subscriptionSuccess') : 'Thanks for subscribing!'} /></p>
                    <p style={{color: 'var(--neutral-light)'}}><TranslatedText text={isMounted ? t('aboutPage.checkEmail') : 'Check your email for confirmation'} /></p>
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
                        style={{color: 'var(--primary-dark)', backgroundColor: 'var(--neutral-light)', focusRingColor: 'rgba(255, 255, 255, 0.5)'}}
                        required
                      />
                      <button
                        type="submit"
                        className="dance-btn dance-btn-accent hover:transform hover:scale-105 transition-all duration-300"
                      >
                        <TranslatedText text={isMounted ? t('aboutPage.subscribeButton') : '🚀 Subscribe'} />
                      </button>
                    </div>
                  </form>
                )}
                
                <div className="dance-card-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '2rem'}}>
                  <div className="dance-card text-center" style={{background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                    <span className="text-2xl mb-2 block">🎁</span>
                    <span className="text-sm font-medium"><TranslatedText text={isMounted ? t('aboutPage.newsletterBenefits.weeklyTips') : 'Weekly Tips'} /></span>
                  </div>
                  <div className="dance-card text-center" style={{background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                    <span className="text-2xl mb-2 block">🎉</span>
                    <span className="text-sm font-medium"><TranslatedText text={isMounted ? t('aboutPage.newsletterBenefits.exclusiveEvents') : 'Exclusive Events'} /></span>
                  </div>
                  <div className="dance-card text-center" style={{background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                    <span className="text-2xl mb-2 block">💰</span>
                    <span className="text-sm font-medium"><TranslatedText text={isMounted ? t('aboutPage.newsletterBenefits.specialDiscounts') : 'Special Discounts'} /></span>
                  </div>
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
              <span className="text-sm font-medium"><TranslatedText text={isMounted ? t('aboutPage.ctaBadgeText') : 'Start Your Journey'} /></span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 dance-font">
              <TranslatedText text={isMounted ? t('aboutPage.ctaTitle') : 'Ready to Begin Your Dance Journey?'} />
            </h2>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--neutral-light)'}}>
              <TranslatedText text={isMounted ? t('aboutPage.ctaDescription') : 'Join hundreds of dancers who have transformed their lives through movement at DanceLink. Start your adventure today!'} />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/contact"
                className="dance-btn dance-btn-accent hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <TranslatedText text={isMounted ? t('aboutPage.ctaButtons.startFreeTrial') : '🎁 Start Free Trial'} />
              </Link>
              <Link 
                href="/classes"
                className="dance-btn dance-btn-outline hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <TranslatedText text={isMounted ? t('aboutPage.ctaButtons.browseAllClasses') : '👀 Browse All Classes'} />
              </Link>
            </div>
            
            <div className="dance-card-grid">
              <div className="group text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">✅</div>
                <h4 className="font-bold text-white mb-2"><TranslatedText text={isMounted ? t('aboutPage.ctaFeatures.noExperienceNeeded.title') : 'No Experience Needed'} /></h4>
                <p className="text-sm" style={{color: 'var(--neutral-light)'}}><TranslatedText text={isMounted ? t('aboutPage.ctaFeatures.noExperienceNeeded.description') : 'Perfect for beginners and seasoned dancers alike'} /></p>
              </div>
              <div className="group text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📅</div>
                <h4 className="font-bold text-white mb-2"><TranslatedText text={isMounted ? t('aboutPage.ctaFeatures.flexibleScheduling.title') : 'Flexible Scheduling'} /></h4>
                <p className="text-sm" style={{color: 'var(--neutral-light)'}}><TranslatedText text={isMounted ? t('aboutPage.ctaFeatures.flexibleScheduling.description') : 'Choose classes that fit your busy lifestyle'} /></p>
              </div>
              <div className="group text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💰</div>
                <h4 className="font-bold text-white mb-2"><TranslatedText text={isMounted ? t('aboutPage.ctaFeatures.moneyBackGuarantee.title') : 'Money-back Guarantee'} /></h4>
                <p className="text-sm" style={{color: 'var(--neutral-light)'}}><TranslatedText text={isMounted ? t('aboutPage.ctaFeatures.moneyBackGuarantee.description') : '100% satisfaction or your money back'} /></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
