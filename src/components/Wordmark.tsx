import { cn } from '../lib/motion'

/** The "I" of SOLÍS carrying the red acute accent — the identity's signature. */
export function AccentI({ className }: { className?: string }) {
  return <span className={cn('accent-i', className)}>I</span>
}

export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('whitespace-nowrap', className)} aria-label="Sergio Solís" role="img">
      <span aria-hidden>
        SERGIO SOL<AccentI />S
      </span>
    </span>
  )
}
