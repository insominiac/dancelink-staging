'use client'

import { useState } from 'react'
import { useAuth } from '@/app/lib/auth-context'
import LoginModal from './LoginModal'
import toast from 'react-hot-toast'

export default function TestLogin() {
  const { user, isAuthenticated, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="text-gray-600">Logged in as:</div>
          <div className="font-medium text-purple-600">{user.fullName}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
      >
        Test Login
      </button>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false)
          toast.success('Login successful!')
        }}
        message="Test the username display functionality"
      />
    </>
  )
}