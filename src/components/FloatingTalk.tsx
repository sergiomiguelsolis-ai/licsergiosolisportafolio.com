import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { whatsappUrl } from '../data/site'
import { ease } from '../lib/motion'

/**
 * Mobile only: a "Hablemos" button within thumb reach. It appears once the
 * hero is behind, and steps aside where it would be redundant or in the way —
 * the contact section, the very end of the page, and while the menu is open.
 */
export default function FloatingTalk({ hidden }: { hidden: boolean }) {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const doc = document.documentElement
    const pastHero = y > window.innerHeight * 0.8
    const nearEnd = y + window.innerHeight > doc.scrollHeight - 220
    const contact = document.getElementById('contacto')?.getBoundingClientRect()
    const inContact = !!contact && contact.top < window.innerHeight * 0.7 && contact.bottom > 0
    setShow(pastHero && !nearEnd && !inContact)
  })

  return (
    <AnimatePresence>
      {show && !hidden && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hablemos por WhatsApp"
          className="label-lg fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-2.5 bg-red py-3.5 pl-4 pr-5 text-white shadow-[0_10px_30px_-10px_rgb(200_16_46/0.7)] md:hidden"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.45, ease }}
          whileTap={{ scale: 0.94 }}
        >
          {/* phone handset */}
          <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Hablemos
        </motion.a>
      )}
    </AnimatePresence>
  )
}
