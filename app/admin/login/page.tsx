'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminTokenLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  // Auto-attempt login if a token is present in the URL
  useEffect(() => {
    const t = searchParams.get('token')
    if (t) {
      setToken(t)
      void handleTokenLogin(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTokenLogin = async (t: string) => {
    if (!t) {
      setError('Please enter a token')
      return
    }
    setError('')
    setInfo('')
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/admin-token-login/${encodeURIComponent(t)}`, {
        method: 'POST'
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) {
        setError(data?.error || 'Token login failed')
        setLoading(false)
        return
      }
      // Success: redirect to admin dashboard
      router.push('/admin')
    } catch (e) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleTokenLogin(token.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">👑</div>
          <h1 className="text-2xl font-bold">Admin Token Login</h1>
          <p className="text-sm text-gray-600 mt-1">Enter your one-time admin token to access the dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}
        {info && (
          <div className="mb-4 p-3 rounded bg-blue-50 border border-blue-200 text-blue-700 text-sm">{info}</div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">Admin Token</label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token here (e.g., XyZ123...)"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in with Token'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            You can also open this page as /admin/login?token=YOUR_TOKEN
          </p>
        </form>
      </div>
    </div>
  )
}
