'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'

export function MenuMatrix() {
  const [secretMenuOpen, setSecretMenuOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  const standardMenu = [
    { category: 'Signature Cocktails', items: ['Obsidian Old Fashioned', 'Gold Rush Mule', 'Smoker\'s Dream'] },
    { category: 'Premium Hookah', items: ['Royal Blend', 'Black Cherry Supreme', 'Mint Silk'] },
  ]

  const secretMenu = [
    { category: 'Members Only Cocktails', items: ['The Black Card', 'Insider\'s Paradise', 'Off-Menu Craft'] },
    { category: 'Rare Tobacco Blends', items: ['VIP Reserve', 'Limited Edition', 'Exclusive 2026'] },
  ]

  return (
    <section className="spacing-fluid-lg min-h-screen bg-background">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-heading mb-4 text-5xl text-foreground sm:text-6xl">
            Menu <span className="text-primary">Matrix</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Standard fare & secret menus for authenticated members
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Standard Menu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-dark space-y-6 rounded-none p-8"
          >
            <h3 className="font-heading text-2xl text-foreground">Public Menu</h3>
            {standardMenu.map((section, idx) => (
              <div key={idx}>
                <h4 className="mb-4 text-primary">{section.category}</h4>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-foreground">
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Secret Menu */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-champagne relative space-y-6 rounded-none p-8"
          >
            {!authenticated && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                <Lock className="mb-4 h-12 w-12 text-primary" />
                <p className="mb-6 text-center text-foreground">Authenticate to unlock</p>
                <button
                  onClick={() => setAuthenticated(true)}
                  className="bg-primary px-6 py-2 text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30"
                >
                  Authenticate
                </button>
              </div>
            )}
            <h3 className="font-heading text-2xl text-foreground">Secret Menu</h3>
            {authenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {secretMenu.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="mb-4 text-primary">{section.category}</h4>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-3 text-foreground">
                          <span className="text-primary">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            )}
            {authenticated && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Unlock className="h-4 w-4" />
                Authenticated
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
