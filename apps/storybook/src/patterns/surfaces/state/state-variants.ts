import type { StateGuardState, StateSurfaceKind } from '@tc96/ui/patterns'

export const stateSurfaceKinds: readonly StateSurfaceKind[] = [
  'empty',
  'no-result',
  'error',
  'permission',
  'not-found',
]

export const stateNames: readonly StateGuardState[] = [
  ...stateSurfaceKinds,
  'loading',
  'data',
]

export const stateIconModes = ['default', 'custom', 'none'] as const

export type StateIconMode = (typeof stateIconModes)[number]
