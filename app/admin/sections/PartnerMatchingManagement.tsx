'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Activity, 
  Search,
  Filter,
  ChevronDown,
  Eye,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Check,
  X,
  AlertTriangle,
  Edit,
  Trash2,
  Ban,
  CheckCircle
} from 'lucide-react';

interface Profile {
  id: string;
  bio: string;
  location: string;
  experienceLevel: string;
  isActiveForMatching: boolean;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    profileImage?: string;
  };
  danceStyles: Array<{
    level: string;
    style: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    sentRequests: number;
    receivedRequests: number;
  };
}

interface MatchRequest {
  id: string;
  status: string;
  message?: string;
  createdAt: string;
  respondedAt?: string;
  sender: {
    id: string;
    user: {
      fullName: string;
      email: string;
      role: string;
    };
  };
  receiver: {
    id: string;
    user: {
      fullName: string;
      email: string;
      role: string;
    };
  };
}

interface Match {
  id: string;
  matchScore: number;
  isActive: boolean;
  createdAt: string;
  user1: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  user2: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

interface Stats {
  overview: {
    totalProfiles: number;
    activeProfiles: number;
    totalRequests: number;
    pendingRequests: number;
    acceptedRequests: number;
    rejectedRequests: number;
    totalMatches: number;
    activeMatches: number;
    recentRequests: number;
    recentMatches: number;
  };
  distributions: {
    experienceLevel: Array<{
      experienceLevel: string;
      _count: { experienceLevel: number };
    }>;
    locations: Array<{
      location: string;
      _count: { location: number };
    }>;
    danceStyles: Array<{
      styleId: string;
      name: string;
      _count: { styleId: number };
    }>;
  };
  matchSuccessRate: number;
  profileUtilization: number;
}

export default function PartnerMatchingManagement() {
  const [activeTab, setActiveTab] = useState('stats');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    experienceLevel: '',
    status: '',
    isActive: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'stats':
          const statsResponse = await fetch('/api/admin/partner-matching/stats');
          const statsData = await statsResponse.json();
          if (statsData.success) {
            setStats(statsData.data);
          }
          break;
          
        case 'profiles':
          const profilesResponse = await fetch(`/api/admin/partner-matching/profiles?search=${searchTerm}&experienceLevel=${filters.experienceLevel}&isActive=${filters.isActive}`);
          const profilesData = await profilesResponse.json();
          if (profilesData.success) {
            setProfiles(profilesData.data.profiles);
          }
          break;
          
        case 'requests':
          const requestsResponse = await fetch(`/api/admin/partner-matching/requests?search=${searchTerm}&status=${filters.status}`);
          const requestsData = await requestsResponse.json();
          if (requestsData.success) {
            setRequests(requestsData.data.requests);
          }
          break;
          
        case 'matches':
          const matchesResponse = await fetch(`/api/admin/partner-matching/matches?search=${searchTerm}&isActive=${filters.isActive}`);
          const matchesData = await matchesResponse.json();
          if (matchesData.success) {
            setMatches(matchesData.data.matches);
          }
          break;
      }
    } catch (error) {
      console.error('Error loading partner matching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Admin Actions
  const updateRequestStatus = async (requestId: string, status: string, adminNotes?: string) => {
    try {
      const response = await fetch(`/api/admin/partner-matching/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, adminNotes })
      });
      
      const data = await response.json();
      if (data.success) {
        // Reload requests to reflect changes
        if (activeTab === 'requests') {
          loadData();
        }
        alert(`Request ${status.toLowerCase()} successfully!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status');
    }
  };

  const updateProfileStatus = async (profileId: string, isActive: boolean, adminNotes?: string) => {
    try {
      const response = await fetch(`/api/admin/partner-matching/profiles/${profileId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActiveForMatching: isActive, adminNotes })
      });
      
      const data = await response.json();
      if (data.success) {
        // Reload profiles to reflect changes
        if (activeTab === 'profiles') {
          loadData();
        }
        alert(`Profile ${isActive ? 'activated' : 'deactivated'} successfully!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating profile status:', error);
      alert('Failed to update profile status');
    }
  };

  const updateMatchStatus = async (matchId: string, isActive: boolean, adminNotes?: string) => {
    try {
      const response = await fetch(`/api/admin/partner-matching/matches/${matchId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive, adminNotes })
      });
      
      const data = await response.json();
      if (data.success) {
        // Reload matches to reflect changes
        if (activeTab === 'matches') {
          loadData();
        }
        alert(`Match ${isActive ? 'activated' : 'deactivated'} successfully!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating match status:', error);
      alert('Failed to update match status');
    }
  };

  const deleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/partner-matching/requests/${requestId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        loadData();
        alert('Request deleted successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      EXPIRED: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getExperienceLevelBadge = (level: string) => {
    const levelStyles = {
      BEGINNER: 'bg-blue-100 text-blue-800',
      INTERMEDIATE: 'bg-purple-100 text-purple-800',
      ADVANCED: 'bg-orange-100 text-orange-800',
      PROFESSIONAL: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${levelStyles[level as keyof typeof levelStyles] || 'bg-gray-100 text-gray-800'}`}>
        {level}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, change }: { title: string; value: number | string; icon: any; change?: number }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Partner Matching Management</h2>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'stats', label: 'Overview & Stats', icon: Activity },
            { id: 'profiles', label: 'User Profiles', icon: Users },
            { id: 'requests', label: 'Match Requests', icon: MessageCircle },
            { id: 'matches', label: 'Active Matches', icon: Heart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Tab */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Profiles"
                  value={stats.overview.totalProfiles}
                  icon={Users}
                />
                <StatCard
                  title="Active Profiles"
                  value={stats.overview.activeProfiles}
                  icon={Activity}
                />
                <StatCard
                  title="Match Requests"
                  value={stats.overview.totalRequests}
                  icon={MessageCircle}
                />
                <StatCard
                  title="Successful Matches"
                  value={stats.overview.totalMatches}
                  icon={Heart}
                />
              </div>

              {/* Success Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Success Rate</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.matchSuccessRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {stats.overview.acceptedRequests} accepted out of {stats.overview.totalRequests} requests
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Utilization</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.profileUtilization.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {stats.overview.activeProfiles} active out of {stats.overview.totalProfiles} profiles
                  </p>
                </div>
              </div>

              {/* Distribution Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Experience Level Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience Level</h3>
                  <div className="space-y-3">
                    {stats.distributions.experienceLevel.map((item) => (
                      <div key={item.experienceLevel} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.experienceLevel}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ 
                                width: `${(item._count.experienceLevel / stats.overview.totalProfiles) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{item._count.experienceLevel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Locations */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
                  <div className="space-y-3">
                    {stats.distributions.locations.slice(0, 5).map((item) => (
                      <div key={item.location} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{item.location}</span>
                        <span className="text-sm font-medium">{item._count.location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Dance Styles */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Dance Styles</h3>
                  <div className="space-y-3">
                    {stats.distributions.danceStyles.slice(0, 5).map((item) => (
                      <div key={item.styleId} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <span className="text-sm font-medium">{item._count.styleId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profiles Tab */}
          {activeTab === 'profiles' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search profiles..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadData()}
                    />
                  </div>
                </div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                >
                  <option value="">All Experience Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="PROFESSIONAL">Professional</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.isActive}
                  onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                >
                  <option value="">All Profiles</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>

              {/* Profiles Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dance Styles</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {profiles.map((profile) => (
                      <tr key={profile.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={profile.user.profileImage || '/api/placeholder/40/40'}
                              alt={profile.user.fullName}
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{profile.user.fullName}</div>
                              <div className="text-sm text-gray-500">{profile.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getExperienceLevelBadge(profile.experienceLevel)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {profile.location || 'Not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {profile.danceStyles.slice(0, 3).map((style, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                              >
                                {style.style.name}
                              </span>
                            ))}
                            {profile.danceStyles.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                +{profile.danceStyles.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>Sent: {profile._count.sentRequests}</div>
                            <div>Received: {profile._count.receivedRequests}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            profile.isActiveForMatching 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {profile.isActiveForMatching ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateProfileStatus(
                                profile.id, 
                                !profile.isActiveForMatching,
                                `Status changed by admin on ${new Date().toLocaleDateString()}`
                              )}
                              className={`p-2 rounded-lg transition-colors ${
                                profile.isActiveForMatching
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={profile.isActiveForMatching ? 'Deactivate profile' : 'Activate profile'}
                            >
                              {profile.isActiveForMatching ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => {
                                const notes = prompt('Add admin notes (optional):');
                                if (notes !== null) {
                                  updateProfileStatus(profile.id, profile.isActiveForMatching, notes);
                                }
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Add notes"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Match Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search match requests..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadData()}
                    />
                  </div>
                </div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="EXPIRED">Expired</option>
                </select>
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>

              {/* Match Requests Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.sender.user.fullName}</div>
                            <div className="text-sm text-gray-500">{request.sender.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.receiver.user.fullName}</div>
                            <div className="text-sm text-gray-500">{request.receiver.user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {request.message || 'No message'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {request.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => updateRequestStatus(request.id, 'ACCEPTED', 'Approved by admin')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Accept request"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => updateRequestStatus(request.id, 'REJECTED', 'Rejected by admin')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject request"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                const notes = prompt('Add admin notes:', request.message || '');
                                if (notes !== null) {
                                  updateRequestStatus(request.id, request.status, notes);
                                }
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit notes"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteRequest(request.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete request"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Matches Tab */}
          {activeTab === 'matches' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search matches..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadData()}
                    />
                  </div>
                </div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.isActive}
                  onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                >
                  <option value="">All Matches</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>

              {/* Matches Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partners</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matched Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map((match) => (
                      <tr key={match.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{match.user1.fullName}</div>
                              <div className="text-sm text-gray-500">{match.user1.email}</div>
                            </div>
                            <Heart className="h-4 w-4 text-red-500" />
                            <div className="text-center">
                              <div className="text-sm font-medium text-gray-900">{match.user2.fullName}</div>
                              <div className="text-sm text-gray-500">{match.user2.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium">
                              {(match.matchScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            match.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {match.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(match.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateMatchStatus(
                                match.id, 
                                !match.isActive,
                                `Status changed by admin on ${new Date().toLocaleDateString()}`
                              )}
                              className={`p-2 rounded-lg transition-colors ${
                                match.isActive
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={match.isActive ? 'Deactivate match' : 'Activate match'}
                            >
                              {match.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => {
                                const notes = prompt('Add admin notes (optional):');
                                if (notes !== null) {
                                  updateMatchStatus(match.id, match.isActive, notes);
                                }
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Add notes"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}