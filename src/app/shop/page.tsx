import type { Metadata } from "next";
import { shopProducts } from "@/data/site";

export const metadata: Metadata = {
  title: "Shop | Cork & Thorn",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        The Shop
      </p>
      <h1 className="font-display mt-3 text-center text-4xl sm:text-5xl">Apparel</h1>
      <p className="mx-auto mt-4 max-w-md text-center text-sm text-muted">
        Wear the after-hours. Limited drops.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {shopProducts.map((p) => (
          <div key={p.name} className="rounded-xl border border-panel-border bg-panel p-6">
            <h3 className="font-display text-xl text-gold-bright">{p.name}</h3>
            <p className="mt-2 text-sm text-muted">{p.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg text-gold-bright">{p.price}</span>
              <button className="rounded-full bg-gold-bright px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-background">
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted/70">
        Checkout not yet connected — this is a frontend preview only.
      </p>
    </div>
  );
}
