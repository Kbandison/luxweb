'use client'

import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Star } from "lucide-react"
import { motion } from "framer-motion"
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal"
import Link from "next/link"

export default function PricingCondensed() {
  const packages = [
    {
      name: "Starter Package",
      price: "$1,100",
      originalPrice: "$1,400",
      description: "Perfect for new businesses getting online",
      features: [
        "Professional single-page website",
        "Mobile-responsive design",
        "Basic SEO optimization",
        "1 week delivery"
      ],
      popular: false,
      badge: "Save $300"
    },
    {
      name: "Growth Package",
      price: "$1,300",
      originalPrice: "$1,700",
      description: "Ideal for established businesses ready to scale",
      features: [
        "Multi-page custom website",
        "Advanced SEO setup",
        "Analytics integration",
        "2 weeks delivery"
      ],
      popular: true,
      badge: "Save $400"
    },
    {
      name: "Complete Package",
      price: "$1,500",
      originalPrice: "$2,000",
      description: "Full-service solution for serious growth",
      features: [
        "Custom web application",
        "Database integration",
        "Payment processing",
        "2+ weeks delivery"
      ],
      popular: false,
      badge: "Save $500"
    }
  ]

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Simple, <span className="text-purple-400">Transparent Pricing</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              No hidden fees. No surprises. Just honest pricing for websites that actually convert.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {packages.map((pkg, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className={`modern-card p-6 hover:transform hover:scale-[1.02] transition-all duration-200 relative ${pkg.popular ? 'border-2 border-purple-400/50' : ''}`}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-400 to-violet-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                      <Star className="w-4 h-4" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{pkg.name}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{pkg.description}</p>
                  <div className="mb-2">
                    {pkg.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                    )}
                    <div className="text-2xl font-bold text-white mb-1">{pkg.price}</div>
                    {pkg.badge && (
                      <div className="text-sm text-green-400 font-medium">{pkg.badge}</div>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2 pt-2">
                    <div className="text-gray-500 text-sm">+ more features...</div>
                  </li>
                </ul>

                <a href={`/contact?package=${encodeURIComponent(pkg.name)}`}>
                  <Button 
                    className={`w-full py-2 text-sm font-medium transition-all duration-200 ${
                      pkg.popular 
                        ? 'modern-btn-primary text-white' 
                        : 'modern-btn-secondary text-white'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.2}>
          <div className="text-center">
            <Link href="/pricing">
              <Button className="modern-btn-outline text-white px-8 py-3 text-lg">
                View All Packages & Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm mb-4">
                All packages include:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Free Consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Mobile-First Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}