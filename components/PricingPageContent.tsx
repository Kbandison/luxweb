'use client'

import { useState } from 'react'
import { Check, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'
import PromoCountdown from '@/components/PromoCountdown'
import CtaButton from '@/components/CtaButton'
import { getCtaLabel, type ActivePromo } from '@/data/promo'
import { addOns, carePlan } from '@/data/packages'

// ── Content ──────────────────────────────────────────────────

const BENEFITS: { title: string; body: string }[] = [
  {
    title: 'AI Lead Assistant.',
    body: "A 24/7 chatbot, a smart contact form that sorts inquiries for you, and instant AI replies so leads never go cold.",
  },
  {
    title: 'Custom design that matches your brand.',
    body: "No templates. Your business doesn't look like every other site in your industry.",
  },
  {
    title: 'Looks flawless on every device.',
    body: 'Mobile-first build with WCAG 2.1 AA accessibility and a Lighthouse 90+ performance guarantee.',
  },
  {
    title: 'Built to show up on Google.',
    body: 'Local SEO, schema markup, Google Business Profile, and Search Console all set up from day one.',
  },
  {
    title: 'Captures every lead.',
    body: 'Contact forms with instant email and SMS notifications, so you never miss a call-ready customer.',
  },
  {
    title: "You'll know what's working.",
    body: 'Google Analytics 4, Open Graph social cards, and a blog-ready CMS included.',
  },
  {
    title: 'Up to 10 pages and 2 revision rounds per phase.',
    body: "The pages that actually drive leads, dialed in until it's right.",
  },
  {
    title: '30-minute training call + 60 days of support.',
    body: 'We hand it off properly and stick around after launch.',
  },
]

const FOR_YOU: string[] = [
  'You run an established local service business and want to look like it',
  "You're tired of a site that doesn't bring in leads",
  'You want a professional partner, not a DIY platform',
]

const NOT_FOR_YOU: string[] = [
  "You're choosing on price alone",
  'A Wix or Squarespace template meets your needs',
  'You want to manage every pixel yourself',
]

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Why not just use Wix, Squarespace, or WordPress?',
    a: "Those are built for people who want to build their own site. This is for owners who'd rather run their business and let a professional handle the website. A DIY site looks like a DIY site, and customers can tell.",
  },
  {
    q: 'How is this different from a cheaper developer?',
    a: 'Cheaper developers usually deliver templates with generic design and weak SEO. The Signature Site is custom-designed for conversion, built on Next.js and Vercel for speed, and set up to generate leads — not just exist online.',
  },
  {
    q: 'How long does it take?',
    a: 'Two to three weeks from kickoff to launch, assuming content and feedback move on schedule.',
  },
  {
    q: 'What do I need to provide?',
    a: 'Your logo, your photos, and details about your services. Need help with the writing or photos? We can add copywriting to your project or recommend a photographer.',
  },
  {
    q: 'What happens after launch?',
    a: '60 days of post-launch support and a 30-minute training call are included. After that, the Care Plan covers ongoing updates and support.',
  },
  {
    q: 'Do you offer payment plans?',
    a: 'Yes — the project is split into three payments: 50% to start, 25% once you sign off on the design, and 25% before launch. That spreads the investment across the build instead of asking for it all up front.',
  },
  {
    q: 'What if I need something bigger than the Signature Site?',
    a: "Let's talk. For custom applications, e-commerce, or complex integrations, we'll scope a custom project.",
  },
]

// ── Component ────────────────────────────────────────────────

