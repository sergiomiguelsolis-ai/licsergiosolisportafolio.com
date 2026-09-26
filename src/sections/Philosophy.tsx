import { Fragment, useRef, type ReactNode } from 'react'
import { site } from '../data/site'
import { gsap, useGSAP } from '../lib/gsap'
import { Reveal } from '../components/Reveal'
import Particles from '../components/Particles'
import SectionLabel from '../components/SectionLabel'

const statement = ['El buen diseño', 'no solo', 'se ve bien.']

const principles = ['Claridad sobre decoración.', 'Estructura antes que estilo.', 'Propósito en cada detalle.']

function Words({ text, spot = false }: { text: string; spot?: boolean }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span data-word className={spot ? 'spot spot-inverse inline-block' : 'inline-block'}>
            {w}
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </>
  )
}

function Line({ children }: { children: ReactNode }) {
  return <span className="block">{children}</span>
}

/** A poster inside the site. Words ink in as the reader scrolls through it. */
export default function Philosophy() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-word]',
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: {
              trigger: '[data-poster]',
              start: 'top 78%',
              end: 'bottom 55%',
              scrub: 0.6,
            },
          },
        )
        gsap.from('[data-poster-rule]', {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="filosofia" data-section="" className="relative overflow-hidden bg-ink text-paper">
      <Particles />
      <div className="shell relative flex min-h-[100svh] flex-col py-[clamp(5rem,10vw,9rem)]">
        <span data-poster-rule aria-hidden className="absolute left-[var(--gutter)] top-0 h-[clamp(3rem,8vw,7rem)] w-px bg-red" />

        <div className="grid-editorial label items-center text-paper/50">
          <SectionLabel index="06" inverse className="col-span-3 md:col-span-4">
            Filosofía de diseño
          </SectionLabel>
          <span className="hidden md:col-span-3 md:col-start-7 md:block">Principio — 01</span>
          <span className="hidden text-right md:col-span-2 md:col-start-11 md:block">{site.location.short}</span>
        </div>

        <blockquote data-poster className="t-poster mt-auto pt-20 uppercase md:pt-28">
          {statement.map((line) => (
            <Line key={line}>
              <Words text={line} spot />
            </Line>
          ))}

          <span className="mt-[0.45em] block text-red md:pl-[16.666%]">
            <Line>
              <Words text="Hace las cosas" />
            </Line>
            <Line>
              <span data-word className="serif-i inline-block text-[1.12em] normal-case leading-[0.9]">
                más
              </span>{' '}
              <span data-word className="serif-i inline-block text-[1.12em] normal-case leading-[0.9]">
                claras.
              </span>
            </Line>
          </span>
        </blockquote>

        <div className="grid-editorial mt-20 gap-y-5 border-t border-paper/15 pt-6 md:mt-28">
          {principles.map((p, i) => (
            <Reveal key={p} delay={i * 0.08} y={12} className="col-span-4 flex items-baseline gap-4 md:col-span-4">
              <span className="label tabular-nums text-red">0{i + 1}</span>
              <span className="text-[15px] text-paper/80">{p}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
