import { useEffect, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getProjectIndex,
  pad,
  placeholderGallery,
  projects,
  titleLinesOf,
  type GalleryLayout,
  type Project,
} from '../data/projects'
import { site } from '../data/site'
import { SECTIONS_MOUNTED } from '../hooks/useActiveSection'
import { INTRO_DELAY, cn } from '../lib/motion'
import { ArrowSwap } from '../components/Arrow'
import Media from '../components/Media'
import Page from '../components/Page'
import Pending from '../components/Pending'
import { MaskLines, Reveal, Rule } from '../components/Reveal'
import Footer from '../sections/Footer'
import NotFound from './NotFound'

const layouts: Record<GalleryLayout, { cls: string; aspect: string }> = {
  full: { cls: 'col-span-4 md:col-span-12', aspect: '16/9' },
  wide: { cls: 'col-span-4 md:col-span-12', aspect: '21/9' },
  half: { cls: 'col-span-4 md:col-span-6', aspect: '4/5' },
  'offset-left': { cls: 'col-span-4 md:col-span-8', aspect: '3/2' },
  'offset-right': { cls: 'col-span-4 md:col-span-8 md:col-start-5', aspect: '3/2' },
  portrait: { cls: 'col-span-4 md:col-span-5 md:col-start-7', aspect: '4/5' },
}

/** One numbered chapter of a case study: label on the left, content on the right. */
function Chapter({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="shell grid-editorial gap-y-6 pb-[clamp(4rem,8vw,8rem)]">
      <Reveal className="col-span-4 md:col-span-3">
        <Rule className="mb-4 bg-ink" />
        <p className="label flex items-center gap-3">
          <span className="tabular-nums text-red">({index})</span>
          <span>{title}</span>
        </p>
      </Reveal>
      <Reveal delay={0.1} className="col-span-4 md:col-span-8 md:col-start-5 md:pt-9">
        {children}
      </Reveal>
    </section>
  )
}

function Empty({ children }: { children: ReactNode }) {
  return site.showPlaceholders ? <Pending>{children}</Pending> : null
}

