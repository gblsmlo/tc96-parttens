import {
  CheckCircleIcon,
  HandshakeIcon,
  HourglassIcon,
  ScalesIcon,
  ShieldCheckIcon,
  WarningCircleIcon,
  WarningIcon,
  WarningOctagonIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Revenue2Risk, Revenue2Stage } from './types'

export const revenue2Stages: readonly Revenue2Stage[] = [
  'preparing',
  'commercial-review',
  'legal-review',
  'signed',
]

export const revenue2Risks: readonly Revenue2Risk[] = [
  'critical',
  'high',
  'medium',
  'low',
]

export const revenue2StageAppearance = {
  'commercial-review': { icon: HandshakeIcon, tone: 'info' },
  'legal-review': { icon: ScalesIcon, tone: 'warning' },
  preparing: { icon: HourglassIcon, tone: 'neutral' },
  signed: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Revenue2Stage, DataOptionAppearance>

export const revenue2RiskAppearance = {
  critical: { icon: WarningOctagonIcon, tone: 'danger' },
  high: { icon: WarningIcon, tone: 'warning' },
  low: { icon: ShieldCheckIcon, tone: 'neutral' },
  medium: { icon: WarningCircleIcon, tone: 'info' },
} as const satisfies Record<Revenue2Risk, DataOptionAppearance>
