'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  Mail,
  Calendar,
  FolderOpen,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { name: 'Submissions', icon: Mail, href: '/admin/submissions' },
  { name: 'Projects', icon: FolderOpen, href: '/admin/projects' },
  { name: 'Calendar', icon: Calendar, href: '/admin/calendar' },
]

interface AdminShellProps {
  children: React.ReactNode
  user: { email?: string | null }
}

export function AdminShell({ children, user }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return
    const handler = () => setProfileOpen(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [profileOpen])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
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

  // Get page title from current path
  const pageTitle = (() => {
    const segment = pathname.split('/').filter(Boolean).pop()
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      submissions: 'Submissions',
      projects: 'Projects',
      calendar: 'Calendar',
    }
    return titles[segment || ''] || 'Admin'
  })()

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — sits below the public navbar (h-10 mobile / h-12 desktop) */}
      <aside
        className={`fixed top-10 lg:top-12 left-0 bottom-0 z-40 w-64 bg-gray-950/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <Link href="/admin/dashboard" className="text-lg font-bold text-white">
            LuxWeb <span className="text-purple-400">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-purple-400' : ''}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer — user info */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-purple-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header — sits below the public navbar */}
      <header className="fixed top-10 lg:top-12 left-0 right-0 z-30 h-14 bg-gray-950/90 backdrop-blur-xl border-b border-white/10 lg:pl-64">
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          {/* Left: hamburger + page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
          </div>

          {/* Right: profile dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setProfileOpen(!profileOpen)
              }}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <div className="w-7 h-7 bg-purple-600/30 rounded-full flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-purple-300" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {user.email?.split('@')[0]}
              </span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-white font-medium truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content — offset for navbar (h-10/h-12) + admin header (h-14) */}
      <main className="pt-24 lg:pt-[104px] lg:pl-64">
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