export default function PricingPageContent({ promo }: { promo?: ActivePromo | null }) {
  const ctaLabel = getCtaLabel(promo ?? null)

  const scrollToOffer = () => {
    document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* 1. Hero */}
      <section className="px-6 py-20 lg:py-28">
        {/* No scroll-reveal here: it's above the fold, and the headline should paint without waiting on JS. */}
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            A website that actually{' '}
            <span className="text-gradient-purple">brings you customers.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
            Custom, mobile-first websites for local service businesses that want to look like a
            brand, not a listing — built to turn visitors into leads.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CtaButton label={ctaLabel} location="pricing_hero" className="px-8 py-4 text-base font-semibold" />
            <button
              onClick={scrollToOffer}
              className="min-h-11 text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors inline-flex items-center gap-1.5"
            >
              See what's included
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Offer */}
      <section id="offer" className="px-6 py-16 lg:py-20 scroll-mt-20">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="modern-card p-8 sm:p-10 lg:p-12 border-2 border-purple-400/30 animate-subtle-glow">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  The Signature Site
                </h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  For established local service businesses ready to stop looking generic online.
                </p>

                {promo ? (
                  <>
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30">
                      <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                        {promo.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 mb-2">
                      <span className="text-3xl sm:text-4xl font-medium text-gray-400 line-through">
                        {promo.regularPriceLabel}
                      </span>
                      <span className="text-5xl sm:text-6xl font-bold text-white">
                        {promo.salePriceQualifier && (
                          <span className="text-lg sm:text-xl font-medium text-gray-400 mr-2">
                            {promo.salePriceQualifier}
                          </span>
                        )}
                        {promo.salePriceLabel}
                      </span>
                    </div>
                    <p className="text-base text-green-400 font-semibold mb-1">
                      Save {promo.savingsLabel}
                    </p>
                    <p className="text-sm text-gray-400 mb-6">
                      Delivered in 2-3 weeks · 50% to start, 25% at design sign-off, 25% on launch
                    </p>

                    <div className="mb-6">
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                        Offer ends {promo.endsAtLabel}
                      </p>
                      <PromoCountdown endsAtMs={promo.endsAtMs} variant="boxed" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-5xl sm:text-6xl font-bold text-white mb-2">$4,500</div>
                    <p className="text-sm text-gray-400 mb-6">
                      Delivered in 2-3 weeks · 50% to start, 25% at design sign-off, 25% on launch
                    </p>
                  </>
                )}

                {/* Framed as arithmetic, not a claim about past clients. */}
                <p className="mt-4 text-lg sm:text-xl font-medium text-purple-300">
                  A handful of new customers can cover the entire investment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-10">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-medium">{b.title}</span>{' '}
                      <span className="text-gray-400 text-sm">{b.body}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <CtaButton label={ctaLabel} location="pricing_offer" className="px-10 py-4 text-base font-semibold" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Who this is for / not for */}
      <section className="px-6 py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Is this right for you?
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <div className="modern-card p-6 sm:p-8 h-full border border-green-500/20">
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </span>
                  This is for you if...
                </h3>
                <ul className="space-y-3">
                  {FOR_YOU.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm leading-relaxed">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="modern-card p-6 sm:p-8 h-full">
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-400" />
                  </span>
                  This isn't for you if...
                </h3>
                <ul className="space-y-3">
                  {NOT_FOR_YOU.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-gray-400 text-sm leading-relaxed">
                      <X className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. Care Plan */}
      <section className="px-6 py-16 lg:py-20">
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="modern-card p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Keep your site running at its best.
                </h2>
                <p className="text-gray-400">
                  {carePlan.name} —{' '}
                  <span className="text-purple-400 font-semibold">{carePlan.price}</span>
                </p>
              </div>

              <ul className="space-y-3 mb-6 max-w-xl mx-auto">
                {carePlan.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-center text-xs text-gray-400">
                Add it at launch or anytime after. Cancel anytime.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Add-ons (de-emphasized) */}
      <section className="px-6 py-12">
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Optional add-ons
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                {addOns.map((addOn) => (
                  <div
                    key={addOn.name}
                    className="flex items-center justify-between bg-white/[0.02] rounded-lg px-4 py-2.5"
                  >
                    <span className="text-sm text-gray-300">{addOn.name}</span>
                    <span className="text-sm font-medium text-purple-400">{addOn.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="px-6 py-16 lg:py-20">
        <div className="container mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Frequently Asked <span className="text-purple-400">Questions</span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <PricingFAQ />
          </ScrollReveal>
        </div>
      </section>

      {/* 7. Closing CTA */}
      <section className="px-6 py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to build a website that{' '}
              <span className="text-gradient-purple">works as hard as you do?</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Tell us about your business. We'll reply within 24 hours to set up a free 30-minute
              call and see if it's the right fit.
            </p>
            <CtaButton label={ctaLabel} location="pricing_closing" className="px-10 py-4 text-base font-semibold" />
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}

// ── FAQ Accordion ────────────────────────────────────────────

function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {FAQ.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <motion.div
            key={index}
            className="modern-card p-5 hover:border-purple-400/40 transition-colors"
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 text-left text-base font-semibold text-white"
              >
                {faq.q}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-purple-400" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-white/10">
                    <p className="text-gray-300 leading-relaxed text-sm">{faq.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
