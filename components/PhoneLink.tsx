'use client'

import type { ComponentProps } from 'react'
import { telHref } from '@/data/contact'
import { trackEvent } from '@/lib/analytics'

/** Tap-to-call link that records which spot on the site the call came from. */
export default function PhoneLink({
  location,
  onClick,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & { location: string }) {
  return (
    <a
      href={telHref}
      onClick={(e) => {
        trackEvent('tel_click', { location })
        onClick?.(e)
      }}
      {...props}
    />
  )
}
