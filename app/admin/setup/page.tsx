'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminSetup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setMessage('Admin user created successfully! You can now sign in.')
      setEmail('')
      setPassword('')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Admin Setup
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Create your first admin user for the CRM
          </p>
          
          <form onSubmit={handleSetup} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Admin Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary-light"
                placeholder="admin@luxwebstudio.dev"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary-light"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                <p className="text-green-200 text-sm">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-medium to-primary-light hover:from-primary-light hover:to-primary-medium text-white font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              {loading ? 'Creating Admin...' : 'Create Admin User'}
            </Button>
          </form>

          {message && (
            <div className="mt-6 text-center">
              <a 
                href="/admin/login"
                className="text-primary-light hover:text-primary-medium transition-colors"
              >
                Go to Login →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}