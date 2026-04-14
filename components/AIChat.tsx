'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, sendMessage, status } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  const isLoading = status === 'submitted' || status === 'streaming'

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const suggestions = [
    'What do you build?',
    'How much does a site cost?',
    'How long does it take?',
  ]

  return (
    <>
      {/* Floating button — sits above FloatingCTA on desktop, above mobile CTA bar */}
      <motion.button
        onClick={() => setOpen(true)}
        className={`fixed bottom-24 right-6 md:bottom-24 md:right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 shadow-lg shadow-purple-500/30 flex items-center justify-center group ${
          open ? 'pointer-events-none opacity-0' : ''
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[28rem] sm:h-[32rem] max-h-[calc(100vh-8rem)] bg-gray-950 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-purple-600/10 to-violet-600/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">LuxWeb Assistant</div>
                  <div className="text-[10px] text-gray-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Hi! I&apos;m the LuxWeb assistant. Ask me about our services, pricing, or process — or just say hi.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage({ text: s })}
                        className="text-[11px] px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-full transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/[0.05] border border-white/10 text-gray-200'
                    }`}
                  >
                    {message.parts.map((part, i) => {
                      if (part.type === 'text') {
                        return (
                          <div key={i} className="whitespace-pre-wrap">
                            {part.text}
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-white/10 p-3 bg-white/[0.02]"
            >
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about pricing, process, timeline..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-600 mt-1.5 text-center">
                Powered by Claude · Responses may contain inaccuracies
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
