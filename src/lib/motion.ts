/** Expo-out: fast start, long soft landing. Used for nearly every reveal. */
export const ease = [0.16, 1, 0.3, 1] as const
/** In-out: used for curtains and wipes that must feel mechanical and precise. */
export const easeInOut = [0.76, 0, 0.24, 1] as const

/** Delay after which the page curtain has mostly lifted */
export const INTRO_DELAY = 0.55

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')
