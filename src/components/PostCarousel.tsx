import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { pad, type CarouselItem } from '../data/projects'
import { cn, ease } from '../lib/motion'
import { Arrow } from './Arrow'

/**
 * A strip of pieces drifting right-to-left in an endless loop. The set is
 * rendered twice and the track slides by exactly -50%, so the restart is
 * invisible. A click opens the piece
 * enlarged (arrows, swipe and Esc inside). It only pauses while a piece is
 * enlarged — otherwise it always runs. Under reduced motion it becomes
 * a plain horizontally scrollable row.
 */
export default function PostCarousel({
  items,
  title,
  itemClassName = 'h-[clamp(15rem,30vw,27rem)]',
}: {
  items: CarouselItem[]
  title: string
  /** Height of the pieces (the width follows each piece's own proportions) */
  itemClassName?: string
}) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)
  const n = items.length
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + n) % n)), [n])
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open === null) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, go])

  // Give focus back to the piece that opened the viewer
  useEffect(() => {
    if (open === null) opener.current?.focus({ preventScroll: true })
  }, [open])

  // Swipe between pieces on touch screens
  const startX = useRef<number | null>(null)
  const onDown = (e: PointerEvent) => (startX.current = e.clientX)
  const onUp = (e: PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }

  const track = reduce ? items : [...items, ...items]

  return (
    <>
      <div
        className={cn(
          'group/marquee relative -mx-[var(--gutter)] [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]',
          reduce ? 'overflow-x-auto' : 'overflow-hidden',
        )}
      >
        <ul
          // ~6.5 s per piece: slow enough to read a post and click it. Set on the
          // element itself — a custom property would be resolved at :root.
          style={{ animationDuration: `${n * 6.5}s` }}
          className={cn(
            'flex w-max py-1',
            !reduce && 'animate-marquee',
            open !== null && '[animation-play-state:paused]',
          )}
        >
          {track.map((item, k) => {
            const i = k % n
            const copy = k >= n
            return (
              // Spacing as a trailing margin (not flex gap) keeps the two halves
              // exactly equal, so the -50% loop point is seamless.
              <li key={k} aria-hidden={copy || undefined} className="mr-[var(--gap)] shrink-0">
                <button
                  type="button"
                  tabIndex={copy ? -1 : 0}
                  data-cursor="Ver"
                  aria-label={`Ampliar publicación ${pad(i + 1)} de ${pad(n)}`}
                  onClick={(e) => {
                    opener.current = e.currentTarget
                    setOpen(i)
                  }}
                  className={cn('group/item block overflow-hidden bg-line', itemClassName)}
                  style={{ aspectRatio: item.aspect }}
                >
                  <img
                    src={item.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-700 ease-expo group-hover/item:scale-[1.04]"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-0 z-[90] flex flex-col bg-[#111111]/95 text-[#f7f7f5]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(null)}
          >
            <div className="shell label flex items-center justify-between py-5" onClick={(e) => e.stopPropagation()}>
              <span className="flex items-center gap-3">
                <span className="tabular-nums text-red">{pad(open + 1)}</span>
                <span className="text-[#f7f7f5]/50">/ {pad(n)}</span>
                <span className="ml-2 hidden text-[#f7f7f5]/70 sm:inline">{title}</span>
              </span>
              <button type="button" autoFocus onClick={() => setOpen(null)} className="group flex items-center gap-3 py-2">
                Cerrar
                <span aria-hidden className="relative block size-3">
                  <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-red" />
                  <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-red" />
                </span>
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 md:px-24">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={open}
                  src={items[open].src}
                  alt={`${title} — ${pad(open + 1)} de ${pad(n)}`}
                  className="max-h-full max-w-full touch-pan-y select-none object-contain shadow-2xl"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease }}
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={onDown}
                  onPointerUp={onUp}
                  draggable={false}
                />
              </AnimatePresence>

              {[-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-label={d < 0 ? 'Anterior' : 'Siguiente'}
                  onClick={(e) => {
                    e.stopPropagation()
                    go(d)
                  }}
                  className={cn(
                    'group absolute top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center border border-[#f7f7f5]/25 transition-colors duration-300 hover:border-red hover:bg-red md:flex',
                    d < 0 ? 'left-6' : 'right-6',
                  )}
                >
                  <Arrow dir={d < 0 ? 'left' : 'right'} className="text-base" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
