import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState, type MouseEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { navItems, site, whatsappUrl } from '../data/site'
import { pad } from '../data/projects'
import { useActiveSection } from '../hooks/useActiveSection'
import { useGoTo } from '../hooks/useGoTo'
import { cn, ease, easeInOut } from '../lib/motion'
import Button from './Button'
import FloatingTalk from './FloatingTalk'
import Wordmark from './Wordmark'

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const active = useActiveSection(pathname === '/')
  const goTo = useGoTo()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  // Mobile: which numbered home section is on screen (01 hero … 07 contact)
  const [section, setSection] = useState(1)
  useMotionValueEvent(scrollY, 'change', () => {
    if (pathname !== '/') return
    const nodes = document.querySelectorAll<HTMLElement>('main > section[id]')
    let current = 1
    nodes.forEach((el, i) => {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.45) current = i + 1
    })
    setSection(current)
  })
  const sectionCount = pathname === '/' ? document.querySelectorAll('main > section[id]').length : 0

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handle = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    goTo(id)
  }

  const solid = scrolled || open

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,padding] duration-700 ease-expo',
          solid ? 'border-line bg-paper py-3' : 'border-transparent bg-transparent py-5 md:py-6',
        )}
      >
        <div className="shell flex items-center justify-between gap-6">
          <a href="/" onClick={handle('top')} className="flex items-baseline gap-4" aria-label="Sergio Solís — inicio">
            <Wordmark className="text-[15px] font-semibold tracking-[-0.02em]" />
            <span
              className={cn(
                'label hidden text-muted transition-opacity duration-700 lg:inline',
                scrolled ? 'opacity-100' : 'opacity-0',
              )}
            >
              {site.role}
            </span>
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-6 md:flex lg:gap-10">
            <ul className="flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    onClick={handle(item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className="group label-lg relative block py-2"
                  >
                    <span
                      className={cn(
                        'absolute -left-3 top-1/2 size-[5px] -translate-y-1/2 rounded-full bg-red transition-transform duration-500 ease-expo',
                        active === item.id ? 'scale-100' : 'scale-0',
                      )}
                    />
                    {item.label}
                    <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-red transition-transform duration-500 ease-expo group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-6">
              <Button href={whatsappUrl} external size="sm" arrow="right">
                Hablemos
              </Button>
            </div>
          </nav>

          <button
            type="button"
            className="label-lg flex items-center gap-3 py-2 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {!open && sectionCount > 0 && scrolled && (
              <span className="tabular-nums text-muted">
                <span className="text-red">{String(section).padStart(2, '0')}</span> / {String(sectionCount).padStart(2, '0')}
              </span>
            )}
            <span>{open ? 'Cerrar' : 'Menú'}</span>
            <span className="relative block h-2 w-5">
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-ink transition-transform duration-500 ease-expo',
                  open ? 'top-1 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-red transition-transform duration-500 ease-expo',
                  open ? 'top-1 -rotate-45' : 'top-2',
                )}
              />
            </span>
          </button>
        </div>
        {/* Mobile reading progress — a hairline that fills with the scroll */}
        <motion.span
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-[2px] origin-left bg-red md:hidden"
          style={{ scaleX: scrollYProgress, opacity: scrolled && !open ? 1 : 0 }}
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-paper pb-8 pt-24 md:hidden"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: easeInOut }}
          >
            <nav aria-label="Móvil" className="shell flex flex-1 flex-col">
              <ul>
                {navItems.map((item, i) => (
                  <li key={item.id} className="border-t border-line">
                    <a href={`/#${item.id}`} onClick={handle(item.id)} className="flex items-baseline justify-between py-4">
                      <span className="mask-line">
                        <motion.span
                          className="t-d2 block"
                          initial={{ y: '130%' }}
                          animate={{ y: '0%' }}
                          transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.06 }}
                        >
                          {item.label}
                        </motion.span>
                      </span>
                      <span className="label tabular-nums text-red">{pad(i + 1)}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-6 border-t border-line pt-6">
                <div className="label flex justify-between text-muted">
                  <span>{site.location.short}</span>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-ink">
                    WA — {site.contact.whatsappDisplay}
                  </a>
                </div>
                <Button href={whatsappUrl} external size="lg" className="w-full">
                  Hablemos
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <FloatingTalk hidden={open} />
    </>
  )
}
