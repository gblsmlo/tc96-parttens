import type { ToastPosition } from '@tc96/ui/toast'

export const toastTypeNames = [
  'default',
  'success',
  'error',
  'info',
  'warning',
  'loading',
] as const

export type ToastTypeName = (typeof toastTypeNames)[number]

export const toastPositions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const satisfies readonly ToastPosition[]
