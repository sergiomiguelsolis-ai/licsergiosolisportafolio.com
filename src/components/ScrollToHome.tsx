import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'

/** How much extra scrolling (px) past the bottom completes the pull */
const THRESHOLD = 700
/** Pause (ms) after which an unfinished pull relaxes back to zero */
const RELEASE = 650

/**
 * "Keep scrolling to go home" for case studies.
 * At the very bottom of the page, further scrolling (wheel, touch or keys)
 * raises the site's ink curtain in step with the input. When it fully covers
 * the screen the visitor is taken to the home page, which opens with the usual
 * curtain transition. Stopping halfway lets the curtain fall back, so nobody
 * leaves by accident. A plain button covers visitors who don't scroll further.
 */
export default function ScrollToHome() {
  const navigate = useNavigate()
  const progress = useMotionValue(0)
  const smooth = useSpring(progress, { stiffness: 260, damping: 34, mass: 0.6 })
  const curtainY = useTransform(smooth, (v) => `${(1 - v) * 100}%`)
  const [active, setActive] = useState(false)
  const done = useRef(false)

  useMotionValueEvent(smooth, 'change', (v) => setActive(v > 0.005))

  useEffect(() => {
    let pull = 0
    let idle = 0
    let touchY: number | null = null

    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

    const reset = () => {
      pull = 0
      progress.set(0)
    }

    const add = (delta: number) => {
      if (done.current) return
      if (delta > 0 && !atBottom()) return reset()
      pull = Math.max(0, pull + delta)
      progress.set(Math.min(1, pull / THRESHOLD))
      window.clearTimeout(idle)
      idle = window.setTimeout(() => !done.current && reset(), RELEASE)
      if (pull >= THRESHOLD) {
        done.current = true
        progress.set(1)
        window.setTimeout(() => navigate('/'), 320)
      }
    }

    const onWheel = (e: WheelEvent) => add(e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY)
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY)
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return
      const y = e.touches[0].clientY
      add((touchY - y) * 1.6) // finger moving up = scrolling down
      touchY = y
    }
    const onTouchEnd = () => (touchY = null)
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'End', ' '].includes(e.key) && atBottom()) add(THRESHOLD / 3)
    }
    const onScroll = () => !atBottom() && pull > 0 && reset()

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(idle)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [navigate, progress])

  return (
    <>
      {/* End-of-page band: explains the gesture and offers a plain button */}
      <div className="shell pb-10">
        <div className="relative border-t border-line pt-6">
          <motion.span
            aria-hidden
            className="absolute inset-x-0 -top-px h-[2px] origin-left bg-red"
            style={{ scaleX: smooth }}
          />
          <div className="flex flex-wrap items-center justify-between gap-5">
            <p className="label flex items-center gap-3 text-muted">
              <span className="relative block h-5 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-scrollcue bg-red" />
              </span>
              Sigue deslizando para volver al inicio
            </p>
            <Button to="/" variant="secondary" arrow="up">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>

      {/* The curtain that rises with the pull */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] bg-ink"
        style={{ y: curtainY, visibility: active ? 'visible' : 'hidden' }}
      >
        <span className="absolute inset-x-0 top-0 h-[3px] bg-red" />
        <div className="shell absolute inset-x-0 top-0 flex items-center justify-between pt-8">
          <span className="label text-paper">Sergio Solís — Inicio</span>
          <span className="size-2 bg-red" />
        </div>
      </motion.div>
    </>
  )
}
