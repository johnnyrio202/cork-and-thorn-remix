"use client";

import { useState } from "react";
import {
  cocktailVolumes,
  spiritCategories,
  wineCategories,
  bubblesCategory,
  beerCategory,
  cigarsCategory,
  type MenuItem,
} from "@/data/menu";
import { MenuItemCard } from "@/components/menu-item-card";

type Pill = { key: string; label: string };

function PillRow({
  pills,
  active,
  onSelect,
}: {
  pills: Pill[];
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {pills.map((p) => (
        <button
          key={p.key}
          onClick={() => onSelect(p.key)}
          className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
            active === p.key
              ? "border-gold-bright bg-gold-bright text-background"
              : "border-panel-border bg-panel text-muted hover:text-foreground"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function ItemList({ title, description, items }: { title: string; description?: string; items: MenuItem[] }) {
  return (
    <div className="mx-auto mt-10 max-w-2xl">
      {description && <p className="mb-6 text-center text-sm text-muted">{description}</p>}
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.15em] text-gold">
        {title} · {items.length} items
      </p>
      <div>
        {items.map((item) => (
          <MenuItemCard key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}

export function MenuClient() {
  const [side, setSide] = useState<"sips" | "exhales">("sips");
  const [sipsCategory, setSipsCategory] = useState("cocktails");
  const [cocktailVolume, setCocktailVolume] = useState(cocktailVolumes[0].slug);
  const [spiritSub, setSpiritSub] = useState(spiritCategories[0].slug);
  const [wineSub, setWineSub] = useState(wineCategories[0].slug);
  const [exhalesCategory, setExhalesCategory] = useState("cigars");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        The Midnight Garden
      </p>
      <h1 className="font-display mt-3 text-center text-4xl sm:text-5xl">Sips & Exhales</h1>
      <p className="mx-auto mt-6 max-w-xl text-center text-sm text-muted">
        Every pour, bowl, and bottle here is built around one promise: an
        exceptional experience with nothing hidden. We take pride in the
        craft, the hospitality, and the honesty behind it.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-center text-xs text-gold">
        20% auto gratuity — tax and gratuity is already applied. No surprise
        line items, no math at the end of the night.
      </p>

      <div className="mt-10">
        <PillRow
          pills={[
            { key: "sips", label: "Sips" },
            { key: "exhales", label: "Exhales" },
          ]}
          active={side}
          onSelect={(k) => setSide(k as "sips" | "exhales")}
        />
      </div>

      {side === "sips" && (
        <>
          <div className="mt-6">
            <PillRow
              pills={[
                { key: "cocktails", label: "Cocktails" },
                { key: "spirits", label: "Spirits" },
                { key: "wine", label: "Wine" },
                { key: "bubbles", label: "Bubbles" },
                { key: "beer", label: "Beer" },
              ]}
              active={sipsCategory}
              onSelect={setSipsCategory}
            />
          </div>

          {sipsCategory === "cocktails" && (
            <>
              <div className="mt-4">
                <PillRow
                  pills={cocktailVolumes.map((v) => ({ key: v.slug, label: v.title }))}
                  active={cocktailVolume}
                  onSelect={setCocktailVolume}
                />
              </div>
              {cocktailVolumes
                .filter((v) => v.slug === cocktailVolume)
                .map((v) => (
                  <ItemList key={v.slug} title={v.title} description={v.description} items={v.items} />
                ))}
            </>
          )}

          {sipsCategory === "spirits" && (
            <>
              <div className="mt-4">
                <PillRow
                  pills={spiritCategories.map((c) => ({ key: c.slug, label: c.title }))}
                  active={spiritSub}
                  onSelect={setSpiritSub}
                />
              </div>
              {spiritCategories
                .filter((c) => c.slug === spiritSub)
                .map((c) => (
                  <ItemList key={c.slug} title={c.title} items={c.items} />
                ))}
              <p className="mt-6 text-center text-xs text-muted">
                All spirits available by the pour or bottle service.
              </p>
            </>
          )}

          {sipsCategory === "wine" && (
            <>
              <div className="mt-4">
                <PillRow
                  pills={wineCategories.map((c) => ({ key: c.slug, label: c.title }))}
                  active={wineSub}
                  onSelect={setWineSub}
                />
              </div>
              {wineCategories
                .filter((c) => c.slug === wineSub)
                .map((c) => (
                  <ItemList key={c.slug} title={c.title} description={c.description} items={c.items} />
                ))}
            </>
          )}

          {sipsCategory === "bubbles" && (
            <ItemList
              title={bubblesCategory.title}
              description={bubblesCategory.description}
              items={bubblesCategory.items}
            />
          )}

          {sipsCategory === "beer" && (
            <ItemList title={beerCategory.title} items={beerCategory.items} />
          )}
        </>
      )}

      {side === "exhales" && (
        <>
          <div className="mt-6">
            <PillRow
              pills={[
                { key: "hookah", label: "Hookah" },
                { key: "cigars", label: "Cigars" },
              ]}
              active={exhalesCategory}
              onSelect={setExhalesCategory}
            />
          </div>

          {exhalesCategory === "cigars" && (
            <ItemList
              title={cigarsCategory.title}
              description={cigarsCategory.description}
              items={cigarsCategory.items}
            />
          )}

          {exhalesCategory === "hookah" && (
            <p className="mt-10 text-center text-sm text-muted">
              Hookah menu coming soon — ask your server for current flavors.
            </p>
          )}
        </>
      )}
    </div>
  );
}
