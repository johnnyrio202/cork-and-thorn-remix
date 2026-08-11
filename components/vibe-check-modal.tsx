'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function VibeCheckModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'rules' | 'vip'>('rules')

  const houseRules = [
    'Respect the space and those in it',
    'Premium beverages & hookah are an art form',
    'No phones during live performances',
    'Dress code: Sophisticated casual or better',
    'Reservations recommended, walk-ins welcome',
    'VIP bottle service available',
  ]

  const vipServices = [
    'Priority table reservations',
    'Complimentary appetizers',
    'Bottle service packages',
    'Private event booking',
    'Fast-track entry',
    'Exclusive member events',
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-dark relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-none"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-2 text-foreground transition-colors hover:text-primary"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="spacing-fluid">
              <p className="font-script text-3xl text-primary neon-glow">
                Cork and Thorn
              </p>
              <h2 className="font-heading mb-2 text-3xl text-foreground">
                Welcome
              </h2>
              <p className="mb-8 text-muted-foreground">
                Our House Rules & VIP Fast-Track
              </p>

              {/* Tabs */}
              <div className="mb-8 flex gap-4 border-b border-primary/20">
                {(['rules', 'vip'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'rules' ? 'House Rules' : 'VIP Fast-Track'}
                  </button>
                ))}
              </div>

              {/* Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {activeTab === 'rules' && (
                  <div className="space-y-4">
                    {houseRules.map((rule, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                        <p className="text-foreground">{rule}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'vip' && (
                  <div className="space-y-4">
                    <div className="glass-light mb-6 rounded-none p-4">
                      <h3 className="mb-2 font-heading text-lg text-primary">
                        Become a VIP Member
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Join our exclusive community for premium perks and first access to events.
                      </p>
                    </div>
                    {vipServices.map((service, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                        <p className="text-foreground">{service}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* CTA */}
              <button className="mt-8 w-full bg-primary py-3 text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30">
                {activeTab === 'rules' ? 'Continue' : 'Join VIP'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
