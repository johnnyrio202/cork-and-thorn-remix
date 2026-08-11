import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Ebony E.',
    text: 'My favorite spot in VEGAS! Great vibes, great drinks, great music and great people. I tell everyone about it — I could wind up here every night of my trip.',
  },
  {
    name: 'Ashlyn K.',
    text: 'Such a cute spot! They have hookah, delicious snacks, and a great cocktail menu. The atmosphere is unreal and the open mic night was a blast.',
  },
  {
    name: 'Melinda J.',
    text: 'Awesome spot, cool vibes, and the bartender was amazing. Great energy, the DJ was on point, and the whole team is so accommodating. Will be back!',
  },
]

export function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          The Word on the Street
        </p>
        <h2 className="font-heading text-4xl tracking-wide sm:text-5xl">
          Loved by the City
        </h2>
        <div className="mt-3 flex items-center justify-center gap-1 text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            4.9 average on Yelp
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <figure
            key={review.name}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <Quote className="h-8 w-8 text-primary/40" />
            <blockquote className="mt-4 flex-1 leading-relaxed text-pretty">
              {review.text}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-2 border-t border-border pt-4">
              <span className="font-medium">{review.name}</span>
              <span className="text-xs text-muted-foreground">via Yelp</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
