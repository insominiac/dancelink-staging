'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TranslatedText from '../../components/TranslatedText'
import '@/lib/i18n'

export default function BecomeHostPage() {
  const { t } = useTranslation('common')
  const [activeTab, setActiveTab] = useState('benefits')

  const benefits = [
    {
      icon: '🎭',
      title: 'Build Your Dance Community',
      description: 'Create and manage your own dance academy with multiple venues, classes, and events all in one platform.'
    },
    {
      icon: '💼',
      title: 'Professional Management Tools',
      description: 'Get access to professional-grade tools for managing bookings, student communications, and business analytics.'
    },
    {
      icon: '📈',
      title: 'Grow Your Business',
      description: 'Reach more students, increase bookings, and track your performance with detailed analytics and insights.'
    },
    {
      icon: '🌍',
      title: 'Global Reach',
      description: 'Connect with dancers worldwide and expand your audience beyond your local area.'
    },
    {
      icon: '✅',
      title: 'Quality Assurance',
      description: 'All host applications are carefully reviewed to maintain high standards and build trust with students.'
    },
    {
      icon: '🎯',
      title: 'Marketing Support',
      description: 'Get featured in our directory and benefit from our marketing efforts to attract more students.'
    }
  ]

  const features = [
    {
      category: 'Venue Management',
      items: [
        'Create and manage multiple venues',
        'Add detailed venue information with photos',
        'Set location with country and city details',
        'Track venue utilization and bookings'
      ]
    },
    {
      category: 'Class Management',
      items: [
        'Design comprehensive class curriculums',
        'Set flexible scheduling and pricing',
        'Manage student enrollments',
        'Track class performance and attendance'
      ]
    },
    {
      category: 'Event Planning',
      items: [
        'Organize workshops and performances',
        'Create special events and masterclasses',
        'Manage event registrations',
        'Build community through events'
      ]
    },
    {
      category: 'Business Analytics',
      items: [
        'Track revenue and booking trends',
        'Monitor student engagement',
        'Analyze class popularity',
        'Generate performance reports'
      ]
    }
  ]

  const process = [
    {
      step: '1',
      title: 'Submit Application',
      description: 'Fill out the host registration form with your business information.',
      icon: '📋'
    },
    {
      step: '2',
      title: 'Admin Review',
      description: 'Our team carefully reviews your application to ensure quality standards.',
      icon: '👥'
    },
    {
      step: '3',
      title: 'Get Approved',
      description: 'Receive approval notification and gain access to your host dashboard.',
      icon: '✅'
    },
    {
      step: '4',
      title: 'Start Creating',
      description: 'Begin creating venues, classes, and events for your dance community.',
      icon: '🚀'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <TranslatedText text="Become a" /> <span className="text-yellow-400"><TranslatedText text="Host" /></span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              <TranslatedText text="Transform your passion into a thriving dance business. Create your academy, manage venues, and inspire dancers worldwide." />
            </p>
            <div className="space-x-4">
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <TranslatedText text="Start Your Application" />
                <span className="ml-2">→</span>
              </Link>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold rounded-full text-lg transition-all duration-300"
              >
                <TranslatedText text="Learn More" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'benefits', label: 'Benefits' },
              { id: 'features', label: 'Features' },
              { id: 'process', label: 'How It Works' },
              { id: 'faq', label: 'FAQ' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TranslatedText text={tab.label} />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white">
        {/* Benefits Section */}
        {activeTab === 'benefits' && (
          <div id="benefits" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4"><TranslatedText text="Why Become a Host?" /></h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  <TranslatedText text="Join our community of dance professionals and take your business to the next level" />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3"><TranslatedText text={benefit.title} /></h3>
                    <p className="text-gray-600"><TranslatedText text={benefit.description} /></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeTab === 'features' && (
          <div id="features" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4"><TranslatedText text="Powerful Tools for Success" /></h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  <TranslatedText text="Everything you need to manage and grow your dance business" />
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6"><TranslatedText text={feature.category} /></h3>
                    <ul className="space-y-3">
                      {feature.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-gray-700">
                          <span className="text-green-500 mr-3">✓</span>
                          <TranslatedText text={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Process Section */}
        {activeTab === 'process' && (
          <div id="process" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4"><TranslatedText text="How to Get Started" /></h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  <TranslatedText text="Simple steps to become a verified host on our platform" />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {process.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3"><TranslatedText text={step.title} /></h3>
                    <p className="text-gray-600"><TranslatedText text={step.description} /></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div id="faq" className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4"><TranslatedText text="Frequently Asked Questions" /></h2>
                <p className="text-xl text-gray-600">
                  <TranslatedText text="Everything you need to know about becoming a host" />
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question: "What are the requirements to become a host?",
                    answer: "You need to have experience in dance instruction or academy management, provide business information, and pass our quality review process."
                  },
                  {
                    question: "How long does the approval process take?",
                    answer: "Our admin team typically reviews applications within 3-5 business days. You'll receive an email notification once your application is processed."
                  },
                  {
                    question: "Can I create content before approval?",
                    answer: "Yes, you can create venues, classes, and events, but they won't be visible to students until admin approval. This allows you to prepare your content in advance."
                  },
                  {
                    question: "What fees are associated with hosting?",
                    answer: "We take a small commission from successful bookings. There are no upfront fees or monthly charges to become a host."
                  },
                  {
                    question: "Can I manage multiple venues?",
                    answer: "Absolutely! You can create and manage multiple venues across different locations, making it perfect for dance academies with multiple branches."
                  },
                  {
                    question: "What happens if my application is rejected?",
                    answer: "If your application doesn't meet our current requirements, you'll receive feedback on areas for improvement and can reapply after addressing the concerns."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3"><TranslatedText text={faq.question} /></h3>
                    <p className="text-gray-600"><TranslatedText text={faq.answer} /></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            <TranslatedText text="Ready to Share Your Passion?" />
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            <TranslatedText text="Join hundreds of dance professionals who trust our platform to grow their business" />
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <TranslatedText text="Start Your Host Application" />
            <span className="ml-2">🚀</span>
          </Link>
          <p className="text-sm text-gray-300 mt-4">
            <TranslatedText text="No setup fees • Quick approval process • Professional support" />
          </p>
        </div>
      </div>
    </div>
  )
}
