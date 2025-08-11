'use client'

import { createContext, useContext, useEffect } from 'react'
import { ClientTheme } from '@/lib/theme-generator'

const ThemeContext = createContext<ClientTheme | null>(null)

export function ThemeProvider({ 
  children, 
  theme 
}: { 
  children: React.ReactNode
  theme: ClientTheme 
}) {
  useEffect(() => {
    // Apply CSS custom properties dynamically
    const root = document.documentElement
    root.style.setProperty('--client-primary', theme.primary)
    root.style.setProperty('--client-secondary', theme.secondary)
    root.style.setProperty('--client-accent', theme.accent)
    root.style.setProperty('--client-primary-rgb', theme.primaryRgb)
    root.style.setProperty('--client-secondary-rgb', theme.secondaryRgb)
    root.style.setProperty('--client-accent-rgb', theme.accentRgb)
    root.style.setProperty('--client-primary-hsl', theme.primaryHsl)
    root.style.setProperty('--client-secondary-hsl', theme.secondaryHsl)
    root.style.setProperty('--client-accent-hsl', theme.accentHsl)
  }, [theme])

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useClientTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useClientTheme must be used within ThemeProvider')
  }
  return context
}