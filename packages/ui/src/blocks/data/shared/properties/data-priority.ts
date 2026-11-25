import { priorityMeta } from '@tc96/ui/property-meta'
import type { DataOptionAppearance } from './types'

export type DataPriority = 'high' | 'low' | 'medium' | 'urgent'

export const dataPriorities: readonly DataPriority[] = [
  'urgent',
  'high',
  'medium',
  'low',
]

export const dataPriorityAppearance = {
  high: priorityMeta.high,
  low: priorityMeta.low,
  medium: priorityMeta.medium,
  urgent: priorityMeta.urgent,
} as const satisfies Record<DataPriority, DataOptionAppearance>

export const dataPriorityRank = {
  high: 2,
  low: 0,
  medium: 1,
  urgent: 3,
} as const satisfies Record<DataPriority, number>

export const defaultDataPriorityLabels = {
  high: 'Alta',
  low: 'Baixa',
  medium: 'Média',
  urgent: 'Urgente',
} as const satisfies Record<DataPriority, string>
