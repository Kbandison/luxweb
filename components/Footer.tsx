'use client'

import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { businessPhone, businessEmail, mailtoHref } from "@/data/contact"
import CtaButton from "./CtaButton"
import PhoneLink from "./PhoneLink"

export default function Footer({ ctaLabel }: { ctaLabel: string }) {
  const currentYear = new Date().getFullYear()

  const links = {
    pages: [
      { name: 'Projects', href: '/projects' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  }

  return (
    <footer className="border-t border-white/5 bg-[rgb(1,4,9)]">
      <div className="container mx-auto px-6 py-16">
        {/* Mini CTA */}
        <div className="text-center mb-14 pb-14 border-b border-white/5">
          <p className="text-lg text-gray-400 mb-4">Ready to get started?</p>
          <CtaButton label={ctaLabel} location="footer" className="px-6 py-3 text-sm font-medium" />
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/">
              <Image
                src="/logo-with-text.png"
                alt="LuxWeb Studio"
                width={160}
                height={40}
                className="h-10 w-auto mb-4"
              />
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Professional web development with a personal touch. Fast delivery, fair pricing.
            </p>
            <div>
              <a href={mailtoHref} className="flex min-h-11 items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                {businessEmail}
              </a>
              <PhoneLink location="footer" className="flex min-h-11 items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                {businessPhone.display}
              </PhoneLink>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Pages</h3>
            <ul className="space-y-2">
              {links.pages.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; {currentYear} LuxWeb Studio LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
