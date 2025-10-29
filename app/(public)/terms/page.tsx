'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TranslatedText from '../../components/TranslatedText'
import '@/lib/i18n'

export default function TermsPage() {
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
          <div className="absolute top-8 left-10 text-2xl opacity-20 text-white animate-pulse">⚖️</div>
          <div className="absolute top-12 right-10 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '1s'}}>📋</div>
          <div className="absolute bottom-8 left-1/2 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '2s'}}>🤝</div>
        </div>
        
        <div className="relative z-10 dance-container text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-5">
            <span className="mr-2">⚖️</span>
            <span className="text-sm font-medium"><TranslatedText text={isMounted ? t('terms.heroBadge') : 'Legal Terms & Conditions'} /></span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 dance-font text-white">
            <TranslatedText text={isMounted ? t('terms.title') : 'Terms of Service'} />
          </h1>
          
          <p className="text-base md:text-lg text-white/90 mb-7 max-w-2xl mx-auto leading-relaxed">
            <TranslatedText text={isMounted ? t('terms.heroDescription') : 'Please read these terms carefully before using our services. By accessing DanceLink, you agree to be bound by these terms and conditions.'} />
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <div className="flex items-center text-white/90">
              <span className="mr-2">📋</span>
              <span><TranslatedText text={isMounted ? t('terms.clearGuidelines') : 'Clear Guidelines'} /></span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="mr-2">🤝</span>
              <span><TranslatedText text={isMounted ? t('terms.fairAgreement') : 'Fair Agreement'} /></span>
            </div>
            <div className="flex items-center text-white/90">
              <span className="mr-2">⚖️</span>
              <span><TranslatedText text={isMounted ? t('terms.legalProtection') : 'Legal Protection'} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8" style={{background: 'var(--neutral-light)'}}>
        <div className="dance-container">
          <div className="text-center">
            <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>
              <strong><TranslatedText text={isMounted ? t('terms.lastUpdated') : 'Last Updated'} />:</strong> <TranslatedText text={isMounted ? t('terms.lastUpdatedDate') : 'October 14, 2024'} />
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 bg-white">
        <div className="dance-container">
          <div className="max-w-4xl mx-auto">
            
            {/* Agreement to Terms */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">🤝</span><TranslatedText text={isMounted ? t('terms.agreement.title') : 'Agreement to Terms'} />
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={isMounted ? t('terms.agreement.paragraph1') : 'By accessing and using DanceLink ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'} />
              </p>
              <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={isMounted ? t('terms.agreement.paragraph2') : 'These terms apply to all visitors, users, and others who access or use the service, including instructors, students, and hosts.'} />
              </p>
            </div>

            {/* Use of the Service */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">🎯</span><TranslatedText text={isMounted ? t('terms.usage.title') : 'Use of the Service'} />
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--primary-dark)'}}>Permitted Uses</h3>
                  <p className="leading-relaxed mb-3" style={{color: 'var(--neutral-gray)'}}>
                    You may use our service to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4" style={{color: 'var(--neutral-gray)'}}>
                    <li>Browse and book dance classes and events</li>
                    <li>Create and manage your profile</li>
                    <li>Communicate with instructors and other users</li>
                    <li>Participate in our community features</li>
                    <li>Access educational content and resources</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3" style={{color: 'var(--primary-dark)'}}>Prohibited Uses</h3>
                  <p className="leading-relaxed mb-3" style={{color: 'var(--neutral-gray)'}}>
                    You agree not to use the service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4" style={{color: 'var(--neutral-gray)'}}>
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* User Accounts */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">👤</span><TranslatedText text={isMounted ? t('terms.accounts.title') : 'User Accounts'} />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="dance-card" style={{background: 'var(--neutral-light)', marginBottom: '0'}}>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3 mt-1" style={{
                      background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>🔑</div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Account Security</h4>
                      <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>You are responsible for safeguarding your password and all activities under your account</p>
                    </div>
                  </div>
                </div>
                
                <div className="dance-card" style={{background: 'var(--neutral-light)', marginBottom: '0'}}>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3 mt-1" style={{
                      background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>✅</div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Accurate Information</h4>
                      <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>You must provide accurate, current, and complete information during registration</p>
                    </div>
                  </div>
                </div>
                
                <div className="dance-card" style={{background: 'var(--neutral-light)', marginBottom: '0'}}>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3 mt-1" style={{
                      background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>🚫</div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Account Sharing</h4>
                      <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>You may not share your account credentials with others or allow unauthorized access</p>
                    </div>
                  </div>
                </div>
                
                <div className="dance-card" style={{background: 'var(--neutral-light)', marginBottom: '0'}}>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3 mt-1" style={{
                      background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>🔄</div>
                    <div>
                      <h4 className="font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Account Updates</h4>
                      <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>You must promptly update your account information when it changes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking and Payment Terms */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">💳</span><TranslatedText text={isMounted ? t('terms.payment.title') : 'Booking and Payment Terms'} />
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Booking Policy</h3>
                  <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                    All bookings are subject to availability and confirmation. We reserve the right to cancel or reschedule classes due to unforeseen circumstances, instructor availability, or insufficient enrollment.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Payment</h3>
                  <p className="leading-relaxed mb-2" style={{color: 'var(--neutral-gray)'}}>
                    Payment is required at the time of booking. We accept major credit cards and other payment methods as displayed during checkout.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Cancellation Policy</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4" style={{color: 'var(--neutral-gray)'}}>
                    <li><strong>Classes:</strong> Cancel up to 24 hours before class time for a full refund</li>
                    <li><strong>Events:</strong> Cancel up to 48 hours before event time for a full refund</li>
                    <li><strong>Late Cancellations:</strong> Subject to a cancellation fee</li>
                    <li><strong>No-Shows:</strong> No refund will be provided</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">🎨</span>Intellectual Property
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                The service and its original content, features, and functionality are and will remain the exclusive property of DanceLink and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <span className="mr-3 text-xl mt-1">©</span>
                  <div>
                    <strong style={{color: 'var(--primary-dark)'}}>Copyright:</strong>
                    <span style={{color: 'var(--neutral-gray)'}}> All content is protected by copyright law</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-xl mt-1">™</span>
                  <div>
                    <strong style={{color: 'var(--primary-dark)'}}>Trademarks:</strong>
                    <span style={{color: 'var(--neutral-gray)'}}> Our logos and branding are protected trademarks</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-xl mt-1">🚫</span>
                  <div>
                    <strong style={{color: 'var(--primary-dark)'}}>Restrictions:</strong>
                    <span style={{color: 'var(--neutral-gray)'}}> You may not reproduce or distribute our content</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-3 text-xl mt-1">✅</span>
                  <div>
                    <strong style={{color: 'var(--primary-dark)'}}>Fair Use:</strong>
                    <span style={{color: 'var(--neutral-gray)'}}> Personal, non-commercial use is permitted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy and Data */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">🔒</span>Privacy and Data Protection
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
              </p>
              <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center">
                  <span className="mr-3 text-2xl">🔒</span>
                  <div>
                    <h4 className="font-semibold" style={{color: 'var(--primary-dark)'}}>Privacy Policy</h4>
                    <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>Learn how we protect and use your personal information</p>
                  </div>
                </div>
                <Link href="/privacy" className="dance-btn dance-btn-primary text-sm hover:transform hover:scale-105 transition-all duration-300">
                  Read Policy
                </Link>
              </div>
            </div>

            {/* Liability and Disclaimers */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">⚠️</span>Liability and Disclaimers
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Assumption of Risk</h3>
                  <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                    Dance activities involve physical movement and carry inherent risks. By participating, you acknowledge and assume all risks of injury or harm.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Health and Safety</h3>
                  <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                    You are responsible for ensuring you are physically capable of participating in dance activities. Consult with a healthcare provider if you have any concerns.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Service Availability</h3>
                  <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                    We strive to maintain service availability but cannot guarantee uninterrupted access. We are not liable for temporary service disruptions.
                  </p>
                </div>
              </div>
            </div>

            {/* Termination */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">🚪</span>Termination
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                If you wish to terminate your account, you may simply discontinue using the service or contact us for account deletion.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="dance-card mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">🔄</span>Changes to Terms
              </h2>
              <p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>

            {/* Contact Information */}
            <div className="dance-card">
              <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}>
                <span className="mr-3">📞</span><TranslatedText text={isMounted ? t('terms.contact.title') : 'Contact Us'} />
              </h2>
              <p className="leading-relaxed mb-4" style={{color: 'var(--neutral-gray)'}}>
                <TranslatedText text={isMounted ? t('terms.contact.description') : 'If you have any questions about these Terms of Service, please contact us:'} />
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="mr-3 text-xl">📧</span>
                  <span style={{color: 'var(--neutral-gray)'}}>legal@dancelink.com</span>
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
              <span className="mr-2">⚖️</span>
              <span className="text-sm font-medium"><TranslatedText text={isMounted ? t('terms.cta.badge') : 'Clear Terms & Fair Conditions'} /></span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 dance-font">
              <TranslatedText text={isMounted ? t('terms.cta.title') : 'Ready to Join Our Dance Community?'} />
            </h2>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{color: 'var(--neutral-light)'}}>
              <TranslatedText text={isMounted ? t('terms.cta.description') : "Now that you've read our terms, you're ready to start your dance journey with confidence and clarity."} />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/classes"
                className="dance-btn dance-btn-accent hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                💃 <TranslatedText text={isMounted ? t('terms.cta.browseClasses') : 'Browse Classes'} />
              </Link>
              <Link 
                href="/contact"
                className="dance-btn dance-btn-outline hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                📞 <TranslatedText text={isMounted ? t('terms.cta.contactUs') : 'Questions? Contact Us'} />
              </Link>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-sm" style={{color: 'var(--neutral-light)'}}>
                <TranslatedText text={isMounted ? t('terms.cta.agreement') : 'By using our service, you agree to these terms.'} /> 
                <Link href="/privacy" className="underline hover:no-underline">
                  <TranslatedText text={isMounted ? t('terms.cta.viewPrivacy') : 'View our Privacy Policy'} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
