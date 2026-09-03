'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { VOL1, VOL2, VOL3, type Item } from '@/components/full-menu-matrix'

// Unlinked design preview — not part of the production /menu. First pass at
// a card-grid layout (inspired by a user-supplied "Obsidian Lounge" mockup)
// as an alternative to the current stacked-list style, using real cocktail
// data (not placeholder content) so it's a fair comparison. Now with a
// search bar + category chips — the actual answer to "easily navigated" for
// a large menu, not just a visual restyle. More reference mockups are
// coming — this establishes the pattern/scaffolding, not a final design.

type Volume = { id: string; label: string; sub: string; items: Item[] }

const VOLUMES: Volume[] = [
  { id: 'vol1', label: 'Vol 1', sub: 'The Blooms', items: VOL1 },
  { id: 'vol2', label: 'Vol 2', sub: 'The Roots', items: VOL2 },
  { id: 'vol3', label: 'Vol 3', sub: 'The Mock Garden', items: VOL3 },
]

function matchesQuery(item: Item, query: string) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    item.name.toLowerCase().includes(q) ||
    !!item.sub?.toLowerCase().includes(q) ||
    !!item.menuDescription?.toLowerCase().includes(q)
  )
}

export default function MenuTestPage() {
  const [active, setActive] = useState<string>('all')
  const [query, setQuery] = useState('')

  const categoryFiltered = active === 'all' ? VOLUMES : VOLUMES.filter((v) => v.id === active)
  const visible = categoryFiltered
    .map((v) => ({ ...v, items: v.items.filter((item) => matchesQuery(item, query)) }))
    .filter((v) => v.items.length > 0)
  const totalResults = visible.reduce((sum, v) => sum + v.items.length, 0)

  return (
    <div className="min-h-screen bg-[#0B111B] px-5 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-primary/80 mb-3">
            Curated Reserve Cocktails
          </p>
          <h1 className="font-heading text-2xl uppercase tracking-[0.15em] text-bone sm:text-3xl">
            Cork &amp; Thorn
          </h1>
        </header>

        {/* Search */}
        <div className="mx-auto mb-6 max-w-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or ingredient…"
              className="w-full rounded-full border border-white/[0.08] bg-white/[0.03] py-2.5 pl-11 pr-10 font-sans text-sm text-bone placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="mb-3 flex flex-wrap justify-center gap-2.5">
          <FilterPill active={active === 'all'} onClick={() => setActive('all')}>
            All Creations
          </FilterPill>
          {VOLUMES.map((v) => (
            <FilterPill key={v.id} active={active === v.id} onClick={() => setActive(v.id)}>
              {v.sub}
            </FilterPill>
          ))}
        </div>

        <p className="mb-10 text-center font-sans text-[11px] uppercase tracking-[0.15em] text-white/25">
          {totalResults} {totalResults === 1 ? 'creation' : 'creations'}
        </p>

        {/* Card grid — grouped by volume with a small heading when showing all */}
        {totalResults === 0 ? (
          <p className="py-16 text-center font-sans text-sm text-white/40">
            Nothing matches &ldquo;{query}&rdquo; — try a different name or ingredient.
          </p>
        ) : (
          <div className="space-y-10">
            {visible.map((v) => (
              <section key={v.id}>
                {active === 'all' && (
                  <h2 className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-white/40">
                    {v.label} — {v.sub}
                  </h2>
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {v.items.map((item) => (
                    <MenuCard key={item.name} item={item} badge={v.sub} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 font-sans text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
        active
          ? 'border-primary bg-primary text-[#0B111B]'
          : 'border-primary/25 text-bone/70 hover:border-primary/60 hover:text-bone'
      }`}
    >
      {children}
    </button>
  )
}

function MenuCard({ item, badge }: { item: Item; badge: string }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-none border border-white/[0.05] bg-gradient-to-br from-[#12151c] to-[#1a1e26] p-6 transition-transform duration-300 hover:-translate-y-1">
      {/* Gold top-edge reveal on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-lg tracking-wide text-bone">{item.name}</h3>
        {!item.hidePrice && (
          <span className="shrink-0 font-sans text-base font-light text-primary/90">
            ${item.pours[0]?.price}
          </span>
        )}
      </div>

      {item.sub && (
        <p className="mb-2 font-sans text-sm italic leading-relaxed text-white/40">{item.sub}</p>
      )}
      {item.menuDescription && (
        <p className="mb-5 font-sans text-xs leading-relaxed text-primary/50">{item.menuDescription}</p>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-white/[0.05] pt-3.5">
        <span className="rounded-sm bg-primary/10 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.1em] text-primary">
          {badge}
        </span>
        {item.pours[0] && (
          <span className="font-sans text-xs text-white/35">✧ {item.pours[0].label}</span>
        )}
      </div>
    </div>
  )
}
