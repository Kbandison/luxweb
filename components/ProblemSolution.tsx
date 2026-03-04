'use client'

import { TrendingUp, Search, Sparkles, ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import ScrollReveal from './ScrollReveal'

// Reusable animated counter
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
      else setCount(end)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const pairs = [
  {
    icon: TrendingUp,
    problem: "Losing Customers",
    solution: "We design clear calls-to-action and conversion paths that turn 30% more visitors into paying customers.",
    result: "More leads from the same traffic",
  },
  {
    icon: Search,
    problem: "Low Visibility",
    solution: "SEO-optimized structure and fast load times help you appear when customers search for your services.",
    result: "Found on Google's first page",
  },
  {
    icon: Sparkles,
    problem: "Outdated Look",
    solution: "Modern, responsive design that builds trust instantly. Look bigger and more professional than your competitors.",
    result: "Professional credibility",
  },
]

const stats = [
  { value: 3, suffix: 'x', label: 'More Leads' },
  { value: 40, suffix: '%', label: 'Higher Conversion' },
]

export default function ProblemSolution() {
  return (
    <section className="py-20 lg:py-28 px-6">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Your website should be making you money,{' '}
              <span className="text-gray-500">not costing you customers.</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Row 1: Wide card + Stat */}
          <ScrollReveal className="md:col-span-2">
            <PairCard pair={pairs[0]} />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <StatCard value={stats[0].value} suffix={stats[0].suffix} label={stats[0].label} />
          </ScrollReveal>

          {/* Row 2: Two cards + Stat */}
          <ScrollReveal delay={0.15}>
            <PairCard pair={pairs[1]} />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <PairCard pair={pairs[2]} />
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <StatCard value={stats[1].value} suffix={stats[1].suffix} label={stats[1].label} />
          </ScrollReveal>
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12">
            <button
              onClick={() => {
                const el = document.getElementById('portfolio')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors inline-flex items-center gap-1.5"
            >
              See how we did it
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function PairCard({ pair }: { pair: typeof pairs[0] }) {
  const Icon = pair.icon
  return (
    <div className="glass-card-subtle p-6 lg:p-8 h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">{pair.problem}</h3>
      </div>
      <p className="text-gray-400 leading-relaxed mb-4">{pair.solution}</p>
      <div className="text-sm text-purple-400 font-medium">{pair.result}</div>
    </div>
  )
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/15 p-6 lg:p-8 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
      <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
        <AnimatedCounter end={value} suffix={suffix} />
      </div>
      <div className="text-gray-400 text-sm font-medium">{label}</div>
    </div>
  )
}
