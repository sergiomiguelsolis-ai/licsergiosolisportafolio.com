import { motion, useScroll, useTransform } from 'framer-motion'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import { site, whatsappUrl } from '../data/site'
import { useGoTo } from '../hooks/useGoTo'
import { INTRO_DELAY as D, cn, ease } from '../lib/motion'
import Button from '../components/Button'
import Particles from '../components/Particles'
import { Reveal, Rule } from '../components/Reveal'
import { AccentI } from '../components/Wordmark'

// Stronger than the philosophy poster: bigger, denser-feeling dots on paper
const HERO_SIZE: [number, number] = [1.1, 3.4]
const HERO_ALPHA: [number, number] = [0.4, 0.85]

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
      className="shell relative isolate flex min-h-[100svh] flex-col pb-6 pt-24 md:pb-8 md:pt-28"
    >
      {/* Behind everything in the hero (isolate + -z-10) */}
      <Particles
        className="-z-10"
        style={{ maskImage: particleMask, WebkitMaskImage: particleMask }}
        density={0.55}
        radius={170}
        size={HERO_SIZE}
        alpha={HERO_ALPHA}
      />

      <h1 className="sr-only">
        Sergio Solís — {site.role} ({site.roleEn}) en Ensenada, Baja California, México
      </h1>

      {/* Masthead */}
      <Reveal onMount delay={D} y={10} className="grid-editorial label">
        <div className="col-span-2 flex items-center gap-3 md:col-span-3">
          <span className="tabular-nums text-red">01</span>
          <span className="h-px w-6 bg-red" />
          <span>Portafolio</span>
        </div>
        <div className="hidden text-muted md:col-span-4 md:col-start-5 md:block">Edición {site.year}</div>
        <div className="col-span-2 text-right text-muted md:col-span-3 md:col-start-10 md:text-left">
          <span className="hidden md:inline">Experiencia profesional desde {site.since}</span>
          <span className="md:hidden">Desde {site.since}</span>
        </div>
      </Reveal>
      <div ref={ruleRef}>
        <Rule className="mt-4 bg-ink" delay={D} />
      </div>

      {/* Name composition — interlocking, asymmetric */}
      <motion.div aria-hidden className="relative mt-auto pt-12 md:pt-16" style={{ y: lift }}>
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
              <AccentI />S
            </NameLine>
          </span>
        </div>
      </motion.div>

      {/* Compact composition below lg */}
      <Reveal onMount delay={D + 0.6} className="mt-10 flex flex-col gap-7 lg:hidden">
        <Profession />
        <Tagline className="t-lead max-w-[34ch] text-ink/80" />
        <Location className="label flex flex-col gap-2" />
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
