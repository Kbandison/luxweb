'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function AuthDebug() {
  const [authState, setAuthState] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 DEBUG: Checking auth state...')
        
        // Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('🔍 DEBUG: Session:', session)
        console.log('🔍 DEBUG: Session Error:', sessionError)
        
        // Check user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log('🔍 DEBUG: User:', user)
        console.log('🔍 DEBUG: User Error:', userError)
        
        setAuthState({
          session,
          user,
          sessionError,
          userError,
          hasSession: !!session,
          hasUser: !!user,
          sessionId: session?.access_token?.slice(0, 10) + '...',
          userEmail: user?.email
        })
      } catch (error) {
        console.error('🔍 DEBUG: Auth check failed:', error)
        setAuthState({ error: error instanceof Error ? error.message : 'Unknown error' })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔍 DEBUG: Auth state changed:', event, session?.user?.email)
      setAuthState((prev: any) => ({
        ...prev,
        event,
        session,
        user: session?.user,
        hasSession: !!session,
        hasUser: !!session?.user,
        sessionId: session?.access_token?.slice(0, 10) + '...',
        userEmail: session?.user?.email
      }))
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-200 text-sm z-50">
        Checking auth state...
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-200 text-xs z-50 max-w-xs">
      <div className="font-bold mb-2">Auth Debug</div>
      <div>Has Session: {authState?.hasSession ? '✅' : '❌'}</div>
      <div>Has User: {authState?.hasUser ? '✅' : '❌'}</div>
      <div>Email: {authState?.userEmail || 'None'}</div>
      <div>Token: {authState?.sessionId || 'None'}</div>
      {authState?.error && <div className="text-red-300">Error: {authState.error}</div>}
    </div>
  )
}