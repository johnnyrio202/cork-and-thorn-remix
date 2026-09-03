'use client'

import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center ${className}`}
      aria-label="Cork and Thorn home"
    >
      <Image
        src="/images/cork-thorn-logo-transparent.png"
        alt="Cork and Thorn"
        height={160}
        width={800}
        className="h-9 w-auto object-contain drop-shadow-[0_0_10px_rgba(226,182,54,0.5)]"
      />
    </Link>
  )
}
