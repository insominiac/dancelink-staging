'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookingItem {
  id: string
  title: string
  price: string
  type: 'class' | 'event'
  spotsLeft?: number
  maxCapacity?: number
}

interface EnhancedGuestBookingFormProps {
  item: BookingItem
  isAvailable: boolean
  disabledReason?: string
}

export default function EnhancedGuestBookingForm({ item, isAvailable, disabledReason }: EnhancedGuestBookingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    experience: 'beginner',
    notes: '',
    agreeToTerms: false
  })


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }


  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }

    setError(null)
    setIsSubmitting(true)
    
    try {
      // Prepare booking data to pass to payment page
      // Acquire seat lock before proceeding
      const lockRes = await fetch('/api/availability/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemType: item.type === 'class' ? 'CLASS' : 'EVENT', itemId: item.id })
      })
      if (!lockRes.ok) {
        const err = await lockRes.json().catch(() => ({}))
        throw new Error(err.error || 'No seats available')
      }
      const { lock } = await lockRes.json()

      const bookingData = {
        [item.type === 'class' ? 'classId' : 'eventId']: item.id,
        className: item.title,
        price: item.price,
        bookingType: item.type,
        lockId: lock.id,
        userDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          experience: formData.experience,
          notes: formData.notes
        }
      }

      // Redirect to payment page with booking data
      const encodedData = encodeURIComponent(JSON.stringify(bookingData))
      router.push(`/booking/payment?data=${encodedData}`)
      
    } catch (error) {
      console.error('Booking preparation error:', error)
      setError('Failed to prepare booking. Please try again.')
      setIsSubmitting(false)
    }
  }


  if (!isAvailable) {
    return (
      <div>
        <button
          disabled
          className="w-full py-4 rounded-full font-semibold bg-gray-400 text-gray-600 cursor-not-allowed"
        >
          {item.type === 'class' ? 'Class' : 'Event'} Unavailable
        </button>
        {disabledReason && (
          <p className="text-xs text-center mt-3 text-gray-700">
            {disabledReason}
          </p>
        )}
      </div>
    )
  }

  if (!showForm) {
    return (
      <div>
        <button
          onClick={() => setShowForm(true)}
          className="dance-btn dance-btn-primary w-full"
        >
          Book {item.type === 'class' ? 'Class' : 'Event'} Now
        </button>
        <p className="text-xs text-center mt-4 opacity-75">
          No account required • Free cancellation up to 24 hours
        </p>
      </div>
    )
  }

  // Booking Information Step
  return (
      <div className="guest-booking-form bg-white border border-gray-200 rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--primary-dark)'}}>Book {item.title}</h3>
          <p className="text-sm text-gray-600">Price: ${item.price}</p>
          {item.spotsLeft && (
            <p className="text-sm text-gray-600">{item.spotsLeft} spots remaining</p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: 'var(--primary-dark)'}}>Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-90">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-90">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-90">Experience Level</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              >
                <option value="beginner" className="text-black">Beginner</option>
                <option value="intermediate" className="text-black">Intermediate</option>
                <option value="advanced" className="text-black">Advanced</option>
                <option value="professional" className="text-black">Professional</option>
              </select>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-90">Emergency Contact Name *</label>
              <input
                type="text"
                name="emergencyContact"
                required
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Emergency contact name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-90">Emergency Contact Phone *</label>
              <input
                type="tel"
                name="emergencyPhone"
                required
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                placeholder="Emergency contact phone"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1 opacity-90">Special Requirements or Notes</label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Any special requirements, dietary restrictions, or questions..."
            />
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" target="_blank" className="underline text-purple-600 hover:text-purple-700">
                terms and conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" className="underline text-purple-600 hover:text-purple-700">
                privacy policy
              </a>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="dance-btn dance-btn-secondary flex-1 text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="dance-btn dance-btn-primary flex-1 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Book for $${item.price}`
              )}
            </button>
          </div>
        </form>
      </div>
    )
  }
