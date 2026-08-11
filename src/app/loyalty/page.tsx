import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Inner Circle | Cork & Thorn",
};

export default function LoyaltyPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        The Culture
      </p>
      <h1 className="font-display mt-3 text-4xl text-gold-bright sm:text-5xl">
        The Inner Circle
      </h1>
      <p className="mt-6 text-sm text-muted">
        Member rewards, priority access, and off-menu perks — coming soon.
        This is where loyalty login and backend integration will live once
        the venue-ops platform is wired up.
      </p>
    </div>
  );
}
