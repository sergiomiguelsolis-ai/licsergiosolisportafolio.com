import type { MouseEvent } from 'react'
import { navItems, site } from '../data/site'
import { useGoTo } from '../hooks/useGoTo'
import { cn } from '../lib/motion'
import { ArrowSwap } from '../components/Arrow'
import Wordmark from '../components/Wordmark'

/** `dark` continues a dark closing section (home: Contacto) into the footer. */
export default function Footer({ dark = false }: { dark?: boolean }) {
  const goTo = useGoTo()
  const handle = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    goTo(id)
  }

  return (
    <footer className={cn(dark && 'theme-dark')}>
      <div className="shell pb-8 pt-10">
      <div className="h-px bg-ink" />

      <div className="grid-editorial gap-y-10 pt-8">
        <div className="col-span-4 md:col-span-4">
          <Wordmark className="t-h2 font-semibold" />
          <p className="label mt-3 text-muted">{site.role}</p>
        </div>

        <div className="label col-span-2 leading-relaxed md:col-span-3">
          <p>
            {site.location.city}, {site.location.region}
          </p>
          <p className="text-muted">{site.location.country}</p>
        </div>

        <nav aria-label="Pie de página" className="col-span-2 md:col-span-2">
          <ul className="label flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`/#${item.id}`} onClick={handle(item.id)} className="transition-colors hover:text-red">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-4 flex items-start md:col-span-3 md:justify-end">
          <button type="button" onClick={() => goTo('top')} className="group label flex items-center gap-3">
            Volver arriba
            <ArrowSwap dir="up" className="text-sm text-red" />
          </button>
        </div>
      </div>

      <div className="label mt-20 flex items-center justify-between gap-4 text-muted">
        <span className="flex items-center gap-3">
          <span className="size-2 bg-red" />© {site.year} {site.name}
        </span>
        <span className="tabular-nums">Portafolio — Edición {site.year}</span>
      </div>
      </div>
    </footer>
  )
}
