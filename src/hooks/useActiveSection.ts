import { useEffect, useState } from 'react'

export const SECTIONS_MOUNTED = 'sections:mounted'

/**
 * Scroll-spy for the navigation. Observes every element with
 * [data-section] and reports its value when it crosses the viewport center.
 * Pages dispatch SECTIONS_MOUNTED so the spy rescans after route transitions.
 */
export function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setActive(null)
      return
    }

    let observer: IntersectionObserver | undefined

    const scan = () => {
      observer?.disconnect()
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive((entry.target as HTMLElement).dataset.section || null)
            }
          })
        },
        { rootMargin: '-45% 0px -54% 0px' },
      )
      document.querySelectorAll('[data-section]').forEach((el) => observer!.observe(el))
    }

    scan()
    window.addEventListener(SECTIONS_MOUNTED, scan)
    return () => {
      observer?.disconnect()
      window.removeEventListener(SECTIONS_MOUNTED, scan)
    }
  }, [enabled])

  return active
}
