import {
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Finance1Status } from './types'

export const finance1Statuses: readonly Finance1Status[] = [
  'settled',
  'pending',
  'refunded',
  'failed',
]

export const finance1StatusAppearance = {
  failed: { icon: XCircleIcon, tone: 'danger' },
  pending: { icon: ClockIcon, tone: 'warning' },
  refunded: { icon: ArrowCounterClockwiseIcon, tone: 'neutral' },
  settled: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Finance1Status, DataOptionAppearance>
