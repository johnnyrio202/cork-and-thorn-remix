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
      <div className="mx-auto max-w-4xl px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pb-12 lg:pt-24">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
        <h1 className="font-heading text-2xl tracking-wide text-balance sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
    </section>
  )
}
