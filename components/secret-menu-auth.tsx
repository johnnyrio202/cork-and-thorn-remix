'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'

export function SecretMenuAuth() {
  const [passcode, setPasscode] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      if (passcode.toLowerCase() === 'vip') {
        setIsUnlocked(true)
        toast.success('Secret Menu unlocked')
        setPasscode('')
      } else {
        toast.error('Invalid passcode')
        setPasscode('')
      }
      setIsLoading(false)
    }, 800)
  }

  return (
    <section className="relative min-h-screen bg-[#0B111B] flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient Glow - pulsing radial gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/20 via-magenta-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-auto px-6"
      >
        {/* Glassmorphic Card */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="font-heading text-4xl tracking-wider mb-4 text-balance">
              UNAPOLOGETIC
              <br />
              <span className="text-primary neon-glow">EXCELLENCE</span>
            </h2>
            <p className="text-sm text-muted-foreground tracking-wide">
              Enter Passcode for The Secret Menu
            </p>
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              animate={{
                scale: isUnlocked ? 1.1 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 10,
              }}
            >
              <Lock
                className={`w-8 h-8 transition-colors ${
                  isUnlocked ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
            </motion.div>
          </div>

          {/* Input Form */}
          {!isUnlocked ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  aria-label="Passcode"
                  className="w-full bg-transparent text-center text-lg tracking-widest placeholder:text-muted-foreground/40 focus:outline-none border-b-2 border-[#E2B636] transition-colors focus:border-primary pb-3 text-foreground"
                />
                {/* Animated bottom border glow */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E2B636] to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform origin-center" />
              </div>

              <button
                type="submit"
                disabled={isLoading || !passcode.trim()}
                className="group relative w-full py-3 px-6 rounded-lg font-semibold text-sm tracking-wide overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#E2B636] to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity group-disabled:opacity-0" />
                {/* Glow on hover */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#E2B636]/0 via-[#E2B636]/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity group-disabled:opacity-0 blur-lg"
                />
                <span className="relative text-black">
                  {isLoading ? 'Unlocking...' : 'Unlock Menu'}
                </span>
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <p className="text-lg text-primary font-semibold tracking-wide">
                Welcome to the Secret Menu
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Curated experiences await
              </p>
            </motion.div>
          )}
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-muted-foreground mt-6 tracking-wide">
          Hint: Try "VIP"
        </p>
      </motion.div>
    </section>
  )
}
