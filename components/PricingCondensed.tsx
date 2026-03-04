'use client'

import { Check, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal"
import Link from "next/link"
import { packages as allPackages } from "@/data/packages"

export default function PricingCondensed() {
  // Show first 3 packages with 3 features each
  const packages = allPackages.slice(0, 3).map(pkg => ({
    ...pkg,
    features: pkg.features.slice(0, 3),
  }))

  return (
    <section className="py-20 lg:py-28 px-6">
      <div className="container mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Simple, <span className="text-gradient-purple">Transparent Pricing</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              No hidden fees. No surprises. Just honest pricing for real results.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {packages.map((pkg, index) => (
            <StaggerItem key={index}>
              <motion.div
                className={`modern-card p-6 relative transition-all duration-300 h-full ${
                  pkg.popular ? 'border-2 border-purple-400/40 animate-subtle-glow' : ''
                }`}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-400 to-violet-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                      <Star className="w-3 h-3 fill-current" />
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-5">
                  <h3 className="text-lg font-semibold text-white mb-1">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{pkg.description}</p>
                  <div className="text-3xl font-bold text-white">{pkg.price}</div>
                </div>

                <ul className="space-y-2.5 mb-5">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-gray-500 mb-5">
                  Ideal for: {pkg.idealFor}
                </div>

                <a href={`/contact?package=${encodeURIComponent(pkg.name)}`}>
                  <Button
                    className={`w-full py-2 text-sm font-medium h-auto ${
                      pkg.popular
                        ? 'modern-btn-primary text-white'
                        : 'modern-btn-secondary text-white'
                    }`}
                  >
                    {pkg.cta}
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </a>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.2}>
          <div className="text-center">
            <Link
              href="/pricing"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors inline-flex items-center gap-1.5"
            >
              Compare all packages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
