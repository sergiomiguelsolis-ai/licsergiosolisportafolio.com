import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { site, whatsappUrl } from '../data/site'
import { useGoTo } from '../hooks/useGoTo'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { tiltNow, useTilt } from '../hooks/useTilt'
import { INTRO_DELAY as D, cn, ease, easeInOut } from '../lib/motion'
import Button from '../components/Button'
import Particles from '../components/Particles'
import { Reveal, Rule } from '../components/Reveal'
import { AccentI } from '../components/Wordmark'

// Stronger than the philosophy poster: bigger, denser-feeling dots on paper
const HERO_SIZE: [number, number] = [1.1, 3.4]
const HERO_ALPHA: [number, number] = [0.4, 0.85]
/** Stable reference: the particle loop reads the live phone tilt through it */
const tiltGravity = () => tiltNow

function NameLine({ children, delay, className }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <span className={cn('t-hero mask-line shrink-0', className)}>
      <motion.span
        className="spot block"
        initial={{ y: '130%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.4, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** DISEÑADOR GRÁFICO + the five areas — the answer to "what does he do?" */
function Profession({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="t-h1 font-bold">
        {site.degree}
        <span className="text-red">.</span>
      </p>
      <p className="label mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {site.disciplines.map((d, i) => (
          <Fragment key={d}>
            {i > 0 && <span className="size-[3px] rounded-full bg-red" />}
            <span>{d}</span>
          </Fragment>
        ))}
      </p>
    </div>
  )
}

function Tagline({ className }: { className?: string }) {
  return (
    <p className={className}>
      {site.tagline.before}
      <span className="serif-i-bold text-[1.12em] text-red">{site.tagline.emphasis}</span>
      {site.tagline.after}
    </p>
  )
}

