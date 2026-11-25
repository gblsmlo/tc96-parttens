import { EyeIcon, HeartbeatIcon, WarningIcon } from '@phosphor-icons/react'
import type { DataOptionAppearance } from '../../shared/properties/types'
import type { Revenue3Health } from './types'

export const revenue3HealthOrder: readonly Revenue3Health[] = [
  'healthy',
  'watch',
  'atRisk',
]

export const revenue3HealthAppearance = {
  atRisk: { icon: WarningIcon, tone: 'danger' },
  healthy: { icon: HeartbeatIcon, tone: 'success' },
  watch: { icon: EyeIcon, tone: 'warning' },
} as const satisfies Record<Revenue3Health, DataOptionAppearance>
