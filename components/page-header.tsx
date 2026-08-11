export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-32">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
        <h1 className="font-heading text-5xl tracking-wide text-balance sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
    </section>
  )
}
