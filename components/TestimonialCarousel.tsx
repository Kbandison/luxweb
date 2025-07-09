'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  image: string
  testimonial: string
  rating: number
  result: string
}

export default function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: true,
    dragFree: false,
    containScroll: 'trimSnaps'
  })
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechStart Solutions",
      image: "SJ",
      testimonial: "LuxWeb Studio delivered exactly what we needed. Fast, professional, and our conversion rate increased by 40% in the first month. We went from 2% to 2.8% conversion rate - that's an extra $18,000 in monthly revenue!",
      rating: 5,
      result: "40% increase in conversions = +$18K/month"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Owner",
      company: "Urban Bakery",
      image: "MC",
      testimonial: "Our online orders went through the roof after they built our new website. We went from 12 orders per day to 36 orders per day. The ROI paid for itself in just 3 weeks. Best investment we've made for our business.",
      rating: 5,
      result: "3x increase in online orders (12→36/day)"
    },
    {
      id: 3,
      name: "Dr. Amanda Rodriguez",
      role: "Practice Owner",
      company: "Green Valley Health",
      image: "AR",
      testimonial: "Professional, reliable, and delivered on time. Our new website has helped us attract 50% more patients and establish credibility in our community. We're now booking 25 new patients per month vs 17 before.",
      rating: 5,
      result: "50% more patient inquiries (17→25/month)"
    },
    {
      id: 4,
      name: "James Thompson",
      role: "Director",
      company: "Metro Consulting",
      image: "JT",
      testimonial: "The team at LuxWeb Studio understood our vision perfectly. They created a website that not only looks great but actually generates leads. We went from 8 qualified leads per month to 13 - that's 62% more business.",
      rating: 5,
      result: "60% increase in leads (8→13/month)"
    },
    {
      id: 5,
      name: "Lisa Martinez",
      role: "Founder",
      company: "Bright Future Academy",
      image: "LM",
      testimonial: "Working with LuxWeb Studio was a game-changer for our educational platform. The user experience is fantastic, and we've seen enrollments increase from 45 to 56 students per semester. That's $22,000 in additional revenue per semester.",
      rating: 5,
      result: "25% more enrollments = +$22K/semester"
    }
  ]

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
    
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      }
    }
  }

  return (
    <motion.section
      className="py-20 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
            variants={cardVariants}
          >
            What Our <span className="text-purple-400">Clients Say</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            variants={cardVariants}
          >
            Don't just take our word for it. Here's what real business owners say about working with us.
          </motion.p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 px-4">
                  <motion.div
                    className="modern-card p-8 max-w-4xl mx-auto"
                    variants={cardVariants}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center mb-6">
                      <Quote className="w-8 h-8 text-purple-400 opacity-60" />
                    </div>
                    
                    <div className="text-center mb-8">
                      <p className="text-lg text-gray-300 leading-relaxed mb-6 italic">
                        "{testimonial.testimonial}"
                      </p>
                      
                      <div className="flex items-center justify-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.image}
                      </div>
                      <div className="text-left">
                        <div className="text-white font-semibold">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 rounded-full border border-green-400/20">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 font-medium text-sm">{testimonial.result}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-purple-400/50"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-purple-400/50"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === selectedIndex
                    ? 'bg-purple-400 w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}