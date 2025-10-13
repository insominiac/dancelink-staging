'use client';

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'
import TranslatedText from '../../components/TranslatedText'
import { useAutoTranslate } from '../../components/TranslatedText'

interface ContactPageContent {
  heroTitle: string
  heroSubtitle: string
  heroButtons: Array<{ text: string; href: string; isPrimary: boolean }>
  quickOptionsTitle: string
  quickOptions: Array<{
    icon: string
    title: string
    description: string
    buttonText: string
    buttonHref: string
  }>
  formTitle: string
  formSubtitle: string
  formOptions: Array<{ value: string; label: string }>
  formFields: {
    nameLabel: string
    phoneLabel: string
    emailLabel: string
    interestLabel: string
    messageLabel: string
    namePlaceholder: string
    phonePlaceholder: string
    emailPlaceholder: string
    messagePlaceholder: string
  }
  submitButtonText: string
  responseTimeText: string
  faqTitle: string
  faqSubtitle: string
  faqs: Array<{ question: string; answer: string }>
}

export default function ContactPage() {
  const { t } = useTranslation('common')
  const [isMounted, setIsMounted] = useState(false)
  
  // Translation hooks for select options
  const selectAnOptionText = useAutoTranslate('Select an option')
  const freeTrialClassText = useAutoTranslate('🎁 Free Trial Class')
  const regularClassesText = useAutoTranslate('💃 Regular Classes')
  const eventsWorkshopsText = useAutoTranslate('🎉 Events & Workshops')
  const privateLessonsText = useAutoTranslate('👨‍🏫 Private Lessons')
  const otherText = useAutoTranslate('❓ Other')
  const [content, setContent] = useState<ContactPageContent | null>(null)
  const [seo, setSeo] = useState<{ title?: string; description?: string; ogTitle?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/admin/content/contact')
        if (response.ok) {
          const data = await response.json()
          setContent(data.content)
        }
      } catch (error) {
        console.error('Error fetching contact content:', error)
        // Continue with null content, fallbacks will be used
      } finally {
        setIsLoading(false)
      }
    }

    const fetchSeo = async () => {
      try {
        const res = await fetch('/api/seo?path=/contact')
        if (res.ok) {
          const data = await res.json()
          if (data?.seoData) {
            setSeo({
              title: data.seoData.title || undefined,
              description: data.seoData.description || undefined,
              ogTitle: data.seoData.ogTitle || undefined,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error)
      }
    }

    fetchContent()
    fetchSeo()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)]" style={{background: 'var(--neutral-light)'}}>
        {/* Hero Section - Loading State */}
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
            <div className="absolute top-8 left-10 text-2xl opacity-20 text-white animate-pulse">📞</div>
            <div className="absolute top-12 right-10 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '1s'}}>✉️</div>
            <div className="absolute bottom-8 left-1/2 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '2s'}}>💬</div>
          </div>
          
          <div className="relative z-10 dance-container text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-5">
              <span className="mr-2">📞</span>
              <span className="text-sm font-medium">{isMounted ? <TranslatedText text={seo?.ogTitle || 'Get in touch with us'} /> : <TranslatedText text="Get in touch with us" />}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 dance-font text-white">
              Contact <span className="text-yellow-100 dance-font">Us</span>
            </h1>
            
            <p className="text-base md:text-lg text-white/90 mb-7 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Ready to start dancing? We're here to help you find the perfect class!" />
            </p>
          </div>
        </section>
        
        <div className="dance-container py-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4 mx-auto" style={{borderBottomColor: 'var(--primary-gold)'}}></div>
            <p className="text-gray-600">{isMounted ? t('ui.loading') : <TranslatedText text="Loading..." />}</p>
          </div>
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
          <div className="absolute top-8 left-10 text-2xl opacity-20 text-white animate-pulse">📞</div>
          <div className="absolute top-12 right-10 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '1s'}}>✉️</div>
          <div className="absolute bottom-8 left-1/2 text-2xl opacity-20 text-white animate-pulse" style={{animationDelay: '2s'}}>💬</div>
        </div>
        
        <div className="relative z-10 dance-container text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-5">
            <span className="mr-2">📞</span>
            <span className="text-sm font-medium"><TranslatedText text={seo?.ogTitle || 'Get in Touch'} /></span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 dance-font text-white">
            <TranslatedText text={content?.heroTitle || seo?.title || 'Contact Us'} />
          </h1>
          
          <p className="text-base md:text-lg text-white/90 mb-7 max-w-2xl mx-auto leading-relaxed">
            <TranslatedText text={content?.heroSubtitle || seo?.description || 'We are here to help you. Send us a message and we will respond soon.'} />
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-3xl mx-auto">
            {(content?.heroButtons || [
              { text: "📱 Call Now: (123) 456-7890", href: "tel:+1234567890", isPrimary: true },
              { text: "✉️ Email Us", href: "mailto:info@dancelink.com", isPrimary: false }
            ]).map((button, index) => (
              <a 
                key={index}
                href={button.href} 
                className={button.isPrimary 
                  ? "px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/30 hover:transform hover:scale-105 hover:shadow-2xl transition-all duration-300 flex-1 text-center"
                  : "px-8 py-4 border-2 border-white/50 text-white rounded-full font-semibold hover:bg-white/20 hover:backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300 flex-1 text-center"
                }
                >
                <TranslatedText text={button.text} />
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* Quick Options Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="dance-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {(content?.quickOptions || [
              { icon: "🎁", title: "Book Free Trial", description: "Try any class for free and see if it's right for you", buttonText: "Book Now", buttonHref: "tel:+1234567890" },
              { icon: "💬", title: "Live Chat", description: "Get instant answers to your questions", buttonText: "Chat Now", buttonHref: "#chat" },
              { icon: "📅", title: "Schedule Visit", description: "Visit our studio and meet our instructors", buttonText: "Schedule", buttonHref: "mailto:info@dancelink.com" }
            ]).map((option, index) => (
              <div key={index} className="dance-card text-center hover:transform hover:scale-105 transition-all duration-300 h-full flex flex-col">
                <div className="text-4xl mb-6">{option.icon}</div>
<h3 className="text-xl font-bold mb-4" style={{color: 'var(--primary-dark)'}}><TranslatedText text={option.title} /></h3>
<p className="mb-6 flex-1" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={option.description} /></p>
                {option.buttonHref.startsWith('#') ? (
                  <button 
                    className="dance-btn dance-btn-secondary" 
                    onClick={() => alert('Chat feature coming soon!')}
                  >
                    <TranslatedText text={option.buttonText} />
                  </button>
                ) : (
                  <a href={option.buttonHref} className="dance-btn dance-btn-primary">
                    <TranslatedText text={option.buttonText} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24" style={{background: 'var(--neutral-light)'}}>
        <div className="dance-container">
          <div className="text-center mb-16">
<h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: 'var(--primary-dark)'}}><TranslatedText text={content?.formTitle || "📝 Send Us a Message"} /></h2>
<p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={content?.formSubtitle || "Fill out the form below and we'll get back to you within 24 hours"} /></p>
          </div>
          <div className="dance-card max-w-3xl mx-auto">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-3" style={{color: 'var(--primary-dark)'}}><TranslatedText text={content?.formFields?.nameLabel || "Name *"} /></label>
                  <input className="w-full px-5 py-4 border-2 rounded-full focus:border-yellow-400 focus:outline-none transition border-gray-300 text-base" 
                         placeholder={content?.formFields?.namePlaceholder || "Your name"} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3" style={{color: 'var(--primary-dark)'}}><TranslatedText text={content?.formFields?.phoneLabel || "Phone"} /></label>
                  <input type="tel" className="w-full px-5 py-4 border-2 rounded-full focus:border-yellow-400 focus:outline-none transition border-gray-300 text-base" 
                         placeholder={content?.formFields?.phonePlaceholder || "(123) 456-7890"} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-3" style={{color: 'var(--primary-dark)'}}><TranslatedText text={content?.formFields?.emailLabel || "Email *"} /></label>
                <input type="email" className="w-full px-5 py-4 border-2 rounded-full focus:border-yellow-400 focus:outline-none transition border-gray-300 text-base" 
                       placeholder={content?.formFields?.emailPlaceholder || "you@example.com"} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-3" style={{color: 'var(--primary-dark)'}}><TranslatedText text={content?.formFields?.interestLabel || "I'm interested in:"} /></label>
                <select className="w-full px-5 py-4 border-2 rounded-full focus:border-yellow-400 focus:outline-none transition border-gray-300 text-base">
                  <option value="">{selectAnOptionText}</option>
                  {(content?.formOptions || [
                    { value: "trial", label: freeTrialClassText },
                    { value: "classes", label: regularClassesText },
                    { value: "events", label: eventsWorkshopsText },
                    { value: "private", label: privateLessonsText },
                    { value: "other", label: otherText }
                  ]).map((option, index) => (
                    <option key={index} value={option.value}>{typeof option.label === 'string' ? option.label : option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-3" style={{color: 'var(--primary-dark)'}}><TranslatedText text={content?.formFields?.messageLabel || "Message"} /></label>
                <textarea className="w-full px-5 py-4 border-2 rounded-lg focus:border-yellow-400 focus:outline-none transition border-gray-300 text-base" 
                          rows={6} placeholder={content?.formFields?.messagePlaceholder || "Tell us about your dance goals, experience level, or any questions you have..."}></textarea>
              </div>
              <div className="text-center pt-4">
                <button type="submit" className="dance-btn dance-btn-primary px-12 py-4 text-lg hover:transform hover:scale-105 transition-all duration-300">
<TranslatedText text={content?.submitButtonText || "🚀 Send Message"} />
                </button>
<p className="text-sm mt-6 opacity-75 max-w-lg mx-auto"><TranslatedText text={content?.responseTimeText || "We typically respond within 2-4 hours during business hours"} /></p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="dance-container">
          <div className="text-center mb-16">
<h2 className="text-3xl md:text-4xl font-bold mb-6" style={{color: 'var(--primary-dark)'}}><TranslatedText text={content?.faqTitle || "❓ Frequently Asked Questions"} /></h2>
<p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={content?.faqSubtitle || "Quick answers to common questions"} /></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {(content?.faqs || [
              { question: "Do I need experience to start?", answer: "Not at all! We have beginner-friendly classes for all dance styles. Our instructors are experienced in teaching complete beginners." },
              { question: "What should I wear?", answer: "Comfortable clothing that allows you to move freely. Most students wear athletic wear or casual clothes with supportive shoes." },
              { question: "Can I try before I commit?", answer: "Yes! We offer a free trial class for all new students. This lets you experience our teaching style and see if the class is right for you." },
              { question: "How do I book a class?", answer: "Call us at (123) 456-7890, send us an email, or fill out the contact form above. We'll help you find the perfect class!" }
            ]).map((faq, index) => (
              <div key={index} className="dance-card h-full">
<h3 className="text-lg font-bold mb-4" style={{color: 'var(--primary-dark)'}}><TranslatedText text={faq.question} /></h3>
<p className="leading-relaxed" style={{color: 'var(--neutral-gray)'}}><TranslatedText text={faq.answer} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
