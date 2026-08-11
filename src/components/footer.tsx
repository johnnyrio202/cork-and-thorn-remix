import Link from "next/link";
import { siteInfo } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-panel-border">
      <div className="border-b border-panel-border bg-panel">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-2xl">
              Join the <span className="text-gold-bright">Inner Circle</span>
            </h3>
            <p className="mt-1 max-w-md text-sm text-muted">
              Early ticket access, private events, and off-menu bottle specials —
              straight to your inbox.
            </p>
          </div>
          <form className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-full border border-panel-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-gold/60 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gold-bright px-5 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-muted">{siteInfo.description}</p>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Explore
          </h4>
          <ul className="space-y-2 text-muted">
            <li><Link href="/reservations" className="hover:text-foreground">Events</Link></li>
            <li><Link href="/reservations" className="hover:text-foreground">Reservations</Link></li>
            <li><Link href="/menu" className="hover:text-foreground">Menu</Link></li>
            <li><Link href="/shop" className="hover:text-foreground">Shop</Link></li>
            <li><Link href="/private-parties" className="hover:text-foreground">Private Parties</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Visit Us
          </h4>
          <ul className="space-y-2 text-muted">
            <li>{siteInfo.address}</li>
            <li>{siteInfo.cityStateZip}</li>
            <li>{siteInfo.phone}</li>
            <li>{siteInfo.hours}</li>
            <li>{siteInfo.hoursNote}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-panel-border px-4 py-6 text-center text-xs text-muted sm:px-6">
        <p>© 2026 Cork and Thorn. All rights reserved.</p>
        <p className="mt-1">{siteInfo.ageGate}</p>
      </div>
    </footer>
  );
}
