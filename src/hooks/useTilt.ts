import { useMotionValue, type MotionValue } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

/** Latest tilt, normalised to -1…1 — read every frame by the particle canvas. */
export const tiltNow = { x: 0, y: 0 }

type PermissionFn = () => Promise<'granted' | 'denied'>
const permissionFor = (ctor: unknown): PermissionFn | undefined =>
  (ctor as { requestPermission?: PermissionFn } | undefined)?.requestPermission

const clamp = (v: number) => Math.max(-1, Math.min(1, v))
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

/**
 * Phone tilt for the hero (mobile only), made to work on any phone:
 *
 * - Listens right away; no button needed where the browser doesn't ask.
 * - Uses `deviceorientation` (gyroscope) when it delivers values, and falls
 *   back to `devicemotion` gravity (accelerometer — on virtually every phone)
 *   when it doesn't, e.g. Android devices without a gyroscope.
 * - The first reading becomes the neutral pose, however the phone is held.
 * - Only if no reading arrives and the browser exposes a permission request
 *   (iOS) does it ask for a tap: `chip === 'tap'`. Otherwise `chip === 'hint'`
 *   invites the visitor to tilt until the first real movement.
 */
export function useTilt(enabled: boolean): {
  x: MotionValue<number>
  y: MotionValue<number>
  chip: 'tap' | 'hint' | null
  enable: () => void
} {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [needsTap, setNeedsTap] = useState(false)
  const [receiving, setReceiving] = useState(false)
  const [moved, setMoved] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const enable = useCallback(() => {
    const asks = [
      permissionFor(typeof DeviceOrientationEvent !== 'undefined' ? DeviceOrientationEvent : undefined),
      permissionFor(typeof DeviceMotionEvent !== 'undefined' ? DeviceMotionEvent : undefined),
    ].filter(Boolean) as PermissionFn[]
    if (!asks.length) return
    Promise.all(asks.map((ask) => ask().catch(() => 'denied' as const))).then((states) => {
      if (states.includes('granted')) {
        setNeedsTap(false)
        setAttempt((n) => n + 1) // re-attach the listeners with access granted
      }
    })
  }, [])

  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let orientWorks = false
    let orientBase: { beta: number; gamma: number } | null = null
    let motionBase: { x: number; y: number } | null = null
    const flip = isIOS() ? -1 : 1 // iOS reports gravity with the opposite sign

    const apply = (tx: number, ty: number) => {
      tx = clamp(tx)
      ty = clamp(ty)
      tiltNow.x = tx
      tiltNow.y = ty
      x.set(tx)
      y.set(ty)
      setReceiving(true)
      setNeedsTap(false) // data is flowing: no permission tap needed
      if (Math.abs(tx) > 0.25 || Math.abs(ty) > 0.25) setMoved(true)
    }

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      orientWorks = true
      if (!orientBase) orientBase = { beta: e.beta, gamma: e.gamma }
      apply((e.gamma - orientBase.gamma) / 18, (e.beta - orientBase.beta) / 18)
    }

    const onMotion = (e: DeviceMotionEvent) => {
      if (orientWorks) return // the gyroscope path is smoother when available
      const g = e.accelerationIncludingGravity
      if (!g || g.x === null || g.y === null) return
      // Gravity split across the screen axes, as a fraction of 1 g
      const gx = (-g.x * flip) / 9.81
      const gy = (g.y * flip) / 9.81
      if (!motionBase) motionBase = { x: gx, y: gy }
      apply((gx - motionBase.x) / 0.3, (gy - motionBase.y) / 0.3)
    }

    const onTurn = () => {
      orientBase = null
      motionBase = null
    }

    window.addEventListener('deviceorientation', onOrient)
    window.addEventListener('devicemotion', onMotion)
    window.addEventListener('orientationchange', onTurn)

    // Nothing after a moment and the browser can ask for access → offer the tap
    const check = window.setTimeout(() => {
      const canAsk =
        permissionFor(typeof DeviceOrientationEvent !== 'undefined' ? DeviceOrientationEvent : undefined) ||
        permissionFor(typeof DeviceMotionEvent !== 'undefined' ? DeviceMotionEvent : undefined)
      setReceiving((got) => {
        if (!got && canAsk) setNeedsTap(true)
        return got
      })
    }, 1500)

    return () => {
      window.clearTimeout(check)
      window.removeEventListener('deviceorientation', onOrient)
      window.removeEventListener('devicemotion', onMotion)
      window.removeEventListener('orientationchange', onTurn)
      tiltNow.x = 0
      tiltNow.y = 0
    }
  }, [enabled, attempt, x, y])

  const chip = !enabled || moved ? null : needsTap ? 'tap' : receiving ? 'hint' : null
  return { x, y, chip, enable }
}
