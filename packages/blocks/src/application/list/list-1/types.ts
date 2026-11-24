import type { ReactNode } from 'react'

export type List1MetricKind = 'currency' | 'number' | 'percent'

export interface List1Metric {
  change?: number
  description?: string
  icon?: ReactNode
  id: string
  kind?: List1MetricKind
  name: string
  value: number
}

export interface List1Labels {
  emptyDescription: string
  emptyTitle: string
  title: string
  trend: { down: string; flat: string; up: string }
}

export interface List1Props {
  className?: string
  currency?: string
  labels?: Partial<List1Labels>
  locale?: string
  metrics: List1Metric[]
}
