'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/cart-provider'
import { products } from '@/lib/data'

export function ShopGrid() {
  const { addItem } = useCart()

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50"
          >
            <div className="relative aspect-square overflow-hidden bg-secondary">
              <Image
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <Badge className="absolute left-3 top-3 bg-background/80 text-foreground backdrop-blur">
                {product.category}
              </Badge>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-medium">{product.name}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-heading text-2xl">${product.price}</span>
                <Button
                  size="sm"
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
