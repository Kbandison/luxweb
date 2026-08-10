'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import type { ActivePromo } from '@/data/promo'
import PromoCountdown from './PromoCountdown'

/**
 * Fixed announcement strip above the navigation.
 *
 * Its height is mirrored by the `--promo-offset` CSS variable set in the root
 * layout, which the nav and every page's top padding read from. Keep this bar
 * a single line tall so that offset stays accurate at every breakpoint.
 */
export default function PromoBar({ promo }: { promo: ActivePromo }) {
  const pathname = usePathname()

  // The admin panel has its own chrome — no marketing banner in there.
  if (pathname?.startsWith('/admin')) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 overflow-hidden border-b border-purple-400/20 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md">
      <Link
        href="/pricing"
        className="flex h-full items-center justify-center gap-2 px-4 text-center text-xs text-purple-100 transition-colors hover:text-white sm:gap-3 sm:text-sm"
      >
        {/* Compact copy on phones, full sentence from `sm` up. */}
        <span className="sm:hidden">
          <span className="font-semibold text-white">{promo.salePriceWithQualifier}</span> through{' '}
          {promo.endsAtLabel} — save {promo.savingsLabel}
        </span>
        <span className="hidden sm:inline">
          <span className="font-semibold text-white">{promo.name}:</span> The Signature Site —{' '}
          <span className="font-semibold text-white">{promo.salePriceWithQualifier}</span>{' '}
          <span className="text-purple-300/80 line-through">{promo.regularPriceLabel}</span> through{' '}
          {promo.endsAtLabel}
        </span>

        <PromoCountdown
          endsAtMs={promo.endsAtMs}
          variant="inline"
          className="hidden text-white md:inline"
        />

        <ArrowRight className="hidden h-3.5 w-3.5 flex-shrink-0 sm:inline" />
      </Link>
    </div>
  )
}
