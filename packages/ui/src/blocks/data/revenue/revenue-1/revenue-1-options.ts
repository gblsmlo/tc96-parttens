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
import type { Revenue1Risk, Revenue1Stage } from './types'

export const revenue1Stages: readonly Revenue1Stage[] = [
  'preparing',
  'commercial-review',
  'legal-review',
  'signed',
]

export const revenue1Risks: readonly Revenue1Risk[] = [
  'critical',
  'high',
  'medium',
  'low',
]

export const revenue1StageAppearance = {
  'commercial-review': { icon: HandshakeIcon, tone: 'info' },
  'legal-review': { icon: ScalesIcon, tone: 'warning' },
  preparing: { icon: HourglassIcon, tone: 'neutral' },
  signed: { icon: CheckCircleIcon, tone: 'success' },
} as const satisfies Record<Revenue1Stage, DataOptionAppearance>

export const revenue1RiskAppearance = {
  critical: { icon: WarningOctagonIcon, tone: 'danger' },
  high: { icon: WarningIcon, tone: 'warning' },
  low: { icon: ShieldCheckIcon, tone: 'neutral' },
  medium: { icon: WarningCircleIcon, tone: 'info' },
} as const satisfies Record<Revenue1Risk, DataOptionAppearance>
