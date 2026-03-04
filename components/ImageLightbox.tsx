'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface ImageLightboxProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  projectTitle?: string
  liveLink?: string
}

export default function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  projectTitle,
  liveLink
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [mounted, setMounted] = useState(false)

  // Wait for client mount before using portal
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goToPrevious()
      else if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!isOpen || !mounted) return null

  const lightbox = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* ===== CLOSE BUTTON — below nav ===== */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose() }}
          className="fixed top-20 right-4 z-[110] w-14 h-14 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full flex items-center justify-center transition-colors backdrop-blur-md border-2 border-white/30"
          aria-label="Close lightbox"
        >
          <X className="w-7 h-7 text-white" />
        </button>

        {/* ===== TOP LEFT: counter + title ===== */}
        <div
          className="fixed top-20 left-4 z-[110] flex items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="px-3 py-2 bg-black/70 rounded-lg backdrop-blur-md border border-white/20 text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </span>
          {projectTitle && (
            <span className="px-3 py-2 bg-black/70 rounded-lg backdrop-blur-md border border-white/20 text-white font-semibold text-sm hidden sm:inline-block">
              {projectTitle}
            </span>
          )}
        </div>

        {/* ===== VISIT SITE — below nav, center ===== */}
        {liveLink && (
          <div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[110]"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-full text-white text-sm font-semibold transition-colors shadow-lg shadow-purple-500/30"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Live Site
            </a>
          </div>
        )}

        {/* Main Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center px-4 pt-28 pb-28 md:px-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full max-w-7xl max-h-full">
            <Image
              src={images[currentIndex]}
              alt={`${projectTitle || 'Project'} - Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Nav Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious() }}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-md border border-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext() }}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-md border border-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] flex gap-2 px-4 py-3 bg-black/70 rounded-full backdrop-blur-md border border-white/20 max-w-[90vw] overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index) }}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all duration-200 flex-shrink-0 ${
                  currentIndex === index
                    ? 'ring-2 ring-white scale-110'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Mobile hint */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] text-white/60 text-sm md:hidden">
          Swipe or use arrows to navigate
        </div>
      </motion.div>
    </AnimatePresence>
  )

  // Portal to document.body to escape parent stacking contexts
  return createPortal(lightbox, document.body)
}
