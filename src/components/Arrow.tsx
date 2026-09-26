import type { CSSProperties } from 'react'
import { cn } from '../lib/motion'

export type ArrowDir = 'right' | 'left' | 'up' | 'down' | 'up-right'

const rotation: Record<ArrowDir, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: -90,
  'up-right': -45,
}

const travel: Record<ArrowDir, [string, string]> = {
  right: ['110%', '0%'],
  left: ['-110%', '0%'],
  down: ['0%', '110%'],
  up: ['0%', '-110%'],
  'up-right': ['110%', '-110%'],
}

export function Arrow({ dir = 'right', className }: { dir?: ArrowDir; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn('size-[1em] shrink-0', className)}
      style={{ transform: `rotate(${rotation[dir]}deg)` }}
    >
      <path d="M1.5 8h12.5M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

/**
 * On hover of the parent `.group`, the arrow exits in its own direction
 * and a copy enters from behind — a small, precise gesture.
 */
export function ArrowSwap({ dir = 'right', className }: { dir?: ArrowDir; className?: string }) {
  const [dx, dy] = travel[dir]
  return (
    <span
      aria-hidden
      className={cn('relative inline-flex size-[1em] shrink-0 overflow-hidden', className)}
      style={{ '--dx': dx, '--dy': dy } as CSSProperties}
    >
      <span className="arrow-a">
        <Arrow dir={dir} />
      </span>
      <span className="arrow-b">
        <Arrow dir={dir} />
      </span>
    </span>
  )
}
