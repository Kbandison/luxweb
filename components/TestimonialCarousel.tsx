'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { testimonials } from '@/data/testimonials'
import ScrollReveal from './ScrollReveal'

// Generate a consistent color based on initials
function getInitialColor(name: string) {
  const colors = [
    'from-purple-500 to-violet-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-purple-500',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

export default function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    dragFree: false,
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [isPaused, setIsPaused] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  // Auto-advance every 6s, pause on hover
  useEffect(() => {
    if (!emblaApi || isPaused) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 6000)
    return () => clearInterval(interval)
  }, [emblaApi, isPaused])

  return (
    <motion.section
      className="py-20 lg:py-28 px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      style={{ opacity: 1 }}
    >
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              What Our <span className="text-gradient-purple">Clients Say</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Real feedback from real business owners.
            </p>
          </div>
        </ScrollReveal>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t, index) => (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 px-3">
                  <div className="glass-card-subtle p-6 lg:p-8 h-full">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-purple-400/30 mb-4" />

                    {/* Testimonial text */}
                    <p className="text-gray-200 leading-relaxed mb-6 text-[15px]">
                      &ldquo;{t.content}&rdquo;
                    </p>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getInitialColor(t.name)} flex items-center justify-center text-white text-sm font-bold`}>
                        {getInitials(t.name)}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{t.name}</div>
                        <div className="text-gray-500 text-xs">{t.role}, {t.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors border border-white/10"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors border border-white/10"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? 'bg-purple-400 w-6'
                    : 'bg-white/20 w-1.5 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