function VisualDirection({ project }: { project: Project }) {
  const { text, palette, typefaces } = project.visualDirection
  return (
    <div className="flex flex-col gap-10">
      {text ? <p className="t-lead-xl">{text}</p> : <Empty>Concepto visual · projects.ts → visualDirection.text</Empty>}

      <div className="grid gap-10 sm:grid-cols-2">
        {(palette.length > 0 || site.showPlaceholders) && (
        <div>
          <p className="label mb-4 text-muted">Color</p>
          {palette.length ? (
            <ul className="flex flex-wrap gap-3">
              {palette.map((hex) => (
                <li key={hex} className="w-20">
                  <span className="block aspect-square border border-line" style={{ backgroundColor: hex }} />
                  <span className="label mt-2 block tabular-nums text-muted">{hex.toUpperCase()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Paleta · visualDirection.palette</Empty>
          )}
        </div>
        )}
        {(typefaces.length > 0 || site.showPlaceholders) && (
        <div>
          <p className="label mb-4 text-muted">Tipografía</p>
          {typefaces.length ? (
            <ul>
              {typefaces.map((t) => (
                <li key={t} className="t-h2 border-t border-line py-3 last:border-b">
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Tipografías · visualDirection.typefaces</Empty>
          )}
        </div>
        )}
      </div>
    </div>
  )
}

function MoreProjects({ current }: { current: Project }) {
  // The next two projects after this one, wrapping around the list
  const pool = projects.filter((p) => p.featured)
  const at = pool.indexOf(current)
  const others = [1, 2].map((k) => pool[(at + k) % pool.length]).filter((p) => p !== current)
  return (
    <section className="shell pb-[var(--section-y)]">
      <Rule className="bg-ink" />
      <Reveal className="label mt-5 flex items-center justify-between">
        <span>Más proyectos</span>
        <Link to="/#proyectos" className="group inline-flex items-center gap-3">
          Ver todos
          <ArrowSwap className="text-sm text-red" />
        </Link>
      </Reveal>

      <div className="grid-editorial mt-10 gap-y-14 md:mt-14">
        {others.map((p) => {
          const n = pad(projects.indexOf(p) + 1)
          return (
            <Link
              key={p.slug}
              to={`/proyectos/${p.slug}`}
              data-cursor="Ver"
              className="group col-span-4 md:col-span-6"
            >
              <Media src={p.cover || p.heroImage} alt={p.title} aspect="3/2" tone={p.tone} slot={`${n} — Portada`} mark={n} hover />
              <div className="mt-5 flex items-start justify-between gap-6">
                <div>
                  <p className="label flex items-center gap-3">
                    <span className="tabular-nums text-red">{n}</span>
                    <span className="h-px w-6 bg-red transition-[width] duration-700 ease-expo group-hover:w-12" />
                    <span className="text-muted">{p.disciplines.join(' / ') || 'Caso de estudio'}</span>
                  </p>
                  <h3 className="t-h1 mt-3">
                    <span className="hover-underline">{p.title}</span>
                  </h3>
                </div>
                <ArrowSwap className="mt-8 shrink-0 text-xl text-red" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const index = getProjectIndex(slug)
  const project = projects[index]

  useEffect(() => {
    if (!project) return
    document.title = `${project.title} — Sergio Solís, ${site.role}`
    window.dispatchEvent(new Event(SECTIONS_MOUNTED))
  }, [project])

  if (!project) return <NotFound />

  const num = pad(index + 1)
  const images = project.gallery.length ? project.gallery : placeholderGallery

  // Chapters with no content disappear once placeholders are off, and the
  // (01)…(06) numbering stays continuous.
  const vd = project.visualDirection
  const filled = {
    summary: !!(project.overview || project.description),
    role: !!project.role,
    disciplines: project.disciplines.length > 0,
    visual: !!(vd.text || vd.palette.length || vd.typefaces.length),
    images: project.gallery.length > 0,
    details: project.details.length > 0 || !!project.url,
  }
  const order = ['summary', 'role', 'disciplines', 'visual', 'images', 'details'] as const
  const shown = order.filter((k) => filled[k] || site.showPlaceholders)
  const n = (k: (typeof order)[number]) => pad(shown.indexOf(k) + 1)
  const show = (k: (typeof order)[number]) => shown.includes(k)

  const meta = [
    { label: 'Cliente / Proyecto', value: project.title },
    { label: 'Año', value: project.year },
    { label: 'Disciplinas', value: project.disciplines.join(' / ') },
    { label: 'Rol', value: project.role },
  ]

  return (
    <Page label={`Proyecto ${num} — ${project.title}`}>
      <article>
        {/* Header */}
        <header className="shell pt-28 md:pt-36">
          <Reveal onMount delay={INTRO_DELAY} y={10} className="label flex items-center justify-between">
            <Link to="/#proyectos" className="group inline-flex items-center gap-3">
              <ArrowSwap dir="left" className="text-sm text-red" />
              Volver a proyectos
            </Link>
            <span className="tabular-nums text-muted">
              <span className="text-red">{num}</span> / {pad(projects.length)}
            </span>
          </Reveal>
          <Rule className="mt-4 bg-ink" delay={INTRO_DELAY} />

          <Reveal onMount delay={INTRO_DELAY + 0.1} y={10} className="label mt-14 flex items-center gap-3 md:mt-20">
            <span className="text-red">Proyecto {num}</span>
            <span className="h-px w-6 bg-red" />
            <span>Caso de estudio</span>
          </Reveal>

          <h1 className="t-d1 mt-6">
            <MaskLines onMount delay={INTRO_DELAY + 0.1} lines={titleLinesOf(project)} />
          </h1>

          <dl className="grid-editorial mt-12 gap-y-6 md:mt-16">
            {meta.map((m, i) => (
              <div key={m.label} className="col-span-2 md:col-span-3">
                <Rule className="bg-ink" delay={INTRO_DELAY + 0.2 + i * 0.06} />
                <Reveal onMount delay={INTRO_DELAY + 0.35 + i * 0.06} y={10}>
                  <dt className="label mt-4 text-muted">{m.label}</dt>
                  <dd className="mt-2 text-[15px] leading-snug">{m.value || <Pending>Por agregar</Pending>}</dd>
                </Reveal>
              </div>
            ))}
          </dl>
        </header>

        {/* Hero image */}
        <div className="shell mb-[clamp(4rem,8vw,8rem)] mt-12 md:mt-16">
          <Media
            src={project.heroImage}
            video={project.coverVideo}
            alt={project.title}
            aspect="16/9"
            tone={project.tone}
            slot={`${num} — Imagen principal`}
            hint="projects.ts → heroImage"
            mark={num}
            parallax
            priority
          />
        </div>

        {show('summary') && (
        <Chapter index={n('summary')} title="Resumen">
          {project.overview || project.description ? (
            <p className="t-lead-xl">{project.overview || project.description}</p>
          ) : (
            <Empty>Contexto, reto y enfoque · projects.ts → overview</Empty>
          )}
        </Chapter>
        )}

        {show('role') && (
        <Chapter index={n('role')} title="Rol">
          {project.role ? <p className="t-h1">{project.role}</p> : <Empty>projects.ts → role</Empty>}
        </Chapter>
        )}

        {show('disciplines') && (
        <Chapter index={n('disciplines')} title="Disciplinas">
          {project.disciplines.length ? (
            <ul>
              {project.disciplines.map((d, i) => (
                <li key={d} className="flex items-baseline gap-6 border-t border-line py-4 last:border-b">
                  <span className="label tabular-nums text-red">{pad(i + 1)}</span>
                  <span className="t-h2">{d}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>projects.ts → disciplines</Empty>
          )}
        </Chapter>
        )}

        {show('visual') && (
        <Chapter index={n('visual')} title="Dirección visual">
          <VisualDirection project={project} />
        </Chapter>
        )}

        {/* Project images */}
        {show('images') && (
        <section className="shell pb-[clamp(4rem,8vw,8rem)]">
          <Rule className="bg-ink" />
          <Reveal className="mb-10 mt-4 flex items-end justify-between md:mb-14">
            <p className="label flex items-center gap-3">
              <span className="tabular-nums text-red">({n('images')})</span>
              <span>Imágenes del proyecto</span>
            </p>
            <span className="label tabular-nums text-muted">
              {project.gallery.length ? `${pad(project.gallery.length)} imágenes` : 'Por agregar'}
            </span>
          </Reveal>
          <div className="grid-editorial gap-y-[clamp(2.5rem,5vw,5rem)]">
            {images.map((g, k) => {
              const l = layouts[g.layout]
              const aspect = g.aspect || l.aspect
              return (
                <figure key={k} className={cn(l.cls)}>
                  <Media
                    src={g.src}
                    alt={g.caption || `${project.title} — imagen ${k + 1}`}
                    aspect={aspect}
                    tone={project.tone}
                    slot={`${num} — Imagen ${pad(k + 1)}`}
                    hint={`projects.ts → gallery[${k}]`}
                    hover
                    parallax={g.layout === 'full'}
                  />
                  <figcaption className="label mt-3 flex justify-between gap-4 text-muted">
                    <span>
                      <span className="tabular-nums text-red">{pad(k + 1)}</span> {g.caption}
                    </span>
                    <span className="tabular-nums">{aspect.replace('/', ':')}</span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </section>
        )}

        {show('details') && (
        <Chapter index={n('details')} title="Detalles">
          {project.details.length || project.url ? (
            <dl>
              {project.details.map((d) => (
                <div key={d.label} className="grid grid-cols-[8rem_1fr] gap-6 border-t border-line py-4 md:grid-cols-[12rem_1fr]">
                  <dt className="label pt-1 text-muted">{d.label}</dt>
                  <dd className="text-[17px] leading-snug">{d.value}</dd>
                </div>
              ))}
              {project.url && (
                <div className="grid grid-cols-[8rem_1fr] gap-6 border-y border-line py-4 md:grid-cols-[12rem_1fr]">
                  <dt className="label pt-1 text-muted">En línea</dt>
                  <dd>
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-[17px]">
                      <span className="hover-underline">{project.url.replace(/^https?:\/\//, '')}</span>
                      <ArrowSwap dir="up-right" className="text-sm text-red" />
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <Empty>Entregables, formatos y alcance · projects.ts → details</Empty>
          )}
        </Chapter>
        )}

        <MoreProjects current={project} />
      </article>
      <Footer />
    </Page>
  )
}
