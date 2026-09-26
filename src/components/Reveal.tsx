import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn, ease } from '../lib/motion'

const viewport = { once: true, margin: '0px 0px -10% 0px' }

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** Animate on mount instead of on scroll into view (used above the fold) */
  onMount?: boolean
}

/** Soft fade + rise. The default entrance for text blocks. */
export function Reveal({ children, className, delay = 0, y = 24, onMount = false }: RevealProps) {
  const target = { opacity: 1, y: 0 }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(onMount ? { animate: target } : { whileInView: target, viewport })}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

interface MaskLinesProps {
  lines: ReactNode[]
  className?: string
  lineClassName?: string | ((index: number) => string)
  delay?: number
  stagger?: number
  onMount?: boolean
  /** Cursor spotlight on the lines (on by default — MaskLines are the big bold titles) */
  spot?: boolean
}

/** Each line rises from behind a mask — the signature headline entrance. */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  onMount = false,
  spot = true,
}: MaskLinesProps) {
  // The observer watches the container: the lines themselves start clipped
  // by their mask, so they would never register as intersecting.
  const line = {
    hidden: { y: '130%' },
    shown: (i: number) => ({ y: '0%', transition: { duration: 1.2, ease, delay: delay + i * stagger } }),
  }
  return (
    <motion.span
      className={cn('block', className)}
      initial="hidden"
      {...(onMount ? { animate: 'shown' } : { whileInView: 'shown', viewport })}
    >
      {lines.map((content, i) => (
        <span
          key={i}
          className={cn('mask-line', typeof lineClassName === 'function' ? lineClassName(i) : lineClassName)}
        >
          <motion.span className={cn('block', spot && 'spot')} custom={i} variants={line}>
            {content}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

interface RuleProps {
  className?: string
  delay?: number
}

/** A hairline that draws itself from the left. */
export function Rule({ className, delay = 0 }: RuleProps) {
  return (
    <motion.span
      aria-hidden
      className={cn('block h-px w-full origin-left bg-line', className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -4% 0px' }}
      transition={{ duration: 1.5, ease, delay }}
    />
  )
}
