'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/lib/auth-context'
import { useRouter } from 'next/navigation'

interface HostProfile {
  id: string
  businessName: string
  businessType: string
  description?: string
  country: string
  city: string
  applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  rejectionReason?: string
  approvedAt?: string
  isApproved: boolean
}

interface HostStats {
  totalVenues: number
  totalClasses: number
  totalEvents: number
  pendingApprovals: number
  totalBookings: number
  monthlyRevenue: number
}

export default function HostDashboard() {
  const [hostProfile, setHostProfile] = useState<HostProfile | null>(null)
  const [stats, setStats] = useState<HostStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'HOST')) {
      router.push('/become-a-host')
      return
    }

    if (user && user.role === 'HOST') {
      fetchHostData()
    }
  }, [user, authLoading, router])

  const fetchHostData = async () => {
    try {
      setLoading(true)
      const [profileResponse, statsResponse] = await Promise.all([
        fetch('/api/host/profile'),
        fetch('/api/host/stats')
      ])

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setHostProfile(profileData.host)
      } else {
        throw new Error('Failed to fetch host profile')
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
    } catch (err) {
      console.error('Error fetching host data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
          <button 
            onClick={fetchHostData}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!hostProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Host profile not found</p>
        </div>
      </div>
    )
  }

  // Show application status for non-approved hosts
  if (!hostProfile.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {hostProfile.applicationStatus === 'PENDING' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Under Review</h1>
                <p className="text-gray-600 mb-6">
                  Thank you for applying to become a host! Your application is currently being reviewed by our admin team. 
                  You'll receive an email notification once your application is approved.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Admin team reviews your application</li>
                    <li>• You'll be notified via email when approved</li>
                    <li>• Once approved, you can create venues, classes, and events</li>
                  </ul>
                </div>
              </>
            )}
            
            {hostProfile.applicationStatus === 'REJECTED' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Approved</h1>
                <p className="text-gray-600 mb-4">
                  Unfortunately, your host application was not approved.
                </p>
                {hostProfile.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-medium text-red-900 mb-2">Reason:</h3>
                    <p className="text-sm text-red-700">{hostProfile.rejectionReason}</p>
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  You can contact our support team if you have questions about this decision.
                </p>
              </>
            )}

            {hostProfile.applicationStatus === 'SUSPENDED' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⛔</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Suspended</h1>
                <p className="text-gray-600 mb-6">
                  Your host account has been temporarily suspended. Please contact our support team for more information.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Main dashboard for approved hosts
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          DanceLink — host your events and classes
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your dance academy, venues, classes, and events
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Venues</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVenues}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">🎪</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-full">
                <span className="text-2xl">🎟️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <a 
              href="/host/venues/new"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <span className="text-2xl mr-4">🏢</span>
              <div>
                <p className="font-medium text-blue-900">Create Venue</p>
                <p className="text-xs text-blue-700">Add a new location for classes and events</p>
              </div>
            </a>
            
            <a 
              href="/host/classes/new"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <span className="text-2xl mr-4">📚</span>
              <div>
                <p className="font-medium text-green-900">Create Class</p>
                <p className="text-xs text-green-700">Set up a new dance class</p>
              </div>
            </a>
            
            <a 
              href="/host/events/new"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
            >
              <span className="text-2xl mr-4">🎪</span>
              <div>
                <p className="font-medium text-purple-900">Create Event</p>
                <p className="text-xs text-purple-700">Schedule a workshop or performance</p>
              </div>
            </a>

            <a 
              href="/host/academies/new"
              className="flex items-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
            >
              <span className="text-2xl mr-4">🏫</span>
              <div>
                <p className="font-medium text-amber-900">Create Academy</p>
                <p className="text-xs text-amber-700">Upload your academy profile for approval</p>
              </div>
            </a>

            <a 
              href="/host/competitions/new"
              className="flex items-center p-4 bg-rose-50 rounded-lg hover:bg-rose-100 transition"
            >
              <span className="text-2xl mr-4">🏆</span>
              <div>
                <p className="font-medium text-rose-900">Request Competition</p>
                <p className="text-xs text-rose-700">Organise a competition (admin approval)</p>
              </div>
            </a>
          </div>
        </div>

        {/* Management Links */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Manage Your Academy</h2>
          </div>
          <div className="p-6 space-y-4">
            <a 
              href="/host/venues"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-2xl mr-4">🏢</span>
              <div>
                <p className="font-medium text-gray-900">Venues</p>
                <p className="text-xs text-gray-600">Manage your locations</p>
              </div>
            </a>
            
            <a 
              href="/host/classes"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-2xl mr-4">📚</span>
              <div>
                <p className="font-medium text-gray-900">Classes</p>
                <p className="text-xs text-gray-600">View and edit your classes</p>
              </div>
            </a>
            
            <a 
              href="/host/events"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-2xl mr-4">🎪</span>
              <div>
                <p className="font-medium text-gray-900">Events</p>
                <p className="text-xs text-gray-600">Manage workshops and performances</p>
              </div>
            </a>

            <a 
              href="/host/academies"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-2xl mr-4">🏫</span>
              <div>
                <p className="font-medium text-gray-900">Academies</p>
                <p className="text-xs text-gray-600">Manage academy profiles</p>
              </div>
            </a>

            <a 
              href="/host/competitions"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-2xl mr-4">🏆</span>
              <div>
                <p className="font-medium text-gray-900">Competitions</p>
                <p className="text-xs text-gray-600">Requests and approval status</p>
              </div>
            </a>
            
            <a 
              href="/host/bookings"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <span className="text-2xl mr-4">🎟️</span>
              <div>
                <p className="font-medium text-gray-900">Bookings</p>
                <p className="text-xs text-gray-600">View student bookings</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Admin Approval Notice */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-amber-500">ℹ️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Content Approval Process
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                All venues, classes, and events you create require admin approval before being published to students. 
                You'll be notified once your content is reviewed and approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}