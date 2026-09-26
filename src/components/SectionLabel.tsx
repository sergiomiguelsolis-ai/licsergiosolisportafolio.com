import type { ReactNode } from 'react'
import { cn } from '../lib/motion'
import { Reveal } from './Reveal'

interface SectionLabelProps {
  index: string
  children: ReactNode
  className?: string
  inverse?: boolean
}

/** (02) —— Selected work : the running index that structures every section. */
export default function SectionLabel({ index, children, className, inverse }: SectionLabelProps) {
  return (
    <Reveal y={12} className={cn('label flex items-center gap-3', className)}>
      <span className="tabular-nums text-red">({index})</span>
      <span className="h-px w-6 bg-red" />
      <span className={inverse ? 'text-paper' : 'text-ink'}>{children}</span>
    </Reveal>
  )
}
