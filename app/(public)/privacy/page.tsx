'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TranslatedText from '../../components/TranslatedText'
import '@/lib/i18n'

export default function PrivacyPage() {
  const { t } = useTranslation('common')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
          <div className="absolute top-8 left-10 text-2xl opacity-20 text-white animate-pulse">🔒</div>
          <div className="absolute top-12 right-10 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '1s'}}>🛡️</div>
          <div className="absolute bottom-8 left-1/2 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '2s'}}>🔐</div>
        </div>
        
        <div className="relative z-10 dance-container text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-5">
            <span className="mr-2">🔒</span>
            <span className="text-sm font-medium"><TranslatedText text={isMounted ? t('privacy.heroBadge') : 'Your Privacy Matters'} /></span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 dance-font text-white">
            <TranslatedText text={isMounted ? t('privacy.title') : 'Privacy Policy'} />
          </h1>
          
          <p className="text-base md:text-lg text-white/90 mb-7 max-w-2xl mx-auto leading-relaxed">
            <TranslatedText text={isMounted ? t('privacy.heroDescription') : 'We are committed to protecting your personal information and your right to privacy. Learn how we collect, use, and safeguard your data.'} />
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <div className="flex items-center text-white/90">
              <span className="mr-2">🛡️</span>
              <span><TranslatedText text={isMounted ? t('privacy.dataProtection') : 'Data Protection'} /></span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="mr-2">🔐</span>
              <span><TranslatedText text={isMounted ? t('privacy.secureStorage') : 'Secure Storage'} /></span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="mr-2">⚖️</span>
              <span><TranslatedText text={isMounted ? t('privacy.legalCompliance') : 'Legal Compliance'} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8" style={{background: 'var(--neutral-light)'}}>
        <div className="dance-container">
          <div className="text-center">
            <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>
              <strong><TranslatedText text={isMounted ? t('privacy.lastUpdated') : 'Last Updated'} />:</strong> <TranslatedText text={isMounted ? t('privacy.lastUpdatedDate') : 'October 14, 2024'} />
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-white">
        <div className="dance-container">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">📋</span><TranslatedText text={isMounted ? t('privacy.introduction.title') : 'Introduction'} />
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={isMounted ? t('privacy.introduction.paragraph1') : 'Welcome to DanceLink ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.'} />
              </p>
              <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={isMounted ? t('privacy.introduction.paragraph2') : 'This privacy policy applies to all information collected through our website, mobile applications, and any related services, sales, marketing, or events.'} />
              </p>
            </div>

            {/* Information We Collect */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">📝</span><TranslatedText text={isMounted ? t('privacy.infoCollection.title') : 'Information We Collect'} />
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--primary-dark)'}}><TranslatedText text={isMounted ? t('privacy.infoCollection.personalInfo.title') : 'Personal Information'} /></h3>
                  <p className="leading-relaxed mb-3" style={{color: 'var(--neutral-gray)'}}>
                    We collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4" style={{color: 'var(--neutral-gray)'}}>
                    <li>Register for an account</li>
                    <li>Book classes or events</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact us for support</li>
                    <li>Participate in surveys or feedback</li>
                  </ul>
                  <p className="leading-relaxed mt-3" style={{color: 'var(--neutral-gray)'}}>
                    This may include: name, email address, phone number, payment information, profile picture, dance preferences, and any other information you choose to provide.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--primary-dark)'}}>Automatically Collected Information</h3>
                  <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                    We automatically collect certain information when you visit our website, including IP address, browser type, operating system, referring URLs, pages viewed, and timestamps.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">⚙️</span>How We Use Your Information
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                We use the information we collect for various purposes, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="dance-card" style={{background: 'var(--neutral-light)', marginBottom: '0'}}>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3 mt-1" style={{
                      background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>🎯</div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Service Provision</h4>
                      <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>Provide and maintain our services, process bookings, and manage your account</p>
                    </div>
                  </div>
                </div>
                
                <div className="dance-card" style={{background: 'var(--neutral-light)', marginBottom: '0'}}>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3 mt-1" style={{
                      background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>📧</div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Communication</h4>
                      <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>Send you updates, marketing communications, and respond to your inquiries</p>
                    </div>
                  </div>
                </div>
                
                <div className="dance-card" style={{background: 'var(--neutral-light)', marginBottom: '0'}}>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3 mt-1" style={{
                      background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>📊</div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Analytics</h4>
                      <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>Analyze usage patterns and improve our services</p>
                    </div>
                  </div>
                </div>
                
                <div className="dance-card" style={{background: 'var(--neutral-light)', marginBottom: '0'}}>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3 mt-1" style={{
                      background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>🔒</div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Security</h4>
                      <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>Protect against fraud and maintain the security of our platform</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">🤝</span>Data Sharing and Disclosure
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4" style={{color: 'var(--neutral-gray)'}}>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who help us operate our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business</li>
                <li><strong>With Your Consent:</strong> When you have given us explicit permission</li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">🛡️</span>Data Security
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="mr-3 text-xl">🔐</span>
                  <span style={{color: 'var(--neutral-gray)'}}>Encryption of sensitive data</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-xl">🔥</span>
                  <span style={{color: 'var(--neutral-gray)'}}>Firewalls and security monitoring</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-xl">👤</span>
                  <span style={{color: 'var(--neutral-gray)'}}>Access controls and authentication</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-xl">📱</span>
                  <span style={{color: 'var(--neutral-gray)'}}>Secure payment processing</span>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">⚖️</span>Your Privacy Rights
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="mr-3 text-lg mt-1">📋</span>
                  <div>
                    <strong style={{color: 'var(--primary-dark)'}}>Access:</strong>
                    <span style={{color: 'var(--neutral-gray)'}}> Request a copy of the personal information we hold about you</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-lg mt-1">✏️</span>
                  <div>
                    <strong style={{color: 'var(--primary-dark)'}}>Correction:</strong>
                    <span style={{color: 'var(--neutral-gray)'}}> Request correction of inaccurate or incomplete information</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-lg mt-1">🗑️</span>
                  <div>
                    <strong style={{color: 'var(--primary-dark)'}}>Deletion:</strong>
                    <span style={{color: 'var(--neutral-gray)'}}> Request deletion of your personal information</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-lg mt-1">📤</span>
                  <div>
                    <strong style={{color: 'var(--primary-dark)'}}>Portability:</strong>
                    <span style={{color: 'var(--neutral-gray)'}}> Request transfer of your data in a portable format</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-lg mt-1">🚫</span>
                  <div>
                    <strong style={{color: 'var(--primary-dark)'}}>Opt-out:</strong>
                    <span style={{color: 'var(--neutral-gray)'}}> Unsubscribe from marketing communications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookies */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">🍪</span>Cookies and Tracking
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us remember your preferences, analyze site traffic, and provide personalized content.
              </p>
              <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                You can control cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.
              </p>
            </div>

            {/* Contact Information */}
            <div className="dance-card">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">📞</span><TranslatedText text={isMounted ? t('privacy.contact.title') : 'Contact Us'} />
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={isMounted ? t('privacy.contact.description') : 'If you have any questions about this Privacy Policy or our privacy practices, please contact us:'} />
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="mr-3 text-xl">📧</span>
                  <span style={{color: 'var(--neutral-gray)'}}>privacy@dancelink.com</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-xl">📱</span>
                  <span style={{color: 'var(--neutral-gray)'}}>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-xl">📍</span>
                  <span style={{color: 'var(--neutral-gray)'}}>123 Dance Street, City, State 12345</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              <span className="mr-2">🛡️</span>
              <span className="text-sm font-medium"><TranslatedText text={isMounted ? t('privacy.cta.badge') : 'Your Privacy is Protected'} /></span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 dance-font">
              <TranslatedText text={isMounted ? t('privacy.cta.title') : 'Questions About Our Privacy Policy?'} />
            </h2>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--neutral-light)'}}>
              <TranslatedText text={isMounted ? t('privacy.cta.description') : "We're here to help. Contact our support team for any privacy-related questions or concerns."} />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="dance-btn dance-btn-accent hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                📞 <TranslatedText text={isMounted ? t('privacy.cta.contactSupport') : 'Contact Support'} />
              </Link>
              <Link 
                href="/terms"
                className="dance-btn dance-btn-outline hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                📋 <TranslatedText text={isMounted ? t('privacy.cta.viewTerms') : 'View Terms of Service'} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
