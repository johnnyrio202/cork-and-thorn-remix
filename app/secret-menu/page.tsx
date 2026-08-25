import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { SECRET_MENU_ITEMS } from '@/lib/secret-menu'

export const metadata = {
  title: 'Secret Menu | Cork & Thorn',
  description: 'Off-menu builds known only to the inner circle.',
}

export default function SecretMenuPage() {
  return (
    <div className="min-h-screen bg-[#0B111B]">
      <div className="relative border-b border-white/[0.06] overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(226,182,54,0.45) 50%, transparent)',
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-10 md:pb-16 text-center">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40 hover:text-primary transition-colors duration-200 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Full Menu
            </Link>
            <UserButton />
          </div>

          <div className="flex justify-center mb-6">
            <span className="relative flex items-center justify-center w-14 h-14 rounded-full border border-primary/30 bg-white/[0.02] backdrop-blur-md">
              <Lock className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </span>
          </div>

          <p className="font-sans text-xs uppercase tracking-[0.35em] text-primary/70 mb-4">
            Inner Circle Only
          </p>
          <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl text-white leading-none tracking-tight mb-4">
            Secret Menu
          </h1>
          <p className="mt-6 mx-auto max-w-xl font-sans text-sm md:text-base text-white/60 leading-relaxed text-pretty">
            Off-menu builds known only to the inner circle. Ask your server — or don't.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
        {SECRET_MENU_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-6 rounded-xl border border-primary/20 bg-primary/[0.04] px-5 py-4 md:px-6 md:py-5"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-sans text-sm md:text-base text-white font-medium leading-snug mb-1">
                {item.name}
              </h4>
              {item.sub && (
                <p className="font-sans text-xs md:text-sm text-white/50 leading-relaxed">
                  {item.sub}
                </p>
              )}
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-1 shrink-0">
              {item.pours.map((pour, pIdx) => (
                <span key={pIdx} className="font-sans text-sm text-primary whitespace-nowrap">
                  {pour.label} — ${pour.price}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
