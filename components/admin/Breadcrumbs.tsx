'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    // Skip 'admin' segment and process the rest
    const adminSegments = segments.slice(1)
    let currentPath = '/admin'
    
    // Always start with Dashboard, but only if we're not already on dashboard
    if (adminSegments.length === 0 || adminSegments[0] !== 'dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/admin/dashboard',
        isActive: false
      })
    }
    
    adminSegments.forEach((segment, index) => {
      currentPath += '/' + segment
      const isLast = index === adminSegments.length - 1
      
      // Skip dynamic segments (UUIDs)
      if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return
      }
      
      let label = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      // Custom labels for specific paths
      const labelMap: Record<string, string> = {
        'clients': 'Clients',
        'projects': 'Projects', 
        'invoices': 'Invoices',
        'dashboard': 'Dashboard',
        'calendar': 'Calendar',
        'templates': 'Templates',
        'communications': 'Communications',
        'settings': 'Settings'
      }
      
      if (labelMap[segment]) {
        label = labelMap[segment]
      }
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: isLast
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  // Don't show breadcrumbs on login or setup pages
  if (pathname.includes('/login') || pathname.includes('/setup')) {
    return null
  }
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => (
        <div key={`${index}-${item.href}`} className="flex items-center">
          {index > 0 && <ChevronRight className="h-3 w-3 mx-2" />}
          {item.isActive ? (
            <span className="text-white font-medium">{item.label}</span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}