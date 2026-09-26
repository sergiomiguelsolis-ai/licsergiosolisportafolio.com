import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, type PointerEvent } from 'react'
import { cn, easeInOut } from '../lib/motion'

interface MediaProps {
  src?: string
  /** Muted looping video; `src` becomes its poster frame */
  video?: string
  alt?: string
  /** CSS aspect ratio, e.g. '16/9' */
  aspect?: string
  /** Placeholder background tone */
  tone?: string
  /** Placeholder slot name, e.g. '01 — Cover' */
  slot?: string
  /** Where to replace it, e.g. 'projects.ts → heroImage' */
  hint?: string
  /** Large faint mark inside the placeholder (project number) */
  mark?: string
  className?: string
  /** Subtle vertical drift while scrolling */
  parallax?: boolean
  /** Image reacts gently to the mouse */
  hover?: boolean
  priority?: boolean
}

const specFor = (aspect: string) => {
  const [w, h] = aspect.split('/').map((n) => Number(n.trim()))
  if (!w || !h) return aspect
  const long = 2400
  const W = w >= h ? long : Math.round((long * w) / h)
  const H = w >= h ? Math.round((long * h) / w) : long
  return `${w}:${h} — ${W} × ${H} px`
}

/**
 * The single image primitive of the site.
 * - With `src`: a real image, lazy-loaded, covering the frame.
 * - Without `src`: a designed placeholder that shows the slot, the ratio and
 *   the recommended export size — ready to receive the real work.
 */
export default function Media({
  src,
  video,
  alt = '',
  aspect = '16/9',
  tone = '#E9E9E5',
  slot = 'Imagen',
  hint,
  mark,
  className,
  parallax = false,
  hover = false,
  priority = false,
}: MediaProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], parallax ? ['-4.5%', '4.5%'] : ['0%', '0%'])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 90, damping: 20, mass: 0.6 })
  const hx = useTransform(sx, (v) => `${v * -1.6}%`)
  const hy = useTransform(sy, (v) => `${v * -1.6}%`)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!hover || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn('@container relative overflow-hidden', className)}
      style={{ aspectRatio: aspect, backgroundColor: tone }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 1.3, ease: easeInOut }}
    >
      {/* Overscan only as much as the motion needs, so graphic pieces keep their edges */}
      <motion.div
        className={cn(
          'absolute',
          parallax ? 'inset-x-[-1%] inset-y-[-5.5%]' : hover ? 'inset-[-1%]' : 'inset-0',
        )}
        style={{ y: drift }}
      >
        <motion.div className="absolute inset-0" style={{ x: hx, y: hy }}>
          <div className="absolute inset-0 transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.035]">
            {video ? (
              <AutoVideo src={video} poster={src} label={alt} />
            ) : src ? (
              <img
                src={src}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                className="size-full object-cover"
              />
            ) : (
              <PlaceholderArt mark={mark} />
            )}
          </div>
        </motion.div>
      </motion.div>

      {!src && !video && <PlaceholderMeta slot={slot} spec={specFor(aspect)} hint={hint} />}
    </motion.div>
  )
}

/**
 * Silent, looping, inline video that only plays while on screen.
 * Under reduced motion it stays on its poster frame.
 */
function AutoVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      el.pause()
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={!reduce}
      preload="metadata"
      aria-label={label}
      className="size-full object-cover"
    />
  )
}

function PlaceholderArt({ mark }: { mark?: string }) {
  return (
    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
      {mark && (
        <span className="select-none text-[34cqw] leading-none font-semibold tracking-[-0.07em] text-ink/[0.045] tabular-nums">
          {mark}
        </span>
      )}
      {/* Printer's registration mark */}
      <svg viewBox="0 0 40 40" className="absolute size-9 text-ink/35" fill="none">
        <circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="1" />
        <path d="M20 4v32M4 20h32" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  )
}

function PlaceholderMeta({ slot, spec, hint }: { slot: string; spec: string; hint?: string }) {
  const corner = 'absolute size-3 border-ink/40'
  return (
    <div aria-hidden className="guides pointer-events-none absolute inset-0">
      <span className={cn(corner, 'left-2.5 top-2.5 border-l border-t')} />
      <span className={cn(corner, 'right-2.5 top-2.5 border-r border-t')} />
      <span className={cn(corner, 'bottom-2.5 left-2.5 border-b border-l')} />
      <span className={cn(corner, 'bottom-2.5 right-2.5 border-b border-r')} />

      <div className="label absolute inset-0 flex flex-col justify-between p-5 text-ink/55 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <span>{slot}</span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 bg-red" />
            Imagen pendiente
          </span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <span className="tabular-nums">{spec}</span>
          {hint && <span className="hidden tracking-[0.04em] normal-case sm:inline">{hint}</span>}
        </div>
      </div>
    </div>
  )
}
