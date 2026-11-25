import {
  CellSignalHighIcon,
  CellSignalLowIcon,
  CellSignalMediumIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import type { DataOptionAppearance } from './types'

export type DataPriority = 'high' | 'low' | 'medium' | 'urgent'

export const dataPriorities: readonly DataPriority[] = [
  'urgent',
  'high',
  'medium',
  'low',
]

export const dataPriorityAppearance = {
  high: { icon: CellSignalHighIcon, tone: 'warning' },
  low: { icon: CellSignalLowIcon, tone: 'neutral' },
  medium: { icon: CellSignalMediumIcon, tone: 'info' },
  urgent: { icon: WarningCircleIcon, tone: 'danger' },
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
