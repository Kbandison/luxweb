'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  FileText, 
  Calendar,
  Mail,
  Settings,
  DollarSign
} from 'lucide-react'

const navigation = [
  { name: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
  { name: 'Clients', icon: Users, href: '/admin/clients' },
  { name: 'Projects', icon: FolderOpen, href: '/admin/projects' },
  { name: 'Invoices', icon: DollarSign, href: '/admin/invoices' },
  { name: 'Communications', icon: Mail, href: '/admin/communications' },
  { name: 'Calendar', icon: Calendar, href: '/admin/calendar' },
  { name: 'Templates', icon: FileText, href: '/admin/templates' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
]

interface AdminSidebarProps {
  user: any
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  
  // Component only renders when user exists (checked in layout)

  return (
    <aside className="fixed left-0 top-[136px] bottom-0 z-20 w-64 bg-glass-primary backdrop-blur-xl border-r border-white/20">
      <div className="flex h-full flex-col overflow-y-auto py-6">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-light text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}