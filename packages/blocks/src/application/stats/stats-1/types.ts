import type { TrendIndicatorLabels } from '@tc96/parttens/widgets/shared/trend-indicator'

export type Stats1ValueKind = 'currency' | 'number' | 'percent'

export interface Stats1Stat {
  change?: number
  id: string
  kind?: Stats1ValueKind
  label: string
  value: number
}

export type Stats1Action = 'details' | 'export'

export interface Stats1Labels {
  actions: (label: string) => string
  details: string
  emptyDescription: string
  emptyTitle: string
  export: string
  title: string
  trend: TrendIndicatorLabels
}

export interface Stats1Props {
  className?: string
  currency?: string
  labels?: Partial<Stats1Labels>
  locale?: string
  onStatAction?: (statId: string, action: Stats1Action) => void
  stats: Stats1Stat[]
}
