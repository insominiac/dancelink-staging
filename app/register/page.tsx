'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    registerAsHost: false,
    businessName: '',
    businessType: '',
    description: '',
    experienceYears: '',
    country: '',
    city: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'ADMIN' ? '/admin' : 
                          user.role === 'INSTRUCTOR' ? '/instructor' : 
                          '/dashboard'
      router.push(redirectPath)
    }
  }, [isAuthenticated, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields')
      return
    }
    
    // Additional validation for host registration
    if (formData.registerAsHost) {
      if (!formData.businessName || !formData.businessType || !formData.country || !formData.city) {
        setError('Business information is required for host registration')
        return
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)

    const result = await register({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      phone: formData.phone || undefined,
      registerAsHost: formData.registerAsHost,
      businessName: formData.businessName || undefined,
      businessType: formData.businessType || undefined,
      description: formData.description || undefined,
      experienceYears: formData.experienceYears || undefined,
      country: formData.country || undefined,
      city: formData.city || undefined
    })
    
    if (!result.success) {
      setError(result.error || 'Registration failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))'}}>
      <div className="relative z-10 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-8 md:px-10 md:py-10">
              <div className="text-center mb-6">
                <h2 
                  className="text-3xl md:text-4xl font-extrabold mb-2"
                  style={{ 
                    color: 'var(--primary-dark)'
                  }}
                >
                  {formData.registerAsHost ? 'Become a Host' : 'Create your account'}
                </h2>
                <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>
                  Or{' '}
                  <Link 
                    href="/login" 
                    className="font-semibold"
                    style={{color: 'var(--primary-gold)'}}
                  >
                    sign in to your existing account
                  </Link>
                </p>
              </div>

              <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
                {/* Account Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold" style={{color: 'var(--primary-dark)'}}>Account Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, registerAsHost: false }))}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        !formData.registerAsHost 
                          ? 'border-amber-300 bg-amber-50 text-amber-800'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      Student Account
                      <div className="text-xs opacity-80">Book classes and events</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, registerAsHost: true }))}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        formData.registerAsHost 
                          ? 'border-amber-300 bg-amber-50 text-amber-800'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      Host Account
                      <div className="text-xs opacity-80">Create and manage your academy, classes, and events</div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                      Phone Number (optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Create a password"
                    />
                    <p className="mt-1 text-xs" style={{color: 'var(--neutral-gray)'}}>
                      Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Confirm your password"
                    />
                  </div>

                  {/* Host-specific fields */}
                  {formData.registerAsHost && (
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-lg font-semibold mb-4" style={{color: 'var(--primary-dark)'}}>Business Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="businessName" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                            Business/Studio Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="businessName"
                            name="businessName"
                            type="text"
                            required={formData.registerAsHost}
                            value={formData.businessName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            placeholder="Your dance studio/academy name"
                          />
                        </div>
                        <div>
                          <label htmlFor="businessType" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                            Business Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="businessType"
                            name="businessType"
                            required={formData.registerAsHost}
                            value={formData.businessType}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3.5 border border-gray-200 bg-white rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                          >
                            <option value="">Select business type</option>
                            <option value="STUDIO">Dance Studio</option>
                            <option value="SCHOOL">Dance School</option>
                            <option value="ACADEMY">Dance Academy</option>
                            <option value="FREELANCE">Freelance Instructor</option>
                            <option value="COMPANY">Dance Company</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                            Country <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="country"
                            name="country"
                            type="text"
                            required={formData.registerAsHost}
                            value={formData.country}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            placeholder="Country"
                          />
                        </div>
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            required={formData.registerAsHost}
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                            placeholder="City"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label htmlFor="experienceYears" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                          Years of Experience (optional)
                        </label>
                        <input
                          id="experienceYears"
                          name="experienceYears"
                          type="number"
                          min="0"
                          max="50"
                          value={formData.experienceYears}
                          onChange={handleChange}
                          className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                          placeholder="Years teaching dance"
                        />
                      </div>

                      <div className="mt-4">
                        <label htmlFor="description" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                          Business Description (optional)
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                          placeholder="Tell us about your dance business..."
                        />
                      </div>

                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="text-amber-400">⚠️</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-semibold text-amber-800">
                              Application Review Process
                            </h3>
                            <div className="mt-2 text-sm text-amber-700">
                              <p>Your host application will be reviewed by our admin team. You'll receive an email notification once approved. Only approved hosts can publish venues, classes, and events.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-xl p-3">
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center text-white font-semibold rounded-xl px-6 py-3.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:scale-[1.01]"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-gold), var(--accent-rose))'
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </>
                    ) : (
                      formData.registerAsHost ? 'Submit Host Application' : 'Create account'
                    )}
                  </button>
                </div>

                <div className="text-center text-xs" style={{color: 'var(--neutral-gray)'}}>
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="font-medium" style={{color: 'var(--primary-gold)'}}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium" style={{color: 'var(--primary-gold)'}}>
                    Privacy Policy
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm font-medium text-white/90 hover:text-white">← Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
