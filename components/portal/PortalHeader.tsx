'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, LogOut, Settings, User, Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface PortalHeaderProps {
  user: any
  onMobileMenuToggle: () => void
  isMobileMenuOpen: boolean
}

export function PortalHeader({ user, onMobileMenuToggle, isMobileMenuOpen }: PortalHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/portal/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="lg:hidden text-white hover:bg-white/10"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          {/* Company Name */}
          <div>
            <h1 className="text-xl font-bold text-white">
              {user.client?.company_name || 'Client Portal'}
            </h1>
            <p className="text-sm text-gray-400 hidden sm:block">
              Welcome back, {user.client?.primary_contact || user.email}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-white/10 relative"
          >
            <Bell className="w-5 h-5" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-white hover:bg-white/10"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm">
                {user.client?.primary_contact?.split(' ')[0] || 'User'}
              </span>
            </Button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 bg-gray-900 border border-white/20 rounded-lg shadow-lg backdrop-blur-xl z-50">
                <div className="p-3 border-b border-white/10">
                  <p className="text-white font-medium text-sm">
                    {user.client?.primary_contact || 'User'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {user.email}
                  </p>
                  {user.client?.company_name && (
                    <p className="text-gray-500 text-xs mt-1">
                      {user.client.company_name}
                    </p>
                  )}
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
                    onClick={() => {
                      setShowUserMenu(false)
                      router.push('/portal/profile')
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {loggingOut ? 'Signing out...' : 'Sign Out'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}