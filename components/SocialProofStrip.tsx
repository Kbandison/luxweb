'use client'

import { Star } from 'lucide-react'
import { testimonials } from '@/data/testimonials'
import { portfolioStats } from '@/data/projects'
import ScrollReveal from './ScrollReveal'

export default function SocialProofStrip() {
  const testimonial = testimonials[0]
  const stat = portfolioStats[0]

  return (
    <section className="py-8 lg:py-12 px-6 border-y border-white/5">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Testimonial */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-gray-300 italic text-lg leading-relaxed mb-3">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  — {testimonial.name}, {testimonial.company}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-16 bg-white/10" />

            {/* Stat */}
            <div className="text-center lg:text-right flex-shrink-0">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
