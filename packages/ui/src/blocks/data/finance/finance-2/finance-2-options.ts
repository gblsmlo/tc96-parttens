import {
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Finance2Status } from './types'

export const finance2Statuses: readonly Finance2Status[] = [
  'settled',
  'pending',
  'refunded',
  'failed',
]

export const finance2StatusAppearance = {
  failed: { icon: XCircleIcon, tone: 'danger' },
  pending: { icon: ClockIcon, tone: 'warning' },
  refunded: { icon: ArrowCounterClockwiseIcon, tone: 'neutral' },
  settled: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Finance2Status, DataOptionAppearance>
