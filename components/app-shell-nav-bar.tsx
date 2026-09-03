'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useVIP } from '@/components/vip-provider'
import { useCart } from '@/components/cart-provider'
import { Crown, ShoppingBag, Plus, Minus, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

// Single canonical destination list — replaces two previously inconsistent
// ones (the old bottom nav had Shop but not Events; the old hamburger menu
// had Events but not Shop).
const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Sips & Exhales' },
  { href: '/reservations', label: 'Experiences' },
  { href: '/shop', label: 'Shop' },
  { href: '/private-parties', label: 'Culture' },
  { href: '/events', label: 'Events' },
]

export function AppShellNavBar() {
  const pathname = usePathname()
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
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-background/70 backdrop-blur-xl border-b border-primary/20">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5">
          <Link href="/" aria-label="Cork and Thorn home">
            <Image
              src="/images/cork-thorn-logo-flat.png"
              alt="Cork and Thorn"
              height={48}
              width={280}
              className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(226,182,54,0.5)]"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleVIP}
              className={`relative rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 lg:text-sm ${
                isVIP
                  ? 'bg-gradient-to-r from-primary to-rose-400 text-black shadow-lg shadow-rose-400/40'
                  : 'glass-champagne text-foreground'
              }`}
            >
              <span className="flex items-center gap-1">
                {isVIP && <Crown className="h-3 w-3 lg:h-4 lg:w-4" />}
                {isVIP ? 'VIP' : 'VIP Access'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="mx-auto flex h-14 max-w-[1400px] items-center gap-2.5 overflow-x-auto border-t border-primary/10 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
                  isActive
                    ? 'bg-primary text-black'
                    : 'border border-primary/40 text-foreground hover:border-primary/70'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              key="cart-backdrop"
              aria-hidden="true"
              onClick={() => setCartOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[110] bg-black/60"
            />
            <motion.div
              key="cart-drawer"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-0 right-0 z-[120] flex h-full w-full max-w-sm flex-col bg-[rgba(11,17,27,0.97)] border-l border-white/10 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                <h2 className="font-heading text-2xl tracking-wide text-foreground">Your Bag</h2>
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
                              <p className="text-sm font-medium text-foreground">{line.name}</p>
                              <button
                                onClick={() => removeItem(line.id)}
                                className="text-muted-foreground transition-colors hover:text-destructive"
                                aria-label={`Remove ${line.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-sm text-muted-foreground">${line.price}</p>
                            <div className="mt-auto flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 hover:bg-white/5"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm">{line.quantity}</span>
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
                      <span className="font-heading text-2xl text-foreground">${total}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full rounded-full bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-black transition-opacity disabled:opacity-50"
                    >
                      {isCheckingOut ? 'Redirecting…' : 'Checkout'}
                    </button>
                    {checkoutError && (
                      <p className="mt-2 text-center text-sm text-destructive">{checkoutError}</p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Safe spacing for content below the fixed header */}
      <div className="h-[120px]" />
    </>
  )
}
