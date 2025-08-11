'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FolderOpen, 
  Receipt, 
  FileText, 
  MessageSquare, 
  User,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface PortalSidebarProps {
  user: any
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/portal/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & quick actions'
  },
  {
    name: 'Projects',
    href: '/portal/projects',
    icon: FolderOpen,
    description: 'Track project progress'
  },
  {
    name: 'Invoices',
    href: '/portal/invoices',
    icon: Receipt,
    description: 'View bills & payments'
  },
  {
    name: 'Files',
    href: '/portal/files',
    icon: FileText,
    description: 'Shared documents'
  },
  {
    name: 'Messages',
    href: '/portal/communications',
    icon: MessageSquare,
    description: 'Communication center'
  },
  {
    name: 'Profile',
    href: '/portal/profile',
    icon: User,
    description: 'Account settings'
  }
]

export function PortalSidebar({ user, isOpen, onClose }: PortalSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ 
                  background: `linear-gradient(135deg, var(--client-primary, #2d1b69), var(--client-accent, #7c3aed))` 
                }}
              >
                {user.client?.company_name?.charAt(0) || 'C'}
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {user.client?.company_name || 'Client Portal'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {user.client?.primary_contact || user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "bg-white/10 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive 
                        ? "text-white" 
                        : "text-gray-400 group-hover:text-white"
                    )} />
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium text-sm",
                        isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                      )}>
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-xs group-hover:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'var(--client-accent, #7c3aed)' }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-2">
                Powered by
              </p>
              <p className="text-white font-medium text-sm">
                LuxWeb Studio
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Professional Web Development
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}