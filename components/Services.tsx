'use client'

import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Star, Clock, Users, Flame, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal"

export default function Services() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(1)

  useEffect(() => {
    const updateCardsToShow = () => {
      let newCardsToShow
      if (window.innerWidth >= 1024) {
        newCardsToShow = 3
      } else if (window.innerWidth >= 768) {
        newCardsToShow = 2
      } else {
        newCardsToShow = 1
      }
      
      // Only reset currentSlide if cardsToShow actually changed
      if (newCardsToShow !== cardsToShow) {
        setCardsToShow(newCardsToShow)
        setCurrentSlide(0)
      }
    }

    updateCardsToShow()
    window.addEventListener('resize', updateCardsToShow)
    return () => window.removeEventListener('resize', updateCardsToShow)
  }, [cardsToShow])

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(packages.length / cardsToShow))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(packages.length / cardsToShow)) % Math.ceil(packages.length / cardsToShow))
  }

  const packages: Array<{
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    features: string[];
    idealFor: string;
    cta: string;
    popular: boolean;
    badge?: string;
  }> = [
    {
      name: "Starter Package",
      description: "Perfect for new businesses getting online",
      price: "$1,100",
      originalPrice: "$1,400",
      features: [
        "Professional single-page website",
        "Mobile-responsive design",
        "Basic SEO optimization",
        "Contact form integration",
        "1 week delivery",
        "30-day support"
      ],
      idealFor: "New businesses, personal brands, service providers",
      cta: "Get Your Quote",
      popular: false,
      badge: "Save $300"
    },
    {
      name: "Growth Package",
      description: "Ideal for established businesses ready to scale",
      price: "$1,300",
      originalPrice: "$1,700",
      features: [
        "Multi-page custom website",
        "Advanced SEO setup",
        "Analytics integration",
        "Social media integration",
        "Blog setup (optional)",
        "2 weeks delivery",
        "60-day support"
      ],
      idealFor: "Growing businesses, e-commerce, professional services",
      cta: "Start Your Project",
      popular: true,
      badge: "Save $400"
    },
    {
      name: "Complete Package",
      description: "Full-service solution for serious growth",
      price: "$1,500",
      originalPrice: "$2,000",
      features: [
        "Custom web application",
        "Database integration",
        "User authentication",
        "Payment processing",
        "Advanced functionality",
        "2+ weeks delivery",
        "90-day support"
      ],
      idealFor: "Established businesses, complex requirements",
      cta: "Let's Discuss",
      popular: false,
      badge: "Save $500"
    },
    {
      name: "Enterprise Package",
      description: "Premium solution for maximum results",
      price: "$2,500",
      originalPrice: "$3,200",
      features: [
        "Custom enterprise web application",
        "Advanced database architecture",
        "Multi-user authentication system",
        "Payment gateway integration",
        "Advanced analytics dashboard",
        "API development",
        "Priority support",
        "3+ weeks delivery",
        "6-month support"
      ],
      idealFor: "Large businesses, complex enterprise needs",
      cta: "Contact Sales",
      popular: false,
      badge: "Save $700"
    }
  ]

  return (
    <section id="services" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Simple, <span className="text-purple-400">Transparent Pricing</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              No hidden fees. No surprises. Just honest pricing for websites that actually convert.
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Don't worry about the pricing.  We will discuss it in the initial call!
            </p>
            
            {/* FOMO Elements */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
                <Flame className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-purple-400 font-medium text-sm">Limited Time Savings</span>
              </div>
              <div className="flex items-center gap-2 bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
                <Users className="w-4 h-4 text-violet-400" />
                <span className="text-violet-400 font-medium text-sm">Only 3 Spots Left</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium text-sm">Fast Delivery</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-2 transition-all duration-200 -ml-4"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-2 transition-all duration-200 -mr-4"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden">
            <motion.div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / cardsToShow)}%)` }}
            >
              {packages.map((pkg, index) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                  <div className="pt-6">
                    <motion.div 
                      className={`modern-card p-8 h-full hover:transform hover:scale-[1.02] transition-all duration-200 relative ${pkg.popular ? 'border-2 border-purple-400/50' : ''}`}
                      whileHover={{ 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="bg-gradient-to-r from-purple-400 to-violet-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            MOST POPULAR
                          </div>
                        </div>
                      )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-semibold text-white mb-3">{pkg.name}</h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">{pkg.description}</p>
                      <div className="mb-4">
                        {pkg.originalPrice && (
                          <div className="text-base text-gray-500 line-through">{pkg.originalPrice}</div>
                        )}
                        <div className="text-3xl font-bold text-white mb-2">{pkg.price}</div>
                        {pkg.badge && (
                          <div className="text-base text-green-400 font-medium">{pkg.badge}</div>
                        )}
                      </div>
                      <div className="text-base text-gray-400 mb-6">Limited time offer</div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-base leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-white/10 pt-6 mb-6">
                      <p className="text-sm text-gray-400 mb-2">Ideal for:</p>
                      <p className="text-white text-base font-medium leading-relaxed">{pkg.idealFor}</p>
                    </div>

                    <a href={`/contact?package=${encodeURIComponent(pkg.name)}`} className="block">
                      <Button 
                        className={`w-full py-3 text-base font-medium transition-all duration-200 ${
                          pkg.popular 
                            ? 'modern-btn-primary text-white' 
                            : 'modern-btn-secondary text-white'
                        }`}
                      >
                        Choose This Package
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </a>
                  </motion.div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(packages.length / cardsToShow) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-purple-400' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}