'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { shouldReduceMotion, viewportConfig } from '@/lib/motion'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  amount?: number
  className?: string
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  amount = 0.3,
  className = ''
}: ScrollRevealProps) {
  const reduceMotion = shouldReduceMotion()
  
  const directionVariants = {
    up: { opacity: 0, y: reduceMotion ? 0 : 60 },
    down: { opacity: 0, y: reduceMotion ? 0 : -60 },
    left: { opacity: 0, x: reduceMotion ? 0 : -60 },
    right: { opacity: 0, x: reduceMotion ? 0 : 60 }
  }

  const variants = {
    hidden: directionVariants[direction],
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.1 : duration,
        delay: reduceMotion ? 0 : delay,
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for multiple child animations
export function StaggerContainer({
  children,
  staggerChildren = 0.1,
  className = ''
}: {
  children: ReactNode
  staggerChildren?: number
  className?: string
}) {
  const reduceMotion = shouldReduceMotion()

  const containerVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : staggerChildren,
        delayChildren: reduceMotion ? 0 : 0.1
      }
    }
  }

  return (
    <motion.div
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={containerVariants}
      className={className}
      style={{ opacity: 1 }} // CSS fallback
    >
      {children}
    </motion.div>
  )
}

// Item for use within StaggerContainer
export function StaggerItem({
  children,
  direction = 'up',
  className = ''
}: {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}) {
  const reduceMotion = shouldReduceMotion()

  const directionVariants = {
    up: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 30 },
    down: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : -30 },
    left: { opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -30 },
    right: { opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : 30 }
  }

  const variants = {
    hidden: directionVariants[direction],
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.1 : 0.5,
      }
    }
  }

  return (
    <motion.div
      variants={variants}
      className={className}
      style={{ opacity: 1 }} // CSS fallback for visibility
    >
      {children}
    </motion.div>
  )
}