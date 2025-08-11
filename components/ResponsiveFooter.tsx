'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Footer from '@/components/Footer'

export function ResponsiveFooter() {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  useEffect(() => {
    if (!isAdminRoute) return

    // Get current user for admin routes
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // Listen for auth changes on admin routes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [isAdminRoute])

  // Determine footer positioning
  const shouldOffsetForSidebar = isAdminRoute && user
  const footerClasses = shouldOffsetForSidebar ? 'pl-64' : ''

  return (
    <div className={footerClasses}>
      <Footer />
    </div>
  )
}