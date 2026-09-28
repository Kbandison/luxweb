import { track } from '@vercel/analytics'

/**
 * Conversion events sent to Vercel Web Analytics.
 *
 * Event names and their props are fixed here so the dashboard doesn't fill up
 * with near-duplicates ("cta_click" vs "CTA Click"). Add new events to this map
 * rather than calling `track` directly.
 */
type EventMap = {
  /** A primary call-to-action was clicked. `location` says which one. */
  cta_click: { location: string }
  /** The contact form was submitted successfully. */
  lead_submitted: { package: string }
  /** The AI chat opened. `auto` is the desktop auto-open, not a visitor action. */
  chat_opened: { trigger: 'button' | 'teaser' | 'auto' }
  /** A tap-to-call link was used. */
  tel_click: { location: string }
}

export function trackEvent<E extends keyof EventMap>(name: E, props: EventMap[E]) {
  track(name, props)
}
