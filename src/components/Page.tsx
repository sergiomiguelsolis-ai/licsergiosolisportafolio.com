import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ease, easeInOut } from '../lib/motion'

/**
 * Route transition: an ink curtain with a red leading edge.
 * Exit  → a curtain rises from below and covers the page.
 * Enter → the curtain (labelled with the destination) lifts away.
 */
export default function Page({ children, label }: { children: ReactNode; label: string }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-ink"
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.9, ease: easeInOut, delay: 0.25 }}
      >
        <div className="shell absolute inset-x-0 bottom-0 flex items-end justify-between pb-8">
          <motion.span
            className="label text-paper"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            {label}
          </motion.span>
          <span className="size-2 bg-red" />
        </div>
        <span className="absolute inset-x-0 bottom-0 h-[3px] bg-red" />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-ink"
        initial={{ y: '100%' }}
        animate={{ y: '100%' }}
        exit={{ y: '0%' }}
        transition={{ duration: 0.6, ease: easeInOut }}
      >
        <span className="absolute inset-x-0 top-0 h-[3px] bg-red" />
      </motion.div>

      <main>{children}</main>
    </>
  )
}
