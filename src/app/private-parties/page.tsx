import type { Metadata } from "next";
import { privatePartiesIncluded } from "@/data/site";

export const metadata: Metadata = {
  title: "Private Parties & Events | Cork & Thorn",
};

export default function PrivatePartiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        Private Events
      </p>
      <h1 className="font-display mt-3 text-center text-4xl sm:text-5xl">
        Throw Your Night Here
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-center text-sm text-muted">
        From intimate birthday celebrations to full venue buyouts, our team
        curates unforgettable nights with premium hookah, craft cocktails,
        and live entertainment.
      </p>

      <div className="mt-10 rounded-xl border border-panel-border bg-panel p-6">
        <h2 className="font-display text-xl text-gold-bright">What&rsquo;s Included</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {privatePartiesIncluded.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-gold">·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-center text-2xl text-gold-bright">
          Request a Date
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted">
          Tell us about your event and our team will reach out within 24
          hours with availability and a custom quote.
        </p>

        <form className="mt-6 grid gap-4 rounded-xl border border-panel-border bg-panel p-6 sm:grid-cols-2">
          <input placeholder="Full name" className="rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted" />
          <input placeholder="Email" className="rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted" />
          <input placeholder="Phone" className="rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted" />
          <select className="rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground">
            <option>Select type</option>
          </select>
          <input type="date" placeholder="Preferred date" className="rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted" />
          <input type="number" placeholder="Estimated guests" className="rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted" />
          <textarea placeholder="Vision & details" className="col-span-full min-h-24 rounded-lg border border-panel-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted" />
          <button type="submit" className="col-span-full rounded-full bg-gold-bright py-3 text-xs font-semibold uppercase tracking-[0.15em] text-background">
            Submit Inquiry
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted/70">
          Form submission not yet connected — this is a frontend preview only.
        </p>
      </div>
    </div>
  );
}
