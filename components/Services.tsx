'use client'

import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Star, Clock, Users, Flame } from "lucide-react"
import { motion } from "framer-motion"
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal"

export default function Services() {
  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
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
              Choose Your <span className="text-purple-400">Growth Package</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Every package is designed to convert visitors into customers and grow your business.
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

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="bg-gradient-to-r from-purple-400 to-violet-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
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
                <div className="text-sm text-gray-400 mb-4">Limited time offer</div>
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/10 pt-4 mb-6">
                <p className="text-xs text-gray-400 mb-1">Ideal for:</p>
                <p className="text-white text-sm font-medium leading-relaxed">{pkg.idealFor}</p>
              </div>

              <Button 
                onClick={scrollToContact}
                className={`w-full py-2 text-sm font-medium transition-all duration-200 ${
                  pkg.popular 
                    ? 'modern-btn-primary text-white' 
                    : 'modern-btn-secondary text-white'
                }`}
              >
                {pkg.cta}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.2}>
          <div className="text-center mt-16">
            <div className="modern-card p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-6">Why Choose LuxWeb Studio?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Personal attention</div>
                  <div className="text-gray-400 text-sm">Not outsourced to junior developers</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Fast delivery</div>
                  <div className="text-gray-400 text-sm">Websites in days, not months</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Full Customizable and Unique</div>
                  <div className="text-gray-400 text-sm">No templates, all custom work</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Direct communication</div>
                  <div className="text-gray-400 text-sm">Work directly with the developer</div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}