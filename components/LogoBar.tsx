'use client'

import type { Project } from '@/data/projects'

export default function LogoBar({ projects }: { projects: Project[] }) {
  // Use project names as "logos"
  const names = projects.map(p => p.title)
  // Duplicate for seamless loop
  const marqueeItems = [...names, ...names]

  return (
    <section className="py-12 border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center text-sm text-gray-600 tracking-wide uppercase">
          Trusted by businesses across industries
        </p>
      </div>

      <div className="relative">
        {/* Gradient fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[rgb(1,4,9)] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[rgb(1,4,9)] to-transparent z-10" />

        <div className="flex gap-12 animate-infinite-scroll whitespace-nowrap">
          {marqueeItems.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-lg font-semibold text-gray-600 select-none flex-shrink-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
