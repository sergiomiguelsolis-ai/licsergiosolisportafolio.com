import { motion, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

type CursorState = 'hidden' | 'default' | 'link' | 'label'

const sizes: Record<CursorState, number> = { hidden: 8, default: 8, link: 40, label: 84 }

/**
 * A small red dot that tracks the pointer exactly (no lag, no trail).
 * Grows into a ring over interactive elements, and into a labelled disc
 * over elements with [data-cursor="Label"]. Disabled on touch devices.
 */
export default function Cursor() {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const [state, setState] = useState<CursorState>('hidden')
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!finePointer) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target as Element | null
      const labelled = target?.closest?.('[data-cursor]')
      if (labelled) {
        setLabel(labelled.getAttribute('data-cursor') || '')
        setState('label')
      } else if (target?.closest?.('a, button, [role="button"], summary, label')) {
        setState('link')
      } else {
        setState('default')
      }
    }
    const onLeave = () => setState('hidden')

    window.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [finePointer, x, y])

  if (!finePointer) return null

  const size = sizes[state]

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x, y }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        initial={false}
        animate={{
          width: size,
          height: size,
          opacity: state === 'hidden' ? 0 : 1,
          backgroundColor: state === 'link' ? 'rgba(200,16,46,0.06)' : 'rgba(200,16,46,1)',
          boxShadow: state === 'link' ? 'inset 0 0 0 1px rgba(200,16,46,1)' : 'inset 0 0 0 0px rgba(200,16,46,0)',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.5 }}
      >
        <motion.span
          className="label whitespace-nowrap text-white"
          animate={{ opacity: state === 'label' ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}
