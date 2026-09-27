import { useEffect } from 'react'

/**
 * Drives the `.spot` title effect: one global listener writes the pointer
 * position, relative to each `.spot` element, into its --sx / --sy.
 * Recomputed on scroll too, since titles move under a still pointer.
 *
 * - Mouse (desktop): the halo follows the cursor.
 * - Touch (mobile only): the halo follows the finger while it is down; on
 *   release it blooms slightly and fades out — a tap leaves a red flash.
 *   The fade scales the halo through --spot-k on the root element.
 */
export function useSpotlight() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const touch = !fine && window.matchMedia('(pointer: coarse)').matches
    if (!fine && !touch) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && touch) return

    const root = document.documentElement
    let x = -1e4
    let y = -1e4
    let frame = 0
    let fade = 0

    const apply = () => {
      frame = 0
      document.querySelectorAll<HTMLElement>('.spot').forEach((el) => {
        const r = el.getBoundingClientRect()
        // Skip titles far from the pointer; park their gradient off-canvas
        const far = x < r.left - 400 || x > r.right + 400 || y < r.top - 400 || y > r.bottom + 400
        el.style.setProperty('--sx', far ? '-9999px' : `${x - r.left}px`)
        el.style.setProperty('--sy', far ? '-9999px' : `${y - r.top}px`)
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const park = () => {
      x = -1e4
      y = -1e4
      schedule()
    }

    // --- Mouse ------------------------------------------------------------
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      schedule()
    }

    // --- Touch ------------------------------------------------------------
    const setK = (k: number) => root.style.setProperty('--spot-k', String(k))
    const stopFade = () => {
      cancelAnimationFrame(fade)
      fade = 0
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      stopFade()
      setK(1)
      x = t.clientX
      y = t.clientY
      schedule()
    }
    const onRelease = () => {
      stopFade()
      const start = performance.now()
      const DURATION = 650
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / DURATION)
        // bloom a little, then shrink away (ease-out)
        const k = p < 0.25 ? 1 + p * 0.8 : 1.2 * (1 - (p - 0.25) / 0.75) ** 2
        setK(k)
        if (p < 1) fade = requestAnimationFrame(step)
        else {
          fade = 0
          park()
          setK(1)
        }
      }
      fade = requestAnimationFrame(step)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true })
      root.addEventListener('pointerleave', park)
    } else {
      window.addEventListener('touchstart', onTouch, { passive: true })
      window.addEventListener('touchmove', onTouch, { passive: true })
      window.addEventListener('touchend', onRelease, { passive: true })
      window.addEventListener('touchcancel', onRelease, { passive: true })
    }
    return () => {
      cancelAnimationFrame(frame)
      stopFade()
      root.style.removeProperty('--spot-k')
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', park)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchend', onRelease)
      window.removeEventListener('touchcancel', onRelease)
    }
  }, [])
}
