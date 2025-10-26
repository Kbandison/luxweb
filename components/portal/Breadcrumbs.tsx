'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export function PortalBreadcrumbs() {
  const pathname = usePathname()
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    // Skip 'portal' segment and process the rest
    const portalSegments = segments.slice(1)
    let currentPath = '/portal'
    
    // Always start with Dashboard, but only if we're not already on dashboard
    if (portalSegments.length === 0 || portalSegments[0] !== 'dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/portal/dashboard',
        isActive: false
      })
    }
    
    portalSegments.forEach((segment, index) => {
      currentPath += '/' + segment
      const isLast = index === portalSegments.length - 1
      
      // Skip dynamic segments (UUIDs)
      if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return
      }
      
      let label = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      // Custom labels for specific paths
      const labelMap: Record<string, string> = {
        'projects': 'Projects',
        'invoices': 'Invoices', 
        'files': 'Files',
        'dashboard': 'Dashboard',
        'profile': 'Profile',
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
  
  // Don't show breadcrumbs on login pages
  if (pathname.includes('/login')) {
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