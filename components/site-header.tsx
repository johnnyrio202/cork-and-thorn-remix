'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { ShoppingBag, Plus, Minus, Trash2, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { useCart } from '@/components/cart-provider'
import { useVIP } from '@/components/vip-provider'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/menu', label: 'Menu' },
  { href: '/shop', label: 'Shop' },
  { href: '/private-parties', label: 'Private Parties' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { isVIP, toggleVIP } = useVIP()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 40)
  })

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Ambient underglow — pulses cyan/magenta for public, champagne rose for VIP */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 -bottom-6 h-12 blur-2xl"
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
                        'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.45), rgba(255,0,255,0.45), rgba(0,255,255,0.0))',
                        'linear-gradient(90deg, rgba(255,0,255,0.45), rgba(0,255,255,0.45), rgba(255,0,255,0.45), rgba(0,255,255,0.45))',
                        'linear-gradient(90deg, rgba(0,255,255,0.0), rgba(0,255,255,0.45), rgba(255,0,255,0.45), rgba(0,255,255,0.0))',
                      ],
                    }
              }
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop floating pill nav */}
          <motion.nav
            animate={{
              backgroundColor: scrolled ? 'rgba(245, 236, 210, 0.04)' : 'rgba(245, 236, 210, 0)',
              borderColor: scrolled ? 'rgba(226, 182, 54, 0.18)' : 'rgba(226, 182, 54, 0)',
            }}
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md lg:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium tracking-wide transition-colors',
                  pathname === link.href
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>

          <div className="flex items-center gap-2">
            <VipTrigger isVIP={isVIP} onToggle={toggleVIP} />
            <CartButton />
          </div>
        </div>
      </motion.div>
    </header>
  )
}

function VipTrigger({
  isVIP,
  onToggle,
}: {
  isVIP: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-pressed={isVIP}
      aria-label={isVIP ? 'VIP access active' : 'Activate VIP access'}
      className={cn(
        'relative hidden items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition-colors sm:inline-flex',
        isVIP
          ? 'border-[#d4af84]/60 text-[#0B111B]'
          : 'border-primary/50 text-primary',
      )}
      style={
        isVIP
          ? {
              background: 'linear-gradient(90deg, #e2b636, #d4af84)',
              boxShadow: '0 0 24px rgba(212, 175, 132, 0.6)',
            }
          : { boxShadow: '0 0 18px rgba(226, 182, 54, 0.35)' }
      }
    >
      {/* animated shimmer sweep */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={{ backgroundPositionX: ['200%', '-200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
      {isVIP ? (
        <Crown className="relative h-4 w-4" />
      ) : (
        <Sparkles className="relative h-4 w-4" />
      )}
      <span className="relative">{isVIP ? 'VIP Active' : 'VIP Access'}</span>
    </motion.button>
  )
}

function CartButton() {
  const { count, lines, total, open, setOpen, updateQuantity, removeItem } =
    useCart()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Open cart"
          />
        }
      >
        <ShoppingBag className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {count}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col bg-card sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl tracking-wide">
            Your Bag
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Your bag is empty.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="flex flex-col gap-4 py-2">
                {lines.map((line) => (
                  <li key={line.id} className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
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
                        <p className="text-sm font-medium">{line.name}</p>
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
                          onClick={() =>
                            updateQuantity(line.id, line.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-secondary"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(line.id, line.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-secondary"
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
            <div className="border-t border-border px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-heading text-2xl">${total}</span>
              </div>
              <Button className="w-full shadow-glow-primary" size="lg">
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
