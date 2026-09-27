import { useEffect, useRef, type CSSProperties } from 'react'
import { cn } from '../lib/motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  /** Resting drift the particle eases back to after being pushed */
  bx: number
  by: number
  r: number
  a: number
}

interface ParticlesProps {
  className?: string
  style?: CSSProperties
  /** RGB triplet of the brand red */
  rgb?: [number, number, number]
  /** Particles per 10,000 px² of section area */
  density?: number
  /** Cursor influence radius in px */
  radius?: number
  /** Dot radius range in px */
  size?: [number, number]
  /** Opacity range */
  alpha?: [number, number]
  /** Share of "accent" particles: larger, more intense and faster, for variety */
  accent?: number
  /** Optional pull, read every frame (e.g. phone tilt), each axis -1…1 */
  gravity?: () => { x: number; y: number }
}

const BRAND_RED: [number, number, number] = [200, 16, 46]
const SIZE: [number, number] = [0.6, 2.2]
const ALPHA: [number, number] = [0.18, 0.63]

/**
 * A quiet field of red particles that drift slowly and part around the cursor.
 * Canvas-based, animates only while visible, static under reduced motion.
 */
export default function Particles({
  className,
  style,
  rgb = BRAND_RED,
  density = 0.75,
  radius = 150,
  size = SIZE,
  alpha = ALPHA,
  accent = 0.12,
  gravity,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !host || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const [R, G, B] = rgb
    let w = 0
    let h = 0
    let particles: Particle[] = []
    let frame = 0
    let visible = false
    const pointer = { x: -1e4, y: -1e4 }

    const seed = () => {
      const count = Math.min(140, Math.round(((w * h) / 10_000) * density))
      particles = Array.from({ length: count }, () => {
        // A few accent particles break the uniformity: bigger, brighter, quicker
        const isAccent = Math.random() < accent
        const speed = isAccent ? 0.5 : 0.18
        const bx = (Math.random() - 0.5) * speed
        const by = (Math.random() - 0.5) * speed - (isAccent ? 0.1 : 0.04)
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: bx,
          vy: by,
          bx,
          by,
          r: isAccent
            ? size[1] * (1.5 + Math.random() * 0.9)
            : size[0] + Math.random() * (size[1] - size[0]),
          a: isAccent
            ? Math.min(1, alpha[1] + 0.15 + Math.random() * 0.1)
            : alpha[0] + Math.random() * (alpha[1] - alpha[0]),
        }
      })
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / radius)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * (1 + near * 0.6), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${R},${G},${B},${Math.min(0.9, p.a + near * 0.4)})`
        ctx.fill()
      }
    }

    const step = () => {
      for (const p of particles) {
        const dx = p.x - pointer.x
        const dy = p.y - pointer.y
        const d2 = dx * dx + dy * dy
        if (d2 < radius * radius) {
          const d = Math.sqrt(d2) || 1
          const force = (1 - d / radius) * 0.55
          p.vx += (dx / d) * force
          p.vy += (dy / d) * force
        }
        // phone tilt (mobile hero): particles drift toward the lower side
        if (gravity) {
          const g = gravity()
          p.vx += g.x * 0.05
          p.vy += g.y * 0.05
        }
        // ease back to the resting drift
        p.vx = p.vx * 0.93 + p.bx * 0.07
        p.vy = p.vy * 0.93 + p.by * 0.07
        p.x += p.vx
        p.y += p.vy
        // wrap around the edges
        if (p.x < -10) p.x = w + 10
        else if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        else if (p.y > h + 10) p.y = -10
      }
      draw()
      frame = requestAnimationFrame(step)
    }

    const start = () => {
      if (reduce || frame) return
      frame = requestAnimationFrame(step)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    const onLeave = () => {
      pointer.x = -1e4
      pointer.y = -1e4
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    const ro = new ResizeObserver(resize)

    resize()
    io.observe(host)
    ro.observe(host)
    host.addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('pointerleave', onLeave)
    host.addEventListener('pointercancel', onLeave)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointercancel', onLeave)
    }
  }, [rgb, density, radius, size, alpha, accent, gravity])

  return (
    <canvas ref={canvasRef} aria-hidden style={style} className={cn('pointer-events-none absolute inset-0', className)} />
  )
}
