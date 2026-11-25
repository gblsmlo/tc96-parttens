import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  ClockIcon,
  WarningCircleIcon,
  WarningIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type {
  Legal8FailureOrigin,
  Legal8FailureState,
  Legal8RunState,
  Legal8Sort,
  Legal8View,
} from './types'

export const legal8Views: readonly Legal8View[] = ['runs', 'failures']

export const legal8Sorts: readonly Legal8Sort[] = ['newest', 'oldest']

export const legal8FailureOrigins: readonly Legal8FailureOrigin[] = [
  'system',
  'external',
  'registration',
]

export const legal8RunStates: readonly Legal8RunState[] = [
  'queued',
  'running',
  'done',
  'failed',
  'dead',
]

export const legal8FailureStates: readonly Legal8FailureState[] = [
  'open',
  'resolved',
]

export const legal8RunStateAppearance = {
  dead: { icon: XCircleIcon, tone: 'danger' },
  done: { icon: CheckCircleIcon, tone: 'success' },
  failed: { icon: WarningIcon, tone: 'warning' },
  queued: { icon: ClockIcon, tone: 'neutral' },
  running: { icon: ArrowsClockwiseIcon, tone: 'info' },
} as const satisfies Record<Legal8RunState, DataOptionAppearance>

export const legal8FailureStateAppearance = {
  open: { icon: WarningCircleIcon, tone: 'danger' },
  resolved: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Legal8FailureState, DataOptionAppearance>
