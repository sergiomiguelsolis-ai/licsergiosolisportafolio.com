import { useEffect } from 'react'

/**
 * Drives the `.spot` title effect: one global listener writes the cursor
 * position, relative to each `.spot` element, into its --sx / --sy.
 * Recomputed on scroll too, since titles move under a still cursor.
 * Mouse only — touch devices keep the plain title color.
 */
export function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let x = -1e4
    let y = -1e4
    let frame = 0

    const apply = () => {
      frame = 0
      document.querySelectorAll<HTMLElement>('.spot').forEach((el) => {
        const r = el.getBoundingClientRect()
        // Skip titles far from the cursor; park their gradient off-canvas
        const far = x < r.left - 400 || x > r.right + 400 || y < r.top - 400 || y > r.bottom + 400
        el.style.setProperty('--sx', far ? '-9999px' : `${x - r.left}px`)
        el.style.setProperty('--sy', far ? '-9999px' : `${y - r.top}px`)
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      schedule()
    }
    const onLeave = () => {
      x = -1e4
      y = -1e4
      schedule()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])
}
