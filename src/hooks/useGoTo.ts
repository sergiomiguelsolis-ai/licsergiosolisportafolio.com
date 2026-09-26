import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/** Scrolls to a home section, or routes back home first when on a case study. */
export function useGoTo() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (id: string) => {
      if (pathname === '/') {
        if (id === 'top') window.scrollTo({ top: 0 })
        else document.getElementById(id)?.scrollIntoView()
        return
      }
      navigate(id === 'top' ? '/' : `/#${id}`)
    },
    [pathname, navigate],
  )
}
