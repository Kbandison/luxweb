'use client'

import { useState } from 'react'
import { ClientTheme } from '@/lib/theme-generator'
import { ThemeProvider } from '@/components/portal/ThemeProvider'
import { PortalHeader } from '@/components/portal/PortalHeader'
import { PortalSidebar } from '@/components/portal/PortalSidebar'
import { PortalBreadcrumbs } from '@/components/portal/Breadcrumbs'

interface PortalLayoutClientProps {
  user: any
  theme: ClientTheme
  children: React.ReactNode
}

export function PortalLayoutClient({ user, theme, children }: PortalLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-black portal-layout">
        <PortalHeader 
          user={user} 
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <div className="flex h-[calc(100vh-73px)]">
          <PortalSidebar 
            user={user} 
            isOpen={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
          />
          <main className="flex-1 overflow-y-auto lg:ml-0">
            <div className="p-6">
              <PortalBreadcrumbs />
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}