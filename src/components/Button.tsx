import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/motion'
import { ArrowSwap, type ArrowDir } from './Arrow'

type Variant = 'primary' | 'secondary' | 'inverse'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  arrow?: ArrowDir | null
  href?: string
  to?: string
  onClick?: () => void
  external?: boolean
  /** Suggested file name for downloads */
  download?: string
  disabled?: boolean
  className?: string
  title?: string
}

const variants: Record<Variant, string> = {
  primary: 'bg-red text-white hover:bg-ink hover:text-paper',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-paper',
  inverse: 'border border-paper/40 text-paper hover:bg-paper hover:text-ink',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 gap-4 px-4 label',
  md: 'h-12 gap-6 px-5 label-lg',
  lg: 'h-16 gap-10 px-6 label-lg md:h-[4.5rem] md:px-7',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  arrow = 'right',
  href,
  to,
  onClick,
  external,
  download,
  disabled,
  className,
  title,
}: ButtonProps) {
  const classes = cn(
    'group inline-flex shrink-0 items-center justify-between whitespace-nowrap transition-colors duration-500 ease-expo',
    variants[variant],
    sizes[size],
    disabled && 'pointer-events-none opacity-40',
    className,
  )

  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowSwap dir={arrow} className={size === 'lg' ? 'text-base' : 'text-sm'} />}
    </>
  )

  if (disabled) {
    return (
      <span className={classes} aria-disabled="true" title={title}>
        {content}
      </span>
    )
  }

  if (to) {
    return (
      <Link to={to} className={classes} title={title}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        title={title}
        download={download}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes} title={title}>
      {content}
    </button>
  )
}
