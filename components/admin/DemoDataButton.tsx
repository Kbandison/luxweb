'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Database, Loader2 } from 'lucide-react'

export function DemoDataButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const createDemoData = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setMessage('Demo data created successfully!')
      
      // Refresh the page to show new data
      setTimeout(() => {
        router.refresh()
      }, 1000)

    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-glass-primary backdrop-blur-xl border border-white/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Setup</h3>
      <p className="text-gray-400 text-sm mb-4">
        Your CRM is ready! Add some demo data to see how it works.
      </p>
      
      <Button
        onClick={createDemoData}
        disabled={loading}
        className="bg-primary-light hover:bg-primary-medium text-white w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Creating Demo Data...
          </>
        ) : (
          <>
            <Database className="h-4 w-4 mr-2" />
            Add Demo Data
          </>
        )}
      </Button>

      {message && (
        <p className={`text-sm mt-3 ${
          message.includes('Error') ? 'text-red-300' : 'text-green-300'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}