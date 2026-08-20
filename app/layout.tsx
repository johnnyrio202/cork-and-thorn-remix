import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Lora, Pinyon_Script, Geist_Mono, Roboto } from 'next/font/google'
import './globals.css'
import { SiteFooter } from '@/components/site-footer'
import { AppShellHeader } from '@/components/app-shell-header'
import { AppShellNav } from '@/components/app-shell-nav'
import { CartProvider } from '@/components/cart-provider'
import { VipProvider } from '@/components/vip-provider'
import { Toaster } from '@/components/ui/sonner'

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
})
const pinyon = Pinyon_Script({
  variable: '--font-pinyon',
  weight: '400',
  subsets: ['latin'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Cork and Thorn | The way NightLife should be',
  description:
    "Las Vegas's premier destination for live events and libations. Dynamic eclectic entertainment, premium craft cocktails, and professional hookah services for bespoke celebrations.",
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Deliberately not maximumScale/userScalable: false — that blocks pinch
  // zoom entirely, which is a real accessibility problem for low-vision
  // visitors and works against "responsive," not for it.
  themeColor: '#0B111B',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`dark ${lora.variable} ${pinyon.variable} ${geistMono.variable} ${roboto.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <VipProvider>
          <CartProvider>
            <AppShellHeader />
            <div className="pb-[calc(5rem+env(safe-area-inset-bottom))]">
              {children}
            </div>
            <SiteFooter />
            <AppShellNav />
            <Toaster position="top-center" />
          </CartProvider>
        </VipProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
