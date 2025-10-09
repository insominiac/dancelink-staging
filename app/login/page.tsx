'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [logoutMessage, setLogoutMessage] = useState('')
  const { login, isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Check for logout message and redirect if already authenticated
  useEffect(() => {
    // Check if user just logged out
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('logout') === 'success') {
      setLogoutMessage('You have been successfully logged out.')
      // Remove the parameter from URL without reloading
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'ADMIN' ? '/admin' : 
                          user.role === 'HOST' ? '/host' :
                          user.role === 'INSTRUCTOR' ? '/instructor' : 
                          '/dashboard'
      router.push(redirectPath)
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      // Redirect will happen via useEffect above
    } else {
      setError(result.error || 'Login failed')
    }
    
    setLoading(false)
  }

  const handleDemoLogin = async (role: 'instructor' | 'user' | 'host') => {
    setLoading(true)
    setError('')

    let demoCredentials: { email: string; password: string }

    switch (role) {
      case 'instructor':
        demoCredentials = { email: 'instructor@demo.com', password: 'instructor123' }
        break
      case 'host':
        demoCredentials = { email: 'host@demo.com', password: 'host123' }
        break
      case 'user':
        demoCredentials = { email: 'user@demo.com', password: 'user123' }
        break
    }

    const result = await login(demoCredentials.email, demoCredentials.password)
    
    if (!result.success) {
      setError(result.error || 'Demo login failed')
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
                  style={{ color: 'var(--primary-dark)' }}
                >
                  Sign in to your account
                </h2>
                <p className="text-sm" style={{color: 'var(--neutral-gray)'}}>
                  Or{' '}
                  <Link href="/register" className="font-semibold" style={{color: 'var(--primary-gold)'}}>
                    create a new account
                  </Link>
                </p>
              </div>

              {/* Demo Login Buttons */}
              <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm mb-6">
                <div className="flex items-center mb-3">
                  <span className="text-lg mr-2">🎭</span>
                  <h3 className="text-sm font-semibold text-blue-800">Try Demo Accounts</h3>
                </div>
                <p className="text-xs text-blue-600 mb-4">Try different user roles - Host, Instructor, or Student</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleDemoLogin('instructor')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-150 border border-green-200 text-green-800 py-3 px-4 rounded-lg transition-all disabled:opacity-50 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🎓</span>
                        <div className="text-left">
                          <div className="text-sm font-medium">Instructor Panel</div>
                          <div className="text-xs opacity-75">Class & student management</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono bg-green-200 px-2 py-1 rounded text-green-700">instructor@demo.com</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('host')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 border border-purple-200 text-purple-800 py-3 px-4 rounded-lg transition-all disabled:opacity-50 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🏠</span>
                        <div className="text-left">
                          <div className="text-sm font-medium">Host Dashboard</div>
                          <div className="text-xs opacity-75">Manage venues & classes</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono bg-purple-200 px-2 py-1 rounded text-purple-700">host@demo.com</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoLogin('user')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 text-blue-800 py-3 px-4 rounded-lg transition-all disabled:opacity-50 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">💃</span>
                        <div className="text-left">
                          <div className="text-sm font-medium">Student Dashboard</div>
                          <div className="text-xs opacity-75">Book classes & events</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono bg-blue-200 px-2 py-1 rounded text-blue-700">user@demo.com</span>
                    </div>
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600 text-center">💡 Each role offers unique features and capabilities</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium" style={{color: 'var(--primary-dark)'}}>
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      placeholder="Password"
                    />
                  </div>
                </div>

                {logoutMessage && (
                  <div className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-xl p-3">
                    {logoutMessage}
                  </div>
                )}
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
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <Link href="/forgot-password" className="text-sm font-medium" style={{color: 'var(--primary-gold)'}}>
                    Forgot your password?
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
