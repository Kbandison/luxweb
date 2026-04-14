'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, X, ChevronDown, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

// ── Content ──────────────────────────────────────────────────

const BENEFITS: { title: string; body: string }[] = [
  {
    title: 'AI Lead Assistant.',
    body: "A 24/7 chatbot that answers customer questions, a smart contact form that summarizes and prioritizes inquiries for you, and AI-written replies that go out instantly so leads don't go cold.",
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
  'You understand that your website is an investment, not an expense',
  'You want a professional partner, not a DIY platform',
]

const NOT_FOR_YOU: string[] = [
  "You're looking for the cheapest option available",
  'A basic template site from Wix or Squarespace meets your needs',
  "You're not ready to invest in growing your business",
  'You want to manage every pixel yourself',
]

const CARE_PLAN_FEATURES: string[] = [
  'Hosting, security, and software updates handled for you',
  'Small content edits whenever you need them',
  'Monthly analytics review so you know what\'s working',
  'Priority support when something needs attention',
  'Backups and uptime monitoring running in the background',
]

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Why not just use Wix, Squarespace, or WordPress?',
    a: "Those platforms are built for people who want to build their own site. This is for business owners who'd rather focus on running their business while a professional handles the website. A DIY site looks like a DIY site — and your customers can tell.",
  },
  {
    q: 'How is this different from a cheaper developer?',
    a: 'Cheaper developers typically deliver template sites with generic design, weak SEO, and no strategy behind the layout. The Signature Site is custom-designed for conversion, built on a modern tech stack (Next.js and Vercel) for speed and reliability, and set up to actually generate leads — not just exist online.',
  },
  {
    q: 'How long does it take?',
    a: 'Two to three weeks from kickoff to launch, assuming content and feedback move on schedule.',
  },
  {
    q: 'What do I need to provide?',
    a: 'Your logo, your photos (or access to your existing ones), and information about your services. If you need help with copywriting or photography, we can recommend partners or add copywriting to your project.',
  },
  {
    q: 'What happens after launch?',
    a: 'You get 60 days of post-launch support included, plus a 30-minute training call so you can run with it. Most clients continue with the Care Plan for ongoing updates and support.',
  },
  {
    q: 'Do you offer payment plans?',
    a: 'Yes — 50% to start, 50% on launch. For most clients that splits the investment across the 2-3 week build.',
  },
  {
    q: 'What if I need something bigger than the Signature Site?',
    a: "Let's talk. If your needs go beyond a service-business site (custom applications, e-commerce, complex integrations), reach out and we'll scope a custom project.",
  },
]

// ── Component ────────────────────────────────────────────────

export default function PricingPageContent() {
  const scrollToOffer = () => {
    document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* 1. Hero */}
      <section className="px-6 py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              A website that actually{' '}
              <span className="text-gradient-purple">brings you customers.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto mb-10">
              Custom-designed, mobile-first websites for local service businesses that want to look
              like a brand — not a listing. Built to turn visitors into leads, so your business
              grows beyond word-of-mouth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact">
                <Button className="modern-btn-primary text-white px-8 py-4 text-base font-semibold h-auto">
                  Start Your Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <button
                onClick={scrollToOffer}
                className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors inline-flex items-center gap-1.5"
              >
                See what's included
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
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

                <div className="text-5xl sm:text-6xl font-bold text-white mb-2">$4,500</div>
                <p className="text-sm text-gray-500 mb-6">
                  Delivered in 2-3 weeks · 50% to start, 50% on launch
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300 font-medium">
                    Most clients recover their investment with just a handful of new customers.
                  </span>
                </div>
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
                <Link href="/contact">
                  <Button className="modern-btn-primary text-white px-10 py-4 text-base font-semibold h-auto">
                    Start Your Project
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Is this right for you?
              </h2>
              <p className="text-gray-400">
                We're a better fit for some businesses than others.
              </p>
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
                    <X className="w-4 h-4 text-gray-500" />
                  </span>
                  This isn't for you if...
                </h3>
                <ul className="space-y-3">
                  {NOT_FOR_YOU.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-gray-500 text-sm leading-relaxed">
                      <X className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
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
                  The Care Plan —{' '}
                  <span className="text-purple-400 font-semibold">$175/month</span>
                </p>
              </div>

              <ul className="space-y-3 mb-6 max-w-xl mx-auto">
                {CARE_PLAN_FEATURES.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="text-center text-xs text-gray-500">
                Most clients add the Care Plan at launch. Cancel anytime.
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
                <div className="flex items-center justify-between bg-white/[0.02] rounded-lg px-4 py-2.5">
                  <span className="text-sm text-gray-300">Professional copywriting</span>
                  <span className="text-sm font-medium text-purple-400">+$850</span>
                </div>
                <div className="flex items-center justify-between bg-white/[0.02] rounded-lg px-4 py-2.5">
                  <span className="text-sm text-gray-300">Additional pages</span>
                  <span className="text-sm font-medium text-purple-400">+$400 each</span>
                </div>
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
              Tell us about your business and your goals. We'll reply within 24 hours to set up a
              free 20-minute call and see if the Signature Site is the right fit.
            </p>
            <Link href="/contact">
              <Button className="modern-btn-primary text-white px-10 py-4 text-base font-semibold h-auto">
                Start the Conversation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
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
            className="modern-card p-5 cursor-pointer hover:border-purple-400/40 transition-colors"
            onClick={() => setOpenIndex(isOpen ? null : index)}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-white">{faq.q}</h3>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-purple-400" />
              </motion.div>
            </div>
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
