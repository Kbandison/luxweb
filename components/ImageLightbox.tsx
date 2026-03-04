'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Top Bar: counter, title, live link, close */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            {/* Image Counter */}
            <span className="text-white/70 text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>

            {/* Project Title */}
            {projectTitle && (
              <span className="text-white font-semibold text-base hidden sm:inline">
                {projectTitle}
              </span>
            )}

            {/* Live Site Link */}
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 rounded-full border border-purple-400/30 text-purple-300 text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visit Site
              </a>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-md border border-white/20"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Main Image Container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex items-center justify-center p-4 md:p-20"
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

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-md border border-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-md border border-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          </>
        )}

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 px-4 py-3 bg-black/50 rounded-full backdrop-blur-md border border-white/20 max-w-full overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
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

        {/* Mobile swipe hint */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white/60 text-sm md:hidden">
          Swipe or use arrows to navigate
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
