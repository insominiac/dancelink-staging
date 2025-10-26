'use client'

import { useState, useEffect } from 'react'

interface HostUser {
  id: string
  email: string
  fullName: string
  phone?: string
  createdAt: string
}

interface Host {
  id: string
  businessName: string
  businessType: string
  description?: string
  country: string
  city: string
  experienceYears?: number
  applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
  rejectionReason?: string
  isApproved: boolean
  approvedAt?: string
  createdAt: string
  updatedAt: string
  user: HostUser
  approvedBy?: {
    fullName: string
  }
  stats: {
    totalVenues: number
    totalClasses: number
    totalEvents: number
    totalBookings: number
    totalRevenue: number
  }
}

interface HostDetails extends Host {
  venues: any[]
  classes: any[]
  events: any[]
  recentActivity: any[]
}

export default function HostManagement() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [selectedHost, setSelectedHost] = useState<HostDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    city: ''
  })
  const [statusStats, setStatusStats] = useState<Record<string, number>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchHosts()
  }, [activeTab, currentPage, filters])

  const fetchHosts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })
      
      if (activeTab !== 'all') {
        params.set('status', activeTab.toUpperCase())
      }
      
      if (filters.search) params.set('search', filters.search)
      if (filters.country) params.set('country', filters.country)
      if (filters.city) params.set('city', filters.city)

      const response = await fetch(`/api/admin/hosts?${params}`)
      if (!response.ok) throw new Error('Failed to fetch hosts')

      const data = await response.json()
      setHosts(data.hosts)
      setStatusStats(data.statusStats)
      setTotalPages(Math.ceil(data.pagination.totalPages))
    } catch (error) {
      console.error('Error fetching hosts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchHostDetails = async (hostId: string) => {
    setIsLoadingDetails(true)
    try {
      const response = await fetch(`/api/admin/hosts/${hostId}`)
      if (!response.ok) throw new Error('Failed to fetch host details')

      const data = await response.json()
      setSelectedHost(data.host)
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Error fetching host details:', error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleHostAction = async (hostId: string, action: 'approve' | 'reject' | 'suspend' | 'reactivate', reason?: string) => {
    try {
      const response = await fetch(`/api/admin/hosts/${hostId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejectionReason: reason })
      })

      if (!response.ok) throw new Error(`Failed to ${action} host`)

      const data = await response.json()
      
      // Update hosts list
      setHosts(prevHosts => 
        prevHosts.map(host => 
          host.id === hostId ? { ...host, ...data.host } : host
        )
      )

      // Update selected host if modal is open
      if (selectedHost?.id === hostId) {
        setSelectedHost(prevHost => prevHost ? { ...prevHost, ...data.host } : null)
      }

      // Close modals
      setShowRejectModal(false)
      setRejectionReason('')
      
      alert(`Host ${action}ed successfully!`)
      
      // Refresh to update counts
      fetchHosts()
    } catch (error) {
      console.error(`Error ${action}ing host:`, error)
      alert(`Failed to ${action} host`)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'SUSPENDED': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const tabCounts = {
    pending: statusStats['PENDING'] || 0,
    approved: statusStats['APPROVED'] || 0,
    rejected: statusStats['REJECTED'] || 0,
    suspended: statusStats['SUSPENDED'] || 0,
    all: Object.values(statusStats).reduce((sum, count) => sum + count, 0)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Host Management</h2>
        <div className="flex space-x-2">
          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Countries</option>
            {/* Add country options dynamically */}
          </select>
          <input
            type="text"
            placeholder="Search hosts..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'pending', label: 'Pending Applications', count: tabCounts.pending },
            { id: 'approved', label: 'Approved Hosts', count: tabCounts.approved },
            { id: 'rejected', label: 'Rejected', count: tabCounts.rejected },
            { id: 'suspended', label: 'Suspended', count: tabCounts.suspended },
            { id: 'all', label: 'All Hosts', count: tabCounts.all }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setCurrentPage(1)
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Hosts Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {hosts.map((host) => (
                    <tr key={host.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{host.businessName}</div>
                          <div className="text-xs text-gray-500">{host.businessType}</div>
                          {host.experienceYears && (
                            <div className="text-xs text-gray-400">{host.experienceYears} years experience</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900">{host.user.fullName}</div>
                          <div className="text-xs text-gray-500">{host.user.email}</div>
                          {host.user.phone && (
                            <div className="text-xs text-gray-400">{host.user.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{host.city}</div>
                        <div className="text-xs text-gray-500">{host.country}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {host.stats.totalVenues}V • {host.stats.totalClasses}C • {host.stats.totalEvents}E
                        </div>
                        <div className="text-xs text-gray-500">{host.stats.totalBookings} bookings</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          ${host.stats.totalRevenue.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(host.applicationStatus)}`}>
                          {host.applicationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(host.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => fetchHostDetails(host.id)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                            disabled={isLoadingDetails}
                          >
                            {isLoadingDetails ? 'Loading...' : 'View'}
                          </button>
                          
                          {host.applicationStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleHostAction(host.id, 'approve')}
                                className="text-green-600 hover:text-green-900 text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedHost(host as HostDetails)
                                  setShowRejectModal(true)
                                }}
                                className="text-red-600 hover:text-red-900 text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          
                          {host.applicationStatus === 'APPROVED' && (
                            <button
                              onClick={() => {
                                setSelectedHost(host as HostDetails)
                                setShowRejectModal(true)
                              }}
                              className="text-orange-600 hover:text-orange-900 text-sm"
                            >
                              Suspend
                            </button>
                          )}
                          
                          {(host.applicationStatus === 'SUSPENDED' || host.applicationStatus === 'REJECTED') && (
                            <button
                              onClick={() => handleHostAction(host.id, 'reactivate')}
                              className="text-green-600 hover:text-green-900 text-sm"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Host Details Modal */}
      {showDetailsModal && selectedHost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedHost.businessName}</h3>
                  <p className="text-gray-600">{selectedHost.businessType} • {selectedHost.city}, {selectedHost.country}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeColor(selectedHost.applicationStatus)}`}>
                    {selectedHost.applicationStatus}
                  </span>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Business Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Business Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Owner:</span> {selectedHost.user.fullName}</p>
                    <p><span className="font-medium">Email:</span> {selectedHost.user.email}</p>
                    {selectedHost.user.phone && <p><span className="font-medium">Phone:</span> {selectedHost.user.phone}</p>}
                    <p><span className="font-medium">Location:</span> {selectedHost.city}, {selectedHost.country}</p>
                    {selectedHost.experienceYears && <p><span className="font-medium">Experience:</span> {selectedHost.experienceYears} years</p>}
                    <p><span className="font-medium">Applied:</span> {new Date(selectedHost.createdAt).toLocaleDateString()}</p>
                    {selectedHost.approvedAt && <p><span className="font-medium">Approved:</span> {new Date(selectedHost.approvedAt).toLocaleDateString()}</p>}
                    {selectedHost.approvedBy && <p><span className="font-medium">Approved by:</span> {selectedHost.approvedBy.fullName}</p>}
                  </div>
                  
                  {selectedHost.description && (
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Description</h5>
                      <p className="text-sm text-gray-600">{selectedHost.description}</p>
                    </div>
                  )}
                  
                  {selectedHost.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <h5 className="font-medium text-red-800 mb-1">Rejection/Suspension Reason</h5>
                      <p className="text-sm text-red-700">{selectedHost.rejectionReason}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="text-2xl font-bold text-blue-600">{selectedHost.stats.totalVenues}</div>
                      <div className="text-sm text-blue-700">Venues</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="text-2xl font-bold text-green-600">{selectedHost.stats.totalClasses}</div>
                      <div className="text-sm text-green-700">Classes</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="text-2xl font-bold text-purple-600">{selectedHost.stats.totalEvents}</div>
                      <div className="text-sm text-purple-700">Events</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                      <div className="text-2xl font-bold text-orange-600">{selectedHost.stats.totalBookings}</div>
                      <div className="text-sm text-orange-700">Bookings</div>
                    </div>
                  </div>
                  <div className="mt-4 bg-green-50 p-3 rounded">
                    <div className="text-3xl font-bold text-green-600">${selectedHost.stats.totalRevenue.toFixed(2)}</div>
                    <div className="text-sm text-green-700">Total Revenue</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                {selectedHost.applicationStatus === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleHostAction(selectedHost.id, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve Application
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject Application
                    </button>
                  </>
                )}
                
                {selectedHost.applicationStatus === 'APPROVED' && (
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                  >
                    Suspend Host
                  </button>
                )}
                
                {(selectedHost.applicationStatus === 'SUSPENDED' || selectedHost.applicationStatus === 'REJECTED') && (
                  <button
                    onClick={() => handleHostAction(selectedHost.id, 'reactivate')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Reactivate Host
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject/Suspend Modal */}
      {showRejectModal && selectedHost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {selectedHost.applicationStatus === 'PENDING' ? 'Reject Application' : 'Suspend Host'}
              </h3>
              <p className="text-gray-600 mb-4">
                Please provide a reason for {selectedHost.applicationStatus === 'PENDING' ? 'rejecting' : 'suspending'} {selectedHost.businessName}:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter reason..."
                required
              />
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectionReason('')
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const action = selectedHost.applicationStatus === 'PENDING' ? 'reject' : 'suspend'
                    handleHostAction(selectedHost.id, action, rejectionReason)
                  }}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {selectedHost.applicationStatus === 'PENDING' ? 'Reject' : 'Suspend'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}