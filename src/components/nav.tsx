import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Sips & Exhales" },
  { href: "/reservations", label: "Experiences" },
  { href: "/shop", label: "Shop" },
  { href: "/private-parties", label: "Private Parties" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-panel-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-xl text-gold-bright">
          Cork and Thorn
        </Link>
        <nav className="hidden gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-gold-bright">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/reservations"
          className="rounded-full border border-panel-border bg-panel px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-gold/60"
        >
          VIP Access
        </Link>
      </div>
    </header>
  );
}
