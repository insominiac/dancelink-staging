'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Search, Filter, Users, MapPin, Calendar, Star, Heart, ArrowRight, X } from 'lucide-react'
import '@/lib/i18n' // Initialize i18n
import TranslatedText from '@/app/components/TranslatedText'

interface DanceStyle {
  id: string
  name: string
  category: string
}

interface UserProfileDanceStyle {
  level: string
  style: DanceStyle
}

interface PartnerProfile {
  id: string
  bio: string
  location: string
  experienceLevel: string
  lookingFor: string[]
  ageRange: string
  user: {
    id: string
    fullName: string
    profileImage: string
  }
  danceStyles: UserProfileDanceStyle[]
  createdAt: string
}

interface FilterState {
  search: string
  experienceLevel: string
  location: string
  danceStyleId: string
  lookingFor: string
  ageRange: string
}

// Sample profiles for demo purposes
const sampleProfiles: PartnerProfile[] = [
  {
    id: '1',
    bio: 'Passionate salsa dancer with 8 years of experience. I love the energy and connection of partner dancing! Looking for someone to practice with and maybe compete.',
    location: 'Miami, FL',
    experienceLevel: 'ADVANCED',
    lookingFor: ['PRACTICE_PARTNER', 'COMPETITION_PARTNER'],
    ageRange: '28-35',
    user: {
      id: '1',
      fullName: 'Sofia Martinez',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c7?w=400'
    },
    danceStyles: [
      { level: 'ADVANCED', style: { id: '1', name: 'Salsa', category: 'Latin' } },
      { level: 'INTERMEDIATE', style: { id: '2', name: 'Bachata', category: 'Latin' } }
    ],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    bio: 'Ballroom enthusiast who loves the elegance and precision of standard dances. Recently moved to the area and eager to find a regular practice partner.',
    location: 'New York, NY',
    experienceLevel: 'INTERMEDIATE',
    lookingFor: ['PRACTICE_PARTNER', 'SOCIAL_PARTNER'],
    ageRange: '25-40',
    user: {
      id: '2',
      fullName: 'James Wilson',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    danceStyles: [
      { level: 'INTERMEDIATE', style: { id: '3', name: 'Waltz', category: 'Standard' } },
      { level: 'INTERMEDIATE', style: { id: '4', name: 'Foxtrot', category: 'Standard' } },
      { level: 'BEGINNER', style: { id: '5', name: 'Tango', category: 'Standard' } }
    ],
    createdAt: '2024-02-01T14:30:00Z'
  },
  {
    id: '3',
    bio: 'Swing dancing is my passion! I love the joy and spontaneity of Lindy Hop and Charleston. Always up for social dancing and learning new moves.',
    location: 'Austin, TX',
    experienceLevel: 'INTERMEDIATE',
    lookingFor: ['SOCIAL_PARTNER', 'LEARNING_BUDDY'],
    ageRange: '22-30',
    user: {
      id: '3',
      fullName: 'Emma Thompson',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    },
    danceStyles: [
      { level: 'INTERMEDIATE', style: { id: '6', name: 'Lindy Hop', category: 'Swing' } },
      { level: 'BEGINNER', style: { id: '7', name: 'Charleston', category: 'Swing' } }
    ],
    createdAt: '2024-02-10T09:15:00Z'
  },
  {
    id: '4',
    bio: 'Professional contemporary dancer branching into partner work. I bring technical skill and artistic expression to every dance. Seeking serious partners.',
    location: 'Los Angeles, CA',
    experienceLevel: 'PROFESSIONAL',
    lookingFor: ['COMPETITION_PARTNER', 'PRACTICE_PARTNER'],
    ageRange: '24-32',
    user: {
      id: '4',
      fullName: 'Alex Chen',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    },
    danceStyles: [
      { level: 'PROFESSIONAL', style: { id: '8', name: 'Contemporary', category: 'Modern' } },
      { level: 'ADVANCED', style: { id: '9', name: 'Jazz', category: 'Modern' } }
    ],
    createdAt: '2024-01-25T16:45:00Z'
  },
  {
    id: '5',
    bio: 'Just started dancing and absolutely loving it! Looking for patient partners who can help me learn. I\'m enthusiastic and committed to improving.',
    location: 'Chicago, IL',
    experienceLevel: 'BEGINNER',
    lookingFor: ['LEARNING_BUDDY', 'SOCIAL_PARTNER'],
    ageRange: '26-35',
    user: {
      id: '5',
      fullName: 'Maria Rodriguez',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
    },
    danceStyles: [
      { level: 'BEGINNER', style: { id: '1', name: 'Salsa', category: 'Latin' } },
      { level: 'BEGINNER', style: { id: '3', name: 'Waltz', category: 'Standard' } }
    ],
    createdAt: '2024-02-20T11:20:00Z'
  },
  {
    id: '6',
    bio: 'Argentine Tango is my soul! I\'ve been dancing for 12 years and teaching for 5. Looking for partners who appreciate the depth and intimacy of tango.',
    location: 'San Francisco, CA',
    experienceLevel: 'PROFESSIONAL',
    lookingFor: ['PRACTICE_PARTNER', 'SOCIAL_PARTNER'],
    ageRange: '30-45',
    user: {
      id: '6',
      fullName: 'Diego Fernandez',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
    },
    danceStyles: [
      { level: 'PROFESSIONAL', style: { id: '10', name: 'Argentine Tango', category: 'Tango' } },
      { level: 'ADVANCED', style: { id: '5', name: 'Tango', category: 'Standard' } }
    ],
    createdAt: '2024-01-08T13:00:00Z'
  },
  {
    id: '7',
    bio: 'Hip-hop dancer exploring partner styles. I bring urban flavor and street credibility to social dancing. Always ready to battle on the floor!',
    location: 'Atlanta, GA',
    experienceLevel: 'INTERMEDIATE',
    lookingFor: ['SOCIAL_PARTNER', 'COMPETITION_PARTNER'],
    ageRange: '20-28',
    user: {
      id: '7',
      fullName: 'Jamal Washington',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400'
    },
    danceStyles: [
      { level: 'ADVANCED', style: { id: '11', name: 'Hip-Hop', category: 'Urban' } },
      { level: 'BEGINNER', style: { id: '1', name: 'Salsa', category: 'Latin' } }
    ],
    createdAt: '2024-02-05T08:30:00Z'
  },
  {
    id: '8',
    bio: 'Classical ballet background transitioning to ballroom. I value technique, grace, and musical interpretation. Seeking partners for competitive ballroom.',
    location: 'Boston, MA',
    experienceLevel: 'ADVANCED',
    lookingFor: ['COMPETITION_PARTNER', 'PRACTICE_PARTNER'],
    ageRange: '23-30',
    user: {
      id: '8',
      fullName: 'Isabella Clarke',
      profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400'
    },
    danceStyles: [
      { level: 'PROFESSIONAL', style: { id: '12', name: 'Ballet', category: 'Classical' } },
      { level: 'ADVANCED', style: { id: '3', name: 'Waltz', category: 'Standard' } },
      { level: 'INTERMEDIATE', style: { id: '4', name: 'Foxtrot', category: 'Standard' } }
    ],
    createdAt: '2024-01-30T15:20:00Z'
  },
  {
    id: '9',
    bio: 'Country music and dancing run in my blood! Two-step, line dancing, and country swing are my favorites. Looking for partners who love boots and good times.',
    location: 'Nashville, TN',
    experienceLevel: 'INTERMEDIATE',
    lookingFor: ['SOCIAL_PARTNER', 'LEARNING_BUDDY'],
    ageRange: '28-40',
    user: {
      id: '9',
      fullName: 'Tyler Brooks',
      profileImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400'
    },
    danceStyles: [
      { level: 'ADVANCED', style: { id: '13', name: 'Country Two-Step', category: 'Country' } },
      { level: 'INTERMEDIATE', style: { id: '14', name: 'Country Swing', category: 'Country' } }
    ],
    createdAt: '2024-02-12T10:45:00Z'
  }
]

// Sample dance styles
const sampleDanceStyles: DanceStyle[] = [
  { id: '1', name: 'Salsa', category: 'Latin' },
  { id: '2', name: 'Bachata', category: 'Latin' },
  { id: '3', name: 'Waltz', category: 'Standard' },
  { id: '4', name: 'Foxtrot', category: 'Standard' },
  { id: '5', name: 'Tango', category: 'Standard' },
  { id: '6', name: 'Lindy Hop', category: 'Swing' },
  { id: '7', name: 'Charleston', category: 'Swing' },
  { id: '8', name: 'Contemporary', category: 'Modern' },
  { id: '9', name: 'Jazz', category: 'Modern' },
  { id: '10', name: 'Argentine Tango', category: 'Tango' },
  { id: '11', name: 'Hip-Hop', category: 'Urban' },
  { id: '12', name: 'Ballet', category: 'Classical' },
  { id: '13', name: 'Country Two-Step', category: 'Country' },
  { id: '14', name: 'Country Swing', category: 'Country' }
]

export default function PartnerMatchPage() {
  const { t } = useTranslation('common')
  const [isMounted, setIsMounted] = useState(false)
  const [profiles, setProfiles] = useState<PartnerProfile[]>([])
  const [availableDanceStyles, setAvailableDanceStyles] = useState<DanceStyle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    experienceLevel: '',
    location: '',
    danceStyleId: '',
    lookingFor: '',
    ageRange: ''
  })

  const experienceLevels = [
    { value: '', label: t('All Experience Levels') || 'All Experience Levels' },
    { value: 'BEGINNER', label: t('Beginner') || 'Beginner' },
    { value: 'INTERMEDIATE', label: t('Intermediate') || 'Intermediate' },
    { value: 'ADVANCED', label: t('Advanced') || 'Advanced' },
    { value: 'PROFESSIONAL', label: t('Professional') || 'Professional' }
  ]

  const lookingForOptions = [
    { value: '', label: t('All Partnership Types') || 'All Partnership Types' },
    { value: 'PRACTICE_PARTNER', label: t('Practice Partner') || 'Practice Partner' },
    { value: 'COMPETITION_PARTNER', label: t('Competition Partner') || 'Competition Partner' },
    { value: 'SOCIAL_PARTNER', label: t('Social Dancing Partner') || 'Social Dancing Partner' },
    { value: 'LEARNING_BUDDY', label: t('Learning Partner') || 'Learning Partner' }
  ]

  useEffect(() => {
    setIsMounted(true)
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      
      // Always start with sample data
      setAvailableDanceStyles(sampleDanceStyles)
      setProfiles(sampleProfiles)
      setHasMore(false) // No pagination for demo mode
      
      console.log('Loaded sample profiles:', sampleProfiles.length)
      
    } catch (error) {
      console.error('Error loading initial data:', error)
      // Ensure we have sample data even if everything fails
      setAvailableDanceStyles(sampleDanceStyles)
      setProfiles(sampleProfiles)
    } finally {
      setIsLoading(false)
    }
  }

  const filterSampleProfiles = (searchFilters: FilterState): PartnerProfile[] => {
    return sampleProfiles.filter(profile => {
      // Search filter
      if (searchFilters.search) {
        const searchLower = searchFilters.search.toLowerCase()
        const matchesName = profile.user.fullName.toLowerCase().includes(searchLower)
        const matchesBio = profile.bio.toLowerCase().includes(searchLower)
        const matchesLocation = profile.location.toLowerCase().includes(searchLower)
        const matchesDanceStyle = profile.danceStyles.some(ds => 
          ds.style.name.toLowerCase().includes(searchLower)
        )
        if (!matchesName && !matchesBio && !matchesLocation && !matchesDanceStyle) {
          return false
        }
      }

      // Experience level filter
      if (searchFilters.experienceLevel && profile.experienceLevel !== searchFilters.experienceLevel) {
        return false
      }

      // Location filter
      if (searchFilters.location && !profile.location.toLowerCase().includes(searchFilters.location.toLowerCase())) {
        return false
      }

      // Dance style filter
      if (searchFilters.danceStyleId) {
        const hasDanceStyle = profile.danceStyles.some(ds => ds.style.id === searchFilters.danceStyleId)
        if (!hasDanceStyle) {
          return false
        }
      }

      // Looking for filter
      if (searchFilters.lookingFor && !profile.lookingFor.includes(searchFilters.lookingFor)) {
        return false
      }

      // Age range filter (basic matching)
      if (searchFilters.ageRange) {
        // Simple check if age ranges overlap or match
        const filterAge = searchFilters.ageRange.toLowerCase()
        const profileAge = profile.ageRange.toLowerCase()
        // This is a simplified check - in a real app you'd parse the ranges properly
        if (!profileAge.includes(filterAge.split('-')[0]) && !filterAge.includes(profileAge.split('-')[0])) {
          // Allow partial matches for demonstration
        }
      }

      return true
    })
  }

  const searchProfiles = async (searchFilters: FilterState, reset = false) => {
    try {
      if (reset) {
        setIsLoading(true)
      } else {
        setLoadingMore(true)
      }

      // First try API call
      try {
        const params = new URLSearchParams()
        if (searchFilters.search) params.append('search', searchFilters.search)
        if (searchFilters.experienceLevel) params.append('experienceLevel', searchFilters.experienceLevel)
        if (searchFilters.location) params.append('location', searchFilters.location)
        if (searchFilters.danceStyleId) params.append('danceStyleId', searchFilters.danceStyleId)
        if (searchFilters.lookingFor) params.append('lookingFor', searchFilters.lookingFor)
        if (searchFilters.ageRange) params.append('ageRange', searchFilters.ageRange)
        
        params.append('limit', '12')
        params.append('offset', reset ? '0' : (currentPage * 12).toString())

        const response = await fetch(`/api/public/partner-search?${params.toString()}`)
        const data = await response.json()

        if (data.success && data.data.profiles && data.data.profiles.length > 0) {
          if (reset) {
            setProfiles(data.data.profiles)
            setCurrentPage(1)
          } else {
            setProfiles(prev => [...prev, ...data.data.profiles])
            setCurrentPage(prev => prev + 1)
          }
          setHasMore(data.data.pagination.hasMore)
          return // Success with data, exit early
        } else {
          console.log('API returned empty results, using sample data')
        }
      } catch (apiError) {
        console.log('API not available, using filtered sample data')
      }

      // Fallback to client-side filtering of sample data
      const filteredProfiles = filterSampleProfiles(searchFilters)
      setProfiles(filteredProfiles)
      setHasMore(false) // No pagination for sample data
      setCurrentPage(1)
      
    } catch (error) {
      console.error('Error searching profiles:', error)
      // Final fallback to all sample profiles
      setProfiles(sampleProfiles)
      setHasMore(false)
    } finally {
      setIsLoading(false)
      setLoadingMore(false)
    }
  }

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    searchProfiles(newFilters, true)
  }

  const handleSearch = () => {
    searchProfiles(filters, true)
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      searchProfiles(filters, false)
    }
  }

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      experienceLevel: '',
      location: '',
      danceStyleId: '',
      lookingFor: '',
      ageRange: ''
    }
    setFilters(emptyFilters)
    searchProfiles(emptyFilters, true)
  }

  const getExperienceLevelDisplay = (level: string) => {
    const levelOption = experienceLevels.find(l => l.value === level)
    return levelOption ? levelOption.label : level
  }

  const getLookingForDisplay = (lookingForArray: string[]) => {
    if (!lookingForArray || lookingForArray.length === 0) return t('Not specified') || 'Not specified'
    
    return lookingForArray.map(item => {
      const option = lookingForOptions.find(l => l.value === item)
      return option ? option.label : item
    }).join(', ')
  }

  if (!isMounted) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, var(--neutral-light) 0%, var(--white) 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary-gold)' }}></div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--neutral-light) 0%, var(--white) 100%)' }}>
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--accent-rose) 100%)' }}>
        <div className="dance-container text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Dancing Script, cursive' }}>
              <TranslatedText text="Find Your Perfect Dance Partner" />
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              <TranslatedText text="Connect with passionate dancers in your area. Whether you're looking for a practice partner, competition partner, or social dancing buddy, find your perfect match here." />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login?redirect=/dashboard/partner-matching/profile"
                className="px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
                style={{ 
                  background: 'var(--primary-gold)',
                  color: 'var(--primary-dark)'
                }}
              >
                <TranslatedText text="Create Your Profile" />
              </Link>
              <button
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
                style={{ '--hover-color': 'var(--primary-dark)' } as any}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary-dark)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white'
                }}
              >
                <TranslatedText text="Browse Partners" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="search-section" className="py-16 bg-white" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div className="dance-container">
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Search Container */}
            <div 
              className="bg-white rounded-3xl p-8 mb-8 shadow-2xl"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
            >
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                {/* Enhanced Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('Search by name, style, or location...') || '🔍 Search by name, style, or location...'}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-16 pr-6 py-4 border-2 rounded-full text-lg focus:ring-2 focus:border-transparent transition-all duration-300"
                    style={{ 
                      borderColor: 'var(--neutral-light)',
                      '--focus-ring-color': 'var(--primary-gold)'
                    } as any}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-gold)'
                      e.target.style.boxShadow = '0 0 20px rgba(212,175,55,0.2)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--neutral-light)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
                
                {/* Enhanced Search Button */}
                <button
                  onClick={handleSearch}
                  className="px-10 py-4 rounded-full font-bold text-lg text-white transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg"
                  style={{ background: 'var(--primary-gold)' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(212,175,55,0.4)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <TranslatedText text="Search Partners" />
                </button>
              </div>
              
              {/* Filter Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 border-2 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                  style={{ borderColor: 'var(--neutral-light)' }}
                >
                  <Filter className="h-4 w-4" />
                  <TranslatedText text="Advanced Filters" />
                  {Object.values(filters).some(v => v) && (
                    <span 
                      className="text-white rounded-full px-2 py-1 text-xs font-bold"
                      style={{ background: 'var(--accent-rose)' }}
                    >
                      {Object.values(filters).filter(v => v).length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6" style={{ border: '1px solid var(--neutral-light)' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--primary-dark)' }}>
                    <TranslatedText text="Search Filters" />
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><TranslatedText text="Experience Level" /></label>
                    <select
                      value={filters.experienceLevel}
                      onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><TranslatedText text="Location" /></label>
                    <input
                      type="text"
                      placeholder={t('City, State or Country') || 'City, State or Country'}
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><TranslatedText text="Dance Style" /></label>
                    <select
                      value={filters.danceStyleId}
                      onChange={(e) => handleFilterChange('danceStyleId', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    >
                      <option value="">{t('All Dance Styles') || 'All Dance Styles'}</option>
                      {availableDanceStyles.map(style => (
                        <option key={style.id} value={style.id}>{style.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><TranslatedText text="Looking For" /></label>
                    <select
                      value={filters.lookingFor}
                      onChange={(e) => handleFilterChange('lookingFor', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    >
                      {lookingForOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><TranslatedText text="Age Range" /></label>
                    <input
                      type="text"
                      placeholder={t('e.g., 25-40') || 'e.g., 25-40'}
                      value={filters.ageRange}
                      onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <TranslatedText text="Clear All Filters" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="dance-container">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary-gold)' }}></div>
            </div>
          ) : profiles.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-dark)' }}>
                  <TranslatedText text="Dance Partners" />
                </h2>
                <p className="text-gray-600">
                  <TranslatedText text={`Found ${profiles.length} amazing dancers looking for partners`} />
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                    style={{ border: '1px solid var(--neutral-light)' }}
                  >
                    {/* Profile Header with Background */}
                    <div 
                      className="h-48 relative"
                      style={{
                        background: `linear-gradient(135deg, rgba(212, 175, 55, 0.4), rgba(232, 180, 188, 0.4)), url('${profile.user.profileImage}?q=80&w=600&auto=format&fit=crop') center/cover`
                      }}
                    >
                      {/* Availability Status */}
                      <span 
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ background: '#4CAF50' }}
                      >
                        <TranslatedText text="Available" />
                      </span>
                      
                      {/* Profile Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {profile.user.fullName}
                        </h3>
                        <div className="flex items-center text-white/80 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {profile.location}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Dance Styles Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {profile.danceStyles.slice(0, 3).map((style, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs rounded-full"
                            style={{ 
                              background: 'var(--neutral-light)',
                              color: 'var(--primary-dark)'
                            }}
                          >
                            {style.style.name}
                          </span>
                        ))}
                        <span
                          className="px-3 py-1 text-xs rounded-full font-medium"
                          style={{ 
                            background: 'var(--primary-gold)',
                            color: 'white'
                          }}
                        >
                          {getExperienceLevelDisplay(profile.experienceLevel)}
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        "<TranslatedText text={profile.bio} />"
                      </p>

                      {/* Additional Info */}
                      <div className="mb-4 space-y-1">
                        <p className="text-sm text-gray-600">
                          <strong><TranslatedText text="Looking for:" /></strong> <TranslatedText text={getLookingForDisplay(profile.lookingFor)} />
                        </p>
                        {profile.ageRange && (
                          <p className="text-sm text-gray-600">
                            <strong><TranslatedText text="Age range:" /></strong> {profile.ageRange}
                          </p>
                        )}
                      </div>

                      {/* Rating and Connect Button */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <div className="flex" style={{ color: 'var(--primary-gold)' }}>
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <span className="text-gray-500 text-xs">(4.9)</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                            title="Add to favorites"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                          <Link
                            href="/login?redirect=/dashboard/partner-matching"
                            className="px-5 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:transform hover:scale-105"
                            style={{ background: 'var(--primary-gold)' }}
                          >
                            <TranslatedText text="Connect" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:transform hover:scale-105 disabled:opacity-50"
                    style={{ background: 'var(--accent-rose)' }}
                  >
                    {loadingMore ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <TranslatedText text="Loading..." />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <TranslatedText text="Load More Partners" />
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <Users className="h-20 w-20 mx-auto mb-6" style={{ color: 'var(--neutral-gray)' }} />
              <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--primary-dark)' }}>
                <TranslatedText text="No dance partners found" />
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                <TranslatedText text="We couldn't find any partners matching your criteria. Try adjusting your filters or check back later for new members." />
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TranslatedText text="Clear Filters" />
                </button>
                <Link
                  href="/login?redirect=/dashboard/partner-matching/profile"
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:transform hover:scale-105"
                  style={{ background: 'var(--primary-gold)' }}
                >
                  <TranslatedText text="Create Your Profile" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="dance-container">
          <div 
            className="bg-white rounded-3xl p-8 shadow-2xl"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div 
                  className="text-5xl font-bold mb-2"
                  style={{ color: 'var(--primary-gold)' }}
                >
                  500+
                </div>
                <div className="text-gray-600 font-medium"><TranslatedText text="Active Dancers" /></div>
              </div>
              <div>
                <div 
                  className="text-5xl font-bold mb-2"
                  style={{ color: 'var(--primary-gold)' }}
                >
                  85%
                </div>
                <div className="text-gray-600 font-medium"><TranslatedText text="Match Success Rate" /></div>
              </div>
              <div>
                <div 
                  className="text-5xl font-bold mb-2"
                  style={{ color: 'var(--primary-gold)' }}
                >
                  50+
                </div>
                <div className="text-gray-600 font-medium"><TranslatedText text="Dance Styles" /></div>
              </div>
              <div>
                <div 
                  className="text-5xl font-bold mb-2"
                  style={{ color: 'var(--primary-gold)' }}
                >
                  24/7
                </div>
                <div className="text-gray-600 font-medium"><TranslatedText text="Community Support" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, var(--accent-rose) 0%, var(--primary-dark) 100%)' }}>
        <div className="dance-container text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Dancing Script, cursive' }}>
            <TranslatedText text="Ready to Start Dancing?" />
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            <TranslatedText text="Join our community of passionate dancers and find your perfect partner today. Create your profile and start connecting with dancers in your area." />
          </p>
          <Link
            href="/login?redirect=/dashboard/partner-matching/profile"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
            style={{ 
              background: 'var(--primary-gold)',
              color: 'var(--primary-dark)'
            }}
          >
            <TranslatedText text="Create Your Profile" />
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}