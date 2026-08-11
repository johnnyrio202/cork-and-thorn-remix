import { PageHeader } from '@/components/page-header'
import { ShopGrid } from '@/components/shop/shop-grid'

export const metadata = {
  title: 'Shop | Cork & Thorn',
  description:
    'Take the vibe home. Shop branded Cork & Thorn apparel, accessories, and barware — premium pieces for the after-dark crowd.',
}

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Merch"
        title="Wear the Night"
        description="Premium branded apparel, accessories, and barware. Rep your favorite Las Vegas lounge wherever the night takes you."
      />
      <ShopGrid />
    </>
  )
}
