'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []

    const adminSegments = segments.slice(1)
    let currentPath = '/admin'

    if (adminSegments.length === 0 || adminSegments[0] !== 'dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/admin/dashboard',
        isActive: false
      })
    }

    const labelMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'submissions': 'Submissions',
      'calendar': 'Calendar',
    }

    adminSegments.forEach((segment, index) => {
      currentPath += '/' + segment
      const isLast = index === adminSegments.length - 1

      // Skip dynamic segments (UUIDs)
      if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return
      }

      const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

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
