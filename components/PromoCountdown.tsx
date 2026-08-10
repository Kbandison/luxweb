'use client'

import { useEffect, useState } from 'react'

interface PromoCountdownProps {
  /** Deadline as epoch milliseconds. */
  endsAtMs: number
  /** `inline` for the announcement bar, `boxed` for pricing cards. */
  variant?: 'inline' | 'boxed'
  className?: string
}

interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function splitRemaining(ms: number): Remaining {
  const totalSeconds = Math.floor(ms / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function PromoCountdown({
  endsAtMs,
  variant = 'inline',
  className = '',
}: PromoCountdownProps) {
  // Stays null through the server render and the first client render so the
  // markup matches during hydration. The real value lands right after mount.
  const [remainingMs, setRemainingMs] = useState<number | null>(null)

  useEffect(() => {
    const tick = () => setRemainingMs(Math.max(0, endsAtMs - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [endsAtMs])

  // Nothing to show before mount, or once the offer has actually run out.
  if (remainingMs === null || remainingMs <= 0) return null

  const { days, hours, minutes, seconds } = splitRemaining(remainingMs)

  if (variant === 'inline') {
    return (
      <span
        className={`tabular-nums font-semibold ${className}`}
        aria-label={`${days} days, ${hours} hours and ${minutes} minutes left`}
      >
        {days}d {pad(hours)}h {pad(minutes)}m
      </span>
    )
  }

  const units: { value: number; label: string }[] = [
    { value: days, label: days === 1 ? 'day' : 'days' },
    { value: hours, label: hours === 1 ? 'hour' : 'hours' },
    { value: minutes, label: minutes === 1 ? 'min' : 'mins' },
    { value: seconds, label: 'sec' },
  ]

  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}
      aria-label={`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds left`}
    >
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center min-w-[3.25rem] rounded-lg border border-purple-500/25 bg-purple-500/10 px-2.5 py-2"
        >
          <span className="text-xl sm:text-2xl font-bold text-white tabular-nums leading-none">
            {pad(unit.value)}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-purple-300/80">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}
