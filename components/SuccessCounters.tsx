'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { TrendingUp, Users, Globe, Award } from 'lucide-react'

interface CounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

function AnimatedCounter({ end, duration = 2, prefix = '', suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0)
  const counterRef = useRef(null)
  const isInView = useInView(counterRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * end)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <span ref={counterRef} className="font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export default function SuccessCounters() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })

  const stats = [
    {
      icon: Globe,
      value: 150,
      suffix: '+',
      label: 'Websites Delivered',
      description: 'Professional sites that convert',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: Users,
      value: 200,
      suffix: '+',
      label: 'Happy Clients',
      description: 'Businesses we\'ve helped grow',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      icon: TrendingUp,
      value: 45,
      suffix: '%',
      label: 'Average ROI Increase',
      description: 'Revenue boost for our clients',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: Award,
      value: 20,
      suffix: '+',
      label: 'Years Experience',
      description: 'Proven track record',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={containerRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
            variants={itemVariants}
          >
            Proven Results That <span className="text-purple-400">Speak for Themselves</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Don't just take our word for it. Here are the numbers that matter.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`modern-card p-6 text-center hover:transform hover:scale-[1.02] transition-all duration-300 ${stat.bgColor} ${stat.borderColor} border`}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-center mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix}
                  duration={2.5}
                />
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                {stat.label}
              </h3>
              
              <p className="text-sm text-gray-400">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
        >
          <div className="modern-card p-8 max-w-3xl mx-auto bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-gray-300 leading-relaxed">
              These numbers represent real businesses that trusted us to transform their online presence. 
              Your business could be next in line for this kind of growth.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}