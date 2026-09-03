'use client'

import { motion } from 'framer-motion'
import { InstagramIcon } from '@/components/social-icons'

const socials = [
  '@corkandthorn',
  '#MidnightGarden',
  '@vegasnightlife',
  '#TheInnerCircle',
  '@corkandthorn',
  '#LiveInTheRoom',
  '#UnapologeticVibe',
  '#SipsAndExhales',
]

export function SocialMarquee() {
  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 py-5 bg-[#0B111B]">
      <motion.div
        aria-hidden="true"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10"
      >
        {[...socials, ...socials].map((handle, i) => (
          <span key={i} className="inline-flex items-center gap-3 font-sans text-lg text-gray-500">
            <InstagramIcon className="w-4 h-4 text-primary/70" />
            {handle}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
