import { useMotionValue, type MotionValue } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

/** Latest tilt, normalised to -1…1 — read every frame by the particle canvas. */
export const tiltNow = { x: 0, y: 0 }

type PermissionFn = () => Promise<'granted' | 'denied'>
const requestPermission = (): PermissionFn | undefined =>
  typeof DeviceOrientationEvent !== 'undefined'
    ? (DeviceOrientationEvent as unknown as { requestPermission?: PermissionFn }).requestPermission
    : undefined

const clamp = (v: number) => Math.max(-1, Math.min(1, v))

/**
 * Phone tilt for the hero (mobile only).
 * The first reading becomes the neutral pose, so it works however the phone
 * is held. iOS needs a user gesture to grant sensor access (`enable`);
 * Android streams events straight away.
 */
export function useTilt(enabled: boolean): {
  x: MotionValue<number>
  y: MotionValue<number>
  needsPermission: boolean
  granted: boolean
  moved: boolean
  enable: () => void
} {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [needsPermission] = useState(() => !!requestPermission())
  const [granted, setGranted] = useState(() => !requestPermission())
  const [moved, setMoved] = useState(false)

  const enable = useCallback(() => {
    const ask = requestPermission()
    if (!ask) return setGranted(true)
    ask()
      .then((state) => setGranted(state === 'granted'))
      .catch(() => setGranted(false))
  }, [])

  useEffect(() => {
    if (!enabled || !granted) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let base: { beta: number; gamma: number } | null = null

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      if (!base) base = { beta: e.beta, gamma: e.gamma }
      const tx = clamp((e.gamma - base.gamma) / 30)
      const ty = clamp((e.beta - base.beta) / 30)
      tiltNow.x = tx
      tiltNow.y = ty
      x.set(tx)
      y.set(ty)
      if (Math.abs(tx) > 0.25 || Math.abs(ty) > 0.25) setMoved(true)
    }
    // Re-calibrate when the screen turns
    const onTurn = () => (base = null)

    window.addEventListener('deviceorientation', onOrient)
    window.addEventListener('orientationchange', onTurn)
    return () => {
      window.removeEventListener('deviceorientation', onOrient)
      window.removeEventListener('orientationchange', onTurn)
      tiltNow.x = 0
      tiltNow.y = 0
    }
  }, [enabled, granted, x, y])

  return { x, y, needsPermission, granted, moved, enable }
}
