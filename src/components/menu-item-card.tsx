import type { MenuItem } from "@/data/menu";

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex flex-col gap-1 border-b border-panel-border py-4 last:border-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="font-display text-base text-foreground sm:text-lg">
          {item.name}
        </h4>
        <div className="flex gap-3 text-sm text-gold-bright">
          {item.price && <span>{item.price}</span>}
          {item.pour && <span>Pour {item.pour}</span>}
          {item.bottle && <span>Bottle {item.bottle}</span>}
          {item.glass && <span>Glass {item.glass}</span>}
          {item.happyHour && <span className="text-muted">HH {item.happyHour}</span>}
        </div>
      </div>
      {item.detail && <p className="text-sm text-muted">{item.detail}</p>}
      {item.note && <p className="text-xs italic text-muted/80">{item.note}</p>}
    </div>
  );
}
