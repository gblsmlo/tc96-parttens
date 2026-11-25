import { EyeIcon, HeartbeatIcon, WarningIcon } from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Revenue4Health } from './types'

export const revenue4HealthOrder: readonly Revenue4Health[] = [
  'healthy',
  'watch',
  'atRisk',
]

export const revenue4HealthAppearance = {
  atRisk: { icon: WarningIcon, tone: 'danger' },
  healthy: { icon: HeartbeatIcon, tone: 'success' },
  watch: { icon: EyeIcon, tone: 'warning' },
} as const satisfies Record<Revenue4Health, DataOptionAppearance>
