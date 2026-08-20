'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useVIP } from '@/components/vip-provider'
import { useCart } from '@/components/cart-provider'
import { Logo } from '@/components/logo'
import { Crown, Menu, X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

export function AppShellHeader() {
  const { isVIP, toggleVIP } = useVIP()
  const {
    count,
    lines,
    total,
    open: cartOpen,
    setOpen: setCartOpen,
    updateQuantity,
    removeItem,
  } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const { scrollY } = useScroll()

  async function handleCheckout() {
    setIsCheckingOut(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: lines.map((line) => ({ id: line.id, quantity: line.quantity })),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.href) {
        throw new Error(data.error ?? 'Unable to start checkout')
      }
      window.location.href = data.href
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Unable to start checkout')
      setIsCheckingOut(false)
    }
  }

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40)
  })

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100]">

        {/* Ambient underglow — always present so the neon bleeds over the
            kinetic canvas scrubbing beneath it, even at the very top. Pulses
            cyan/magenta for public, champagne rose for VIP. Intensifies once
            the frosted backdrop engages on scroll. */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: scrolled ? 1 : 0.72 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-x-0 -bottom-8 h-16 blur-3xl"
        >
          <motion.div
            className="h-full w-full"
            animate={
              isVIP
                ? {
                    background: [
                      'linear-gradient(90deg, rgba(212,175,132,0.0), rgba(212,175,132,0.55), rgba(226,182,54,0.35), rgba(212,175,132,0.0))',
                      'linear-gradient(90deg, rgba(212,175,132,0.35), rgba(226,182,54,0.5), rgba(212,175,132,0.55), rgba(226,182,54,0.35))',
                      'linear-gradient(90deg, rgba(212,175,132,0.0), rgba(212,175,132,0.55), rgba(226,182,54,0.35), rgba(212,175,132,0.0))',
                    ],
                  }
                : {
                    background: [
                      'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.55), rgba(255,0,255,0.55), rgba(0,255,255,0.0))',
                      'linear-gradient(90deg, rgba(255,0,255,0.55), rgba(0,255,255,0.55), rgba(255,0,255,0.55), rgba(0,255,255,0.55))',
                      'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.55), rgba(255,0,255,0.55), rgba(0,255,255,0.0))',
                    ],
                  }
            }
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Scroll-reactive frosted glass backdrop */}
        <motion.div
          animate={{
            backgroundColor: scrolled ? 'rgba(11, 17, 27, 0.72)' : 'rgba(11, 17, 27, 0)',
            borderColor: scrolled
              ? isVIP
                ? 'rgba(212, 175, 132, 0.4)'
                : 'rgba(226, 182, 54, 0.22)'
              : 'rgba(226, 182, 54, 0)',
            backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
            boxShadow: scrolled
              ? isVIP
                ? '0 8px 40px -12px rgba(212, 175, 132, 0.5)'
                : '0 8px 40px -12px rgba(0, 255, 255, 0.25)'
              : '0 0 0 0 rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative border-b"
        >
          <div className="relative h-32 px-4 lg:px-6 flex items-center justify-between">

            {/* Left: Hamburger Menu */}
            <div className="z-20">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[240px] sm:w-[380px] lg:w-[520px] flex justify-center">
              <Logo />
            </div>

            {/* Right: VIP Access + Cart */}
            <div className="flex items-center gap-2 lg:gap-3 z-20">
              <button
                onClick={toggleVIP}
                className={`group relative px-4 py-2 rounded-full font-medium text-xs lg:text-sm transition-all duration-300 ${
                  isVIP
                    ? 'bg-gradient-to-r from-[#E2B636] to-rose-400 text-black shadow-lg shadow-rose-400/40'
                    : 'glass-champagne text-foreground hover:shadow-lg hover:shadow-cyan-400/20'
                }`}
              >
                <span className="relative flex items-center gap-1">
                  {isVIP && <Crown className="w-3 h-3 lg:w-4 lg:h-4" />}
                  <span>{isVIP ? 'VIP' : 'VIP ACCESS'}</span>
                </span>
                {!isVIP && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </button>

              <button
                type="button"
                onClick={() => setCartOpen(!cartOpen)}
                className="group relative p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={1.5} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
                    {count}
                  </span>
                )}
              </button>
            </div>

          </div>
        </motion.div>

        {/* Cart drawer */}
        <AnimatePresence>
          {cartOpen && (
            <>
              <motion.div
                aria-hidden="true"
                onClick={() => setCartOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[110] bg-black/60"
              />
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed top-0 right-0 z-[120] flex h-full w-full max-w-sm flex-col bg-[rgba(11,17,27,0.97)] border-l border-white/10 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                  <h2 className="font-heading text-2xl tracking-wide text-foreground">
                    Your Bag
                  </h2>
                  <button
                    onClick={() => setCartOpen(false)}
                    aria-label="Close cart"
                    className="p-1 text-foreground hover:text-primary transition-colors"
                  >
                    <X className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </div>

                {lines.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-5">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
                    <p className="text-muted-foreground">Your bag is empty.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-5">
                      <ul className="flex flex-col gap-4 py-4">
                        {lines.map((line) => (
                          <li key={line.id} className="flex gap-3">
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-white/5">
                              <Image
                                src={line.image || '/placeholder.svg'}
                                alt={line.name}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium text-foreground">
                                  {line.name}
                                </p>
                                <button
                                  onClick={() => removeItem(line.id)}
                                  className="text-muted-foreground transition-colors hover:text-destructive"
                                  aria-label={`Remove ${line.name}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                ${line.price}
                              </p>
                              <div className="mt-auto flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                  className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 hover:bg-white/5"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center text-sm">
                                  {line.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                  className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 hover:bg-white/5"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-white/10 px-5 py-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-heading text-2xl text-foreground">
                          ${total}
                        </span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full rounded-full bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-black transition-opacity disabled:opacity-50"
                      >
                        {isCheckingOut ? 'Redirecting…' : 'Checkout'}
                      </button>
                      {checkoutError && (
                        <p className="mt-2 text-center text-sm text-destructive">
                          {checkoutError}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hamburger dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-32 left-0 min-w-56 bg-[rgba(11,17,27,0.95)] border border-white/10 border-t-0 backdrop-blur-xl rounded-br-lg"
            >
              <nav className="flex flex-col gap-1 p-4">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/menu', label: 'The Sips' },
                  { href: '/menu', label: 'The Exhales' },
                  { href: '/reservations', label: 'The Experiences' },
                  { href: '/private-parties', label: 'The Culture' },
                  { href: '/events', label: 'Events' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2.5 text-sm text-foreground hover:text-primary transition-colors border-b border-white/5"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Member Access group — always-available account entry points */}
                <span className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary/70">
                  Member Access
                </span>
                {[
                  { href: '/loyalty', label: 'Inner Circle Login' },
                  { href: '/affiliate', label: 'Affiliate Program Login' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2.5 text-sm text-foreground hover:text-primary transition-colors border-b border-white/5 last:border-0"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* Safe spacing for content below fixed header */}
      <div className="h-32" />
    </>
  )
}
