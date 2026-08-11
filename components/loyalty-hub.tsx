'use client'

import { motion } from 'framer-motion'
import { Apple, Star, Zap } from 'lucide-react'

export function LoyaltyHub() {
  const memberBenefits = [
    {
      icon: Star,
      title: 'Priority Access',
      description: 'Skip the line, reserve first',
    },
    {
      icon: Zap,
      title: 'Exclusive Events',
      description: 'VIP-only nights & early drops',
    },
    {
      icon: Apple,
      title: 'Apple Wallet',
      description: 'Digital black card at your fingertips',
    },
  ]

  const cardDetails = {
    memberName: 'Member Name',
    tier: 'Platinum',
    balance: '2,450 Points',
    lastUsed: 'Last used 2 days ago',
  }

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
            Loyalty <span className="text-primary">Hub</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Rewards, tier status, and your digital black card
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Digital Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-8 font-heading text-2xl text-foreground">
              Your Black Card
            </h3>

            {/* Card Placeholder */}
            <motion.div
              whileHover={{ scale: 1.02, rotateZ: 2 }}
              className="glass-dark relative aspect-video rounded-none p-8 shadow-2xl"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">CORK & THORN</p>
                  <p className="font-heading text-2xl text-primary">BLACK CARD</p>
                </div>

                <div>
                  <p className="mb-4 text-sm text-foreground">
                    {cardDetails.memberName}
                  </p>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">TIER</p>
                      <p className="font-heading text-lg text-primary">
                        {cardDetails.tier}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">POINTS</p>
                      <p className="font-heading text-lg text-primary">
                        {cardDetails.balance}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-30 shimmer rounded-none" />
            </motion.div>

            {/* Apple Wallet CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 flex w-full items-center justify-center gap-2 bg-black py-4 text-white transition-all hover:shadow-lg"
            >
              <Apple className="h-5 w-5" />
              Add to Apple Wallet
            </motion.button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {cardDetails.lastUsed}
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="font-heading text-2xl text-foreground">
              Member Benefits
            </h3>

            {memberBenefits.map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                  className="glass-light rounded-none p-6"
                >
                  <Icon className="mb-4 h-8 w-8 text-primary" />
                  <h4 className="mb-2 font-heading text-lg text-foreground">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </motion.div>
              )
            })}

            {/* Tier Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-champagne mt-8 rounded-none p-6"
            >
              <h4 className="mb-4 font-heading text-lg text-foreground">
                Next Tier: Diamond
              </h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Earn 550 more points to unlock premium status
              </p>
              <div className="glass-light relative h-2 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: '0%' }}
                  whileInView={{ width: '81.67%' }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-primary to-primary/60"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">4,450 / 5,000</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
