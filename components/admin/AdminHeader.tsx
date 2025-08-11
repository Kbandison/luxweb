'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  Search, 
  User, 
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react'

interface AdminHeaderProps {
  user: any
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/admin/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    setIsLoggingOut(false)
  }

  // Component only renders when user exists (checked in layout)

  return (
    <header className="fixed top-[80px] left-0 right-0 z-30 h-14 bg-glass-primary backdrop-blur-xl border-b border-white/20">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Admin breadcrumb */}
        <div className="flex items-center space-x-3">
          <span className="text-white font-medium">Admin Panel</span>
          <div className="text-gray-400 text-sm">/ CRM Dashboard</div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search clients, projects..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right: Notifications and Profile */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white relative p-2">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-glass-primary backdrop-blur-xl border border-white/20 rounded-lg shadow-lg">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm text-white font-medium">{user.email}</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                  
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}