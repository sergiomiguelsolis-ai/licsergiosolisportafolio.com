import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useState } from 'react'
import { areas, pad, projects, type Area } from '../data/projects'
import { cn, ease } from '../lib/motion'
import ProjectCard, { type CardVariant } from '../components/ProjectCard'
import { MaskLines, Reveal } from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

// Every card uses the wide composition (image on top, title + sheet below).
// A project can still opt into 'split' or 'pair' with `card` in projects.ts.
const rhythm: CardVariant[] = ['feature']
const featured = projects.filter((p) => p.featured)
const countFor = (area: Area | 'all') =>
  area === 'all' ? featured.length : featured.filter((p) => p.category.includes(area)).length

/** TODO / MARCA / DIGITAL / … — an index line, not a UI widget. */
function Filter({ value, onChange }: { value: Area | 'all'; onChange: (v: Area | 'all') => void }) {
  const options = [{ id: 'all' as const, label: 'Todo' }, ...areas]
  return (
    <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div role="group" aria-label="Filtrar proyectos por área" className="label-lg flex w-max items-center gap-x-3 py-4 md:gap-x-4">
        <span className="mr-2 text-muted">Filtrar</span>
        {options.map((o, i) => {
          const count = countFor(o.id)
          const active = value === o.id
          const empty = count === 0
          return (
            <Fragment key={o.id}>
              {i > 0 && <span className="text-line">/</span>}
              <button
                type="button"
                onClick={() => onChange(o.id)}
                disabled={empty}
                aria-pressed={active}
                title={empty ? 'Aún no hay proyectos publicados en esta área' : undefined}
                className={cn(
                  'relative inline-flex items-baseline gap-1 py-1 uppercase transition-colors duration-300',
                  active ? 'text-red' : 'hover:text-red',
                  empty && 'text-muted/50',
                )}
              >
                {active && <span className="absolute -left-2.5 top-1/2 size-[5px] -translate-y-1/2 rounded-full bg-red" />}
                {o.label}
                <sup className="text-[9px] tabular-nums">{pad(count)}</sup>
              </button>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default function SelectedWork() {
  const [area, setArea] = useState<Area | 'all'>('all')
  const visible = area === 'all' ? featured : featured.filter((p) => p.category.includes(area))

  return (
    <section id="proyectos" data-section="proyectos" className="section shell">
      <div className="grid-editorial items-end gap-y-8">
        <SectionLabel index="02" className="col-span-4 md:col-span-12">
          Proyectos
        </SectionLabel>
        <h2 className="t-d1 col-span-4 md:col-span-8">
          <MaskLines
            lines={[
              'Proyectos',
              <>
                <span className="serif-i">selectos</span>
                <span className="text-red">.</span>
              </>,
            ]}
          />
        </h2>
        <Reveal delay={0.15} className="col-span-4 md:col-span-3 md:col-start-10">
          <p className="max-w-xs text-muted">
            Proyectos de diseño gráfico para negocios y organizaciones — de la idea a su ejecución visual.
          </p>
          <p className="label mt-6 flex items-center gap-3">
            <span className="tabular-nums text-red">{pad(featured.length)}</span>
            <span>Proyectos</span>
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-[clamp(2.5rem,5vw,4.5rem)] border-y border-line">
        <Filter value={area} onChange={setArea} />
      </Reveal>

      <div className="mt-[clamp(3rem,6vw,6rem)] flex flex-col gap-[clamp(5rem,10.5vw,9.5rem)]">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <motion.div
              key={project.slug}
              layout="position"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease }}
            >
              <ProjectCard
                project={project}
                index={projects.indexOf(project)}
                variant={project.card ?? rhythm[i % rhythm.length]}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
