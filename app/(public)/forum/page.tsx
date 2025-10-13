'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/app/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Eye, MessageCircle, Pin, Lock, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import TranslatedText from '../../components/TranslatedText'
import '@/lib/i18n'
// import LoginModal from '@/app/components/LoginModal' // Disabled for public browsing

// Sample forum posts for demo
const samplePosts = [
  {
    id: '1',
    title: 'Best beginner-friendly salsa moves?',
    content: 'I\'m new to salsa dancing and looking for some basic moves to practice at home. Any suggestions for fundamental steps that will help me build confidence before my first class?',
    category: 'beginners',
    user: {
      fullName: 'Maria Rodriguez',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c7?w=400'
    },
    createdAt: '2024-01-20T10:30:00Z',
    viewsCount: 145,
    _count: { replies: 8 },
    isPinned: false,
    isLocked: false
  },
  {
    id: '2', 
    title: 'Upcoming bachata social in Miami - March 15th',
    content: 'Hey everyone! There\'s a fantastic bachata social happening at Ocean Drive Studio next month. Live band, great vibes, and dancers of all levels welcome. Who\'s planning to attend?',
    category: 'events',
    user: {
      fullName: 'Carlos Martinez',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    createdAt: '2024-01-18T15:45:00Z',
    viewsCount: 89,
    _count: { replies: 12 },
    isPinned: true,
    isLocked: false
  },
  {
    id: '3',
    title: 'Tips for leading vs following in partner dances',
    content: 'I\'ve been dancing for about 6 months and want to improve my leading skills in salsa and bachata. What are some key techniques that made the biggest difference for you experienced dancers?',
    category: 'technique',
    user: {
      fullName: 'James Wilson',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    },
    createdAt: '2024-01-17T09:20:00Z',
    viewsCount: 203,
    _count: { replies: 15 },
    isPinned: false,
    isLocked: false
  },
  {
    id: '4',
    title: 'Looking for practice partner in Austin area',
    content: 'Intermediate level dancer seeking a regular practice partner for salsa and bachata. I\'m available most evenings and weekends. Let me know if you\'re interested!',
    category: 'partners',
    user: {
      fullName: 'Emma Thompson',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    },
    createdAt: '2024-01-15T18:10:00Z',
    viewsCount: 67,
    _count: { replies: 5 },
    isPinned: false,
    isLocked: false
  },
  {
    id: '5',
    title: 'Best Latin music for practicing at home',
    content: 'Can anyone recommend some great songs for practicing salsa and bachata footwork? Looking for tracks with clear beats and good energy for solo practice sessions.',
    category: 'music',
    user: {
      fullName: 'Diego Fernandez',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
    },
    createdAt: '2024-01-14T14:25:00Z',
    viewsCount: 156,
    _count: { replies: 22 },
    isPinned: false,
    isLocked: false
  },
  {
    id: '6',
    title: 'How to overcome dance floor anxiety?',
    content: 'I love dancing in class but get really nervous at socials and parties. Any advice on building confidence to dance in front of others? How did you overcome your initial stage fright?',
    category: 'general',
    user: {
      fullName: 'Sofia Martinez',
      profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400'
    },
    createdAt: '2024-01-12T11:40:00Z',
    viewsCount: 198,
    _count: { replies: 18 },
    isPinned: false,
    isLocked: false
  }
]

export default function ForumPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const { t } = useTranslation('common')
  const [isMounted, setIsMounted] = useState(false)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Helper function to prevent showing raw translation keys
  const getTranslation = useCallback((key: string, fallback: string) => {
    if (!isMounted) return fallback
    const translated = t(key)
    // Ensure we don't show raw translation keys by checking if translation is the same as key
    return translated && translated !== key ? translated : fallback
  }, [isMounted, t])

  // Dynamic categories with translations - using useMemo to prevent re-rendering issues
  const categories = useMemo(() => [
    { value: 'all', label: getTranslation('forum.categories.all', 'All Topics') },
    { value: 'general', label: getTranslation('forum.categories.general', 'General Discussion') },
    { value: 'technique', label: getTranslation('forum.categories.technique', 'Dance Techniques') },
    { value: 'events', label: getTranslation('forum.categories.events', 'Events & Socials') },
    { value: 'partners', label: getTranslation('forum.categories.partners', 'Partner Search') },
    { value: 'music', label: getTranslation('forum.categories.music', 'Music & Playlists') },
    { value: 'beginners', label: getTranslation('forum.categories.beginners', 'Beginners Corner') },
  ], [isMounted, t, getTranslation])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch posts from API
  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, currentPage])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      const response = await fetch(`/api/public/forum/posts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        console.error('Failed to fetch forum posts')
        // Fallback to sample posts if API fails
        setPosts(samplePosts)
      }
    } catch (error) {
      console.error('Error fetching forum posts:', error)
      // Fallback to sample posts if API fails
      setPosts(samplePosts)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Login handling disabled for public browsing
  // const handleLoginSuccess = () => {
  //   setShowLoginModal(false)
  //   // The useEffect will handle fetching posts after successful login
  // }

  // Show loading only if not mounted yet
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dance-font">
                {getTranslation('forum.title', 'Community Forum')}
              </h1>
              <p className="mt-2 text-gray-600">
                {getTranslation('forum.subtitle', 'Connect, share, and learn with fellow dancers')}
              </p>
            </div>
            {isAuthenticated ? (
              <Link
                href="/forum/new"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                {getTranslation('forum.newPost', 'New Post')}
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                {getTranslation('forum.signInToPost', 'Sign in to Post')}
              </Link>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {getTranslation('forum.loadingPosts', 'Loading posts...')}
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {getTranslation('forum.noPosts', 'No posts yet')}
              </h3>
              <p className="mt-2 text-gray-600">
                {getTranslation('forum.beFirst', 'Be the first to start a discussion!')}
              </p>
              {isAuthenticated ? (
                <Link
                  href="/forum/new"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {getTranslation('forum.createFirst', 'Create First Post')}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {getTranslation('forum.signInToPost', 'Sign in to Post')}
                </Link>
              )}
            </div>
          ) : (
            posts.map((post: any) => (
              <div
                key={post.id}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/forum/${post.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && (
                          <Pin className="w-4 h-4 text-orange-500" />
                        )}
                        {post.isLocked && (
                          <Lock className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          {categories.find(c => c.value === post.category)?.label || post.category}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        <TranslatedText text={post.title} />
                      </h2>
                      <p className="text-gray-600 line-clamp-2 mb-3">
                        <TranslatedText text={post.content} />
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <img
                            src={post.user.profileImage || '/default-avatar.png'}
                            alt={post.user.fullName}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{post.user.fullName}</span>
                        </div>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewsCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post._count.replies}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 text-sm font-medium">
                {getTranslation('forum.page', 'Page')} {currentPage} {getTranslation('forum.of', 'of')} {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Login Modal Disabled - Users redirected to /login page instead */}
    </div>
  )
}
