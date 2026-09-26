import type { ReactNode } from 'react'
import { site } from '../data/site'
import { cn } from '../lib/motion'
import Pending from './Pending'

export interface MetaItem {
  label: string
  value?: ReactNode
}

/**
 * A compact label/value sheet — the "ficha" of a project.
 * Empty values become a "por agregar" marker, or disappear once
 * placeholders are switched off.
 */
export default function MetaList({ items, className }: { items: MetaItem[]; className?: string }) {
  const visible = items.filter((i) => i.value || site.showPlaceholders)
  if (!visible.length) return null

  return (
    <dl className={cn('grid grid-cols-[5.5rem_1fr] text-[14px] leading-snug', className)}>
      {visible.map((item) => (
        <div key={item.label} className="col-span-2 grid grid-cols-subgrid items-baseline border-t border-line py-2.5">
          <dt className="label text-muted">{item.label}</dt>
          <dd>{item.value || <Pending>Por agregar</Pending>}</dd>
        </div>
      ))}
    </dl>
  )
}
