'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface CtaButtonProps {
  label: string
  /** Where the button sits on the site, recorded with the click. */
  location: string
  href?: string
  className?: string
}

/**
 * The primary call-to-action. Renders a real link styled as a button (no
 * <button> nested inside an <a>) and records the click for conversion tracking.
 */
export default function CtaButton({ label, location, href = '/contact', className }: CtaButtonProps) {
  return (
    <Button asChild className={cn('modern-btn-primary h-auto text-white', className)}>
      <Link href={href} onClick={() => trackEvent('cta_click', { location })}>
        {label}
        <ArrowRight />
      </Link>
    </Button>
  )
}
