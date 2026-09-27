import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { pad } from '../data/projects'
import { site } from '../data/site'
import { ArrowSwap } from './Arrow'
import Media from './Media'
import MetaList from './MetaList'
import Pending from './Pending'
import { Reveal } from './Reveal'

export type { CardLayout as CardVariant } from '../data/projects'
import type { CardLayout as CardVariant, GalleryItem } from '../data/projects'

const ratioOf = (aspect: string) => {
  const [w, h] = aspect.split('/').map(Number)
  return w / h
}
const defaultAspect: Record<GalleryItem['layout'], string> = {
  full: '16/9',
  wide: '21/9',
  half: '4/5',
  'offset-left': '3/2',
  'offset-right': '3/2',
  portrait: '4/5',
  carousel: '1/1',
}
/** First vertical piece of the gallery — the natural partner for a portrait cover */
const portraitDetail = (gallery: GalleryItem[]) =>
  (gallery.filter((g) => g.src).find((g) => ratioOf(g.aspect || defaultAspect[g.layout]) < 1) ?? gallery[0])?.src

interface CardProps {
  project: Project
  /** Position in the full project list — drives the number */
  index: number
  variant: CardVariant
}

/** 01 —— IDENTIDAD DE MARCA / DISEÑO WEB / … The red rule stretches on hover. */
function Meta({ project, num }: { project: Project; num: string }) {
  return (
    <span className="label flex items-center gap-3">
      <span className="tabular-nums text-red">{num}</span>
      <span className="h-px w-6 bg-red transition-[width] duration-700 ease-expo group-hover:w-12" />
      {project.disciplines.length ? (
        <span>{project.disciplines.join(' / ')}</span>
      ) : (
        <Pending>Disciplinas por agregar</Pending>
      )}
    </span>
  )
}

/**
 * Long single words ("Construcciones") can't wrap, so they get a smaller size
 * to stay inside their column. Short titles keep the full display size.
 */
const fits: Record<'t-d1' | 't-d2', string> = {
  't-d1': 't-d1 md:text-[clamp(2.75rem,6.6vw,8rem)]',
  't-d2': 't-d2 md:text-[clamp(2rem,4.1vw,5rem)]',
}

function Title({ project, className }: { project: Project; className: 't-d1' | 't-d2' }) {
  const longest = Math.max(...project.title.split(' ').map((w) => w.length))
  return (
    <h3 className={longest > 10 ? fits[className] : className}>
      <span className="inline-block transition-transform duration-700 ease-expo group-hover:translate-x-[0.04em]">
        <span className="hover-underline">{project.title}</span>
      </span>
    </h3>
  )
}

function Description({ project }: { project: Project }) {
  if (project.description) return <p className="max-w-sm text-muted">{project.description}</p>
  return site.showPlaceholders ? <Pending>Descripción · projects.ts → description</Pending> : null
}

function Sheet({ project }: { project: Project }) {
  return (
    <MetaList
      className="w-full max-w-sm"
      items={[
        { label: 'Año', value: project.year },
        { label: 'Rol', value: project.role },
      ]}
    />
  )
}

function ViewCase() {
  return (
    <span className="label-lg inline-flex items-center gap-3">
      <span className="transition-colors duration-500 group-hover:text-red">Ver caso de estudio</span>
      <ArrowSwap className="text-sm text-red" />
    </span>
  )
}

/**
 * Three compositions, cycled through the list so no two neighbours look alike:
 *  feature — full-width 16:9 cover, huge title
 *  split   — big index number + text column, 4:3 image on the right
 *  pair    — portrait cover + detail image, text on the right
 */
export default function ProjectCard({ project, index, variant }: CardProps) {
  const num = pad(index + 1)
  const href = `/proyectos/${project.slug}`
  const cover = project.cover || project.heroImage
  const hint = 'projects.ts → heroImage'
  const label = `${project.title} — ver caso de estudio`

  if (variant === 'feature') {
    return (
      <article>
        <Link to={href} data-cursor="Ver" aria-label={label} className="group block">
          <Reveal y={12} className="mb-4 flex items-center justify-between gap-6">
            <Meta project={project} num={num} />
            <span className="label shrink-0 tabular-nums text-muted">{project.year || '—'}</span>
          </Reveal>
          <Media src={cover} video={project.coverVideo} alt={project.title} aspect="16/9" tone={project.tone} slot={`${num} — Portada`} hint={hint} mark={num} hover parallax />
          <div className="grid-editorial mt-6 gap-y-6 md:mt-8">
            <Reveal className="col-span-4 md:col-span-7">
              <Title project={project} className="t-d1" />
            </Reveal>
            <Reveal delay={0.1} className="col-span-4 flex flex-col items-start gap-6 md:col-span-4 md:col-start-9 md:pt-3">
              <Description project={project} />
              <Sheet project={project} />
              <ViewCase />
            </Reveal>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'split') {
    return (
      <article>
        <Link to={href} data-cursor="Ver" aria-label={label} className="group grid-editorial gap-y-6">
          <div className="order-2 col-span-4 flex flex-col justify-between gap-10 md:order-1 md:col-span-4">
            <Reveal>
              <span className="t-num block text-ink/15 transition-colors duration-700 group-hover:text-red">{num}</span>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col items-start gap-5">
              <Meta project={project} num={num} />
              <Title project={project} className="t-d2" />
              <Description project={project} />
              <Sheet project={project} />
              <ViewCase />
            </Reveal>
          </div>
          <div className="order-1 col-span-4 md:order-2 md:col-span-8 md:col-start-5">
            <Media src={cover} video={project.coverVideo} alt={project.title} aspect="3/2" tone={project.tone} slot={`${num} — Portada`} hint={hint} mark={num} hover parallax />
          </div>
        </Link>
      </article>
    )
  }

  const detail = portraitDetail(project.gallery)
  return (
    <article>
      <Link to={href} data-cursor="Ver" aria-label={label} className="group grid-editorial gap-y-6">
        <div className="col-span-4 md:col-span-5">
          <Media src={cover} video={project.coverVideo} alt={project.title} aspect="4/5" tone={project.tone} slot={`${num} — Portada`} hint={hint} mark={num} hover parallax />
        </div>
        <div className="col-span-4 flex flex-col justify-between gap-10 md:col-span-5 md:col-start-8">
          <div className="hidden md:block md:w-3/4">
            <Media src={detail} alt="" aspect="3/4" tone={project.tone} slot={`${num} — Detalle`} hint="projects.ts → gallery[0]" hover />
          </div>
          <Reveal className="flex flex-col items-start gap-5">
            <Meta project={project} num={num} />
            <Title project={project} className="t-d2" />
            <Description project={project} />
            <Sheet project={project} />
            <ViewCase />
          </Reveal>
        </div>
      </Link>
    </article>
  )
}
