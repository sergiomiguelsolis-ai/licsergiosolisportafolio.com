import type { ReactNode } from 'react'
import { site } from '../data/site'
import { cn } from '../lib/motion'

/** A clearly-marked slot for content that will be added later. Never fake content. */
export default function Pending({ children, className }: { children: ReactNode; className?: string }) {
  if (!site.showPlaceholders) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 border border-dashed border-muted/50 px-2.5 py-1.5 label text-muted',
        className,
      )}
    >
      <span className="size-1.5 shrink-0 bg-red" />
      {children}
    </span>
  )
}
