'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import Image from 'next/image'

export function TheArmory() {
  const drops = [
    {
      id: 1,
      name: 'Black Edition Hoodie',
      scarcity: 12,
      total: 50,
      priceUSD: 95,
      image: '/images/merch-hoodie.png',
    },
    {
      id: 2,
      name: 'Gold Logo Tee',
      scarcity: 28,
      total: 100,
      priceUSD: 35,
      image: '/images/merch-tee.png',
    },
    {
      id: 3,
      name: 'Premium Snapback',
      scarcity: 8,
      total: 30,
      priceUSD: 45,
      image: '/images/merch-hat.png',
    },
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
            The <span className="text-primary">Armory</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Premium streetwear drops. Limited editions. Member exclusive.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {drops.map((drop, idx) => (
            <motion.div
              key={drop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="glass-dark rounded-none"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                <Image
                  src={drop.image || '/placeholder.svg'}
                  alt={drop.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>

              {/* Product Info */}
              <div className="space-y-4 p-6">
                <div>
                  <h3 className="mb-2 font-heading text-lg text-foreground">
                    {drop.name}
                  </h3>
                  <p className="font-heading text-2xl text-primary">
                    ${drop.priceUSD}
                  </p>
                </div>

                {/* Scarcity Meter */}
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">Items Left</span>
                    <span className="text-primary font-medium">
                      {drop.scarcity} of {drop.total}
                    </span>
                  </div>
                  <div className="glass-light relative h-2 overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: '0%' }}
                      whileInView={{
                        width: `${(drop.scarcity / drop.total) * 100}%`,
                      }}
                      transition={{ duration: 0.8, delay: idx * 0.15 }}
                      className="h-full bg-gradient-to-r from-primary to-primary/40"
                    />
                  </div>
                </div>

                {/* Countdown */}
                <div className="glass-light flex items-center gap-2 rounded-none p-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Drop ends in 48h</span>
                </div>

                {/* CTA */}
                <button className="w-full bg-primary py-3 text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