function Location({ className }: { className?: string }) {
  return (
    <div className={className}>
      <span className="flex items-center gap-2 text-ink">
        <span className="size-[5px] rounded-full bg-red" />
        {site.location.city}, {site.location.region}
      </span>
      <span className="pl-[13px] text-muted">{site.location.country}</span>
    </div>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const goTo = useGoTo()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const lift = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  // Phone tilt — mobile only (touch screen below the desktop breakpoint)
  const mobile = useMediaQuery('(pointer: coarse) and (max-width: 1023px)')
  const tilt = useTilt(mobile)
  const tx = useSpring(tilt.x, { stiffness: 90, damping: 16 })
  const ty = useSpring(tilt.y, { stiffness: 90, damping: 16 })
  const nameX = useTransform(tx, (v) => v * 26)
  const nameY = useTransform(ty, (v) => v * 16)
  const nameRotY = useTransform(tx, (v) => v * 16)
  const nameRotX = useTransform(ty, (v) => v * -12)
  const showTiltChip = mobile && tilt.chip !== null

  // Particles stay out of the navigation and masthead: hidden above the
  // masthead rule, fading in just below it.
  const ruleRef = useRef<HTMLDivElement>(null)
  const [cut, setCut] = useState(0)
  useEffect(() => {
    const section = ref.current
    const rule = ruleRef.current
    if (!section || !rule) return
    const measure = () => setCut(rule.offsetTop + rule.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(section)
    return () => ro.disconnect()
  }, [])
  const particleMask = `linear-gradient(to bottom, transparent ${cut}px, #000 ${cut + 56}px)`

  return (
    <section
      ref={ref}
      id="top"
      data-section=""
      className="shell relative isolate flex min-h-[100svh] flex-col overflow-x-clip pb-6 pt-24 md:pb-8 md:pt-28"
    >
      {/* Behind everything in the hero (isolate + -z-10) */}
      <Particles
        className="-z-10"
        style={{ maskImage: particleMask, WebkitMaskImage: particleMask }}
        density={0.55}
        radius={170}
        size={HERO_SIZE}
        alpha={HERO_ALPHA}
        gravity={mobile ? tiltGravity : undefined}
      />

      <h1 className="sr-only">
        Sergio Solís — {site.role} ({site.roleEn}) en Ensenada, Baja California, México
      </h1>

      {/* Masthead — a red band across the full viewport, dividing the menu from
          the hero. Inside it the palette flips: white text, black details. */}
      <div ref={ruleRef} className="relative py-3.5 md:py-4">
        <motion.span
          aria-hidden
          className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 bg-red"
          initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.1, ease: easeInOut, delay: D }}
        />
        <Reveal onMount delay={D + 0.35} y={8} className="grid-editorial label relative items-center text-white">
          <div className="col-span-2 flex items-center gap-3 md:col-span-3">
            <span className="tabular-nums text-ink">01</span>
            <span className="h-px w-6 bg-ink" />
            <span>Portafolio</span>
          </div>
          <div className="hidden text-white/80 md:col-span-4 md:col-start-5 md:block">Edición {site.year}</div>
          <div className="col-span-2 text-right text-white/80 md:col-span-3 md:col-start-10 md:text-left">
            <span className="hidden md:inline">Experiencia profesional desde {site.since}</span>
            <span className="md:hidden">Desde {site.since}</span>
          </div>
        </Reveal>
      </div>

      {/* Name composition — interlocking, asymmetric */}
      <motion.div aria-hidden className="relative mt-auto pt-12 [perspective:900px] md:pt-16" style={{ y: lift }}>
        {/* Tilt layer (mobile): the name leans with the phone */}
        <motion.div style={mobile ? { x: nameX, y: nameY, rotateX: nameRotX, rotateY: nameRotY } : undefined}>
        <div className="flex items-end justify-between gap-6">
          <NameLine delay={D}>SERGIO</NameLine>
          <Reveal onMount delay={D + 0.7} className="hidden self-start pt-[2.4vw] lg:block lg:w-[22vw]">
            <Location className="label flex flex-col gap-2" />
          </Reveal>
        </div>

        <div className="flex items-end justify-between gap-6">
          <Reveal onMount delay={D + 0.6} className="hidden pb-[1.1vw] lg:block lg:w-[36vw]">
            <Profession />
            <Tagline className="t-lead mt-6 max-w-[30ch] text-ink/80" />
          </Reveal>
          <span className="ml-auto">
            {/* optical alignment: cancel the trailing negative tracking at the right margin */}
            <NameLine delay={D + 0.08} className="mr-[-0.045em]">
              SOL
              {/* The I is position:relative (for its accent). Safari won't paint a
                  positioned child through the parent's background-clip:text, so
                  it carries its own .spot fill — same color, same cursor halo. */}
              <AccentI className="spot" />S
            </NameLine>
          </span>
        </div>
        </motion.div>
      </motion.div>

      {/* Compact composition below lg */}
      <Reveal onMount delay={D + 0.6} className="mt-10 flex flex-col gap-7 lg:hidden">
        <Profession />
        <Tagline className="t-lead max-w-[34ch] text-ink/80" />
        <Location className="label flex flex-col gap-2" />
        <AnimatePresence>
          {showTiltChip && (
            <motion.button
              type="button"
              onClick={tilt.enable}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.3, delay: 0 } }}
              transition={{ duration: 0.5, ease, delay: 1.6 }}
              className="label flex w-fit items-center gap-2.5 border border-line px-3 py-2 text-ink"
            >
              <motion.span
                aria-hidden
                className="block size-2 bg-red"
                animate={{ rotate: [0, -18, 18, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              {tilt.chip === 'tap' ? 'Toca para activar · inclina tu teléfono' : 'Inclina tu teléfono'}
            </motion.button>
          )}
        </AnimatePresence>
      </Reveal>

      {/* Footer bar */}
      <div className="mt-10 md:mt-[5vh]">
        <Rule delay={D + 0.3} />
        <Reveal onMount delay={D + 0.85} y={10} className="flex flex-wrap items-center justify-between gap-4 pt-5">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => goTo('proyectos')} variant="secondary" arrow="down">
              Ver proyectos
            </Button>
            <Button href={whatsappUrl} external arrow="right">
              Hablemos
            </Button>
          </div>
          <div className="label hidden items-center gap-4 text-muted md:flex">
            <span>Desliza</span>
            <span className="relative block h-9 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-scrollcue bg-red" />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
