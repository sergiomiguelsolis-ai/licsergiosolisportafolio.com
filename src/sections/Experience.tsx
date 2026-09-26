import { useRef } from 'react'
import { experience } from '../data/experience'
import { site } from '../data/site'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { cn } from '../lib/motion'
import { MaskLines, Reveal, Rule } from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

const FROM = site.since
const TO = Math.max(site.year, new Date().getFullYear())
const SPAN = TO - FROM
const years = Array.from({ length: SPAN + 1 }, (_, i) => FROM + i)
const pct = (year: number) => ((year - FROM) / SPAN) * 100

const shortYear = (y: number) => `’${String(y).slice(2)}`

/**
 * An editorial timeline: every row is a line of a table and a bar on a
 * shared axis, so the evolution reads as a staircase from 2018 to now.
 */
export default function Experience() {
  const root = useRef<HTMLElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The final year stays in the DOM until the count-up actually starts,
        // so the heading never reads "2018 — 2018".
        const el = counter.current
        if (el) {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 92%',
            once: true,
            onEnter: () => {
              const value = { year: FROM }
              gsap.to(value, {
                year: TO,
                duration: 1.8,
                ease: 'power3.out',
                onUpdate: () => {
                  el.textContent = String(Math.round(value.year))
                },
              })
            },
          })
        }

        gsap.from('[data-bar]', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '[data-timeline]', start: 'top 75%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="experiencia" data-section="experiencia" className="section shell">
      <div className="grid-editorial items-end gap-y-8">
        <SectionLabel index="05" className="col-span-4 md:col-span-12">
          Experiencia
        </SectionLabel>
        <h2 className="t-d1 col-span-4 tabular-nums md:col-span-8">
          <MaskLines
            lines={[
              <span className="flex items-center gap-[0.18em]">
                {FROM}
                <span className="h-[0.07em] w-[0.7em] bg-red" />
                <span ref={counter}>{TO}</span>
              </span>,
            ]}
          />
        </h2>
        <Reveal delay={0.15} className="col-span-4 md:col-span-3 md:col-start-10">
          <p className="max-w-xs text-muted">
            De las prácticas en estudios creativos a una sociedad, el marketing deportivo y la práctica independiente.
          </p>
        </Reveal>
      </div>

      <div data-timeline className="mt-[clamp(3.5rem,7vw,7rem)]">
        {/* Axis header */}
        <div className="grid-editorial label hidden pb-4 text-muted md:grid">
          <span className="col-span-2">Periodo</span>
          <span className="col-span-4">Estudio / Empresa</span>
          <span className="col-span-2">Puesto</span>
          <div className="relative col-span-4 h-4">
            {years.map((y, i) => (
              <span
                key={y}
                className={cn(
                  'absolute top-0 tabular-nums',
                  i === 0 ? '' : i === years.length - 1 ? '-translate-x-full' : '-translate-x-1/2',
                )}
                style={{ left: `${pct(y)}%` }}
              >
                {shortYear(y)}
              </span>
            ))}
          </div>
        </div>

        <ol>
          {experience.map((item, i) => {
            const current = item.end === null
            const end = item.end ?? TO
            return (
              <li key={item.company} className="group">
                <Rule className={current ? 'bg-ink' : 'bg-line'} delay={i * 0.06} />
                <div className="grid-editorial items-center gap-y-3 py-6 md:py-8">
                  <span
                    className={cn(
                      'col-span-4 whitespace-nowrap text-[clamp(1.25rem,1.7vw,1.875rem)] font-light tracking-[-0.02em] tabular-nums transition-colors duration-500 md:col-span-2',
                      current ? 'text-red' : 'group-hover:text-red',
                    )}
                  >
                    {item.start} — {current ? 'Hoy' : end}
                  </span>

                  <div className="col-span-4 md:col-span-4">
                    <h3 className="t-h2 font-semibold transition-transform duration-700 ease-expo md:group-hover:translate-x-2">
                      {item.company}
                    </h3>
                    {item.note && <p className="label mt-1.5 text-muted">{item.note}</p>}
                  </div>

                  <span className="col-span-4 text-[15px] md:col-span-2">
                    {current && <span className="mr-2 inline-block size-[6px] -translate-y-px animate-pulse-dot rounded-full bg-red align-middle" />}
                    {item.role}
                  </span>

                  <div className="relative col-span-4 mt-2 h-4 md:mt-0" aria-hidden>
                    <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
                    {years.map((y) => (
                      <span
                        key={y}
                        className="absolute top-1/2 h-1.5 w-px -translate-y-1/2 bg-line"
                        style={{ left: `${pct(y)}%` }}
                      />
                    ))}
                    <span
                      data-bar
                      className={cn('absolute top-1/2 h-1.5 -translate-y-1/2', current ? 'bg-red' : 'bg-ink')}
                      style={{ left: `${pct(item.start)}%`, width: `${pct(end) - pct(item.start)}%` }}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
        <Rule className="bg-ink" />
      </div>
    </section>
  )
}
