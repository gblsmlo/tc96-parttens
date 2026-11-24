import type { ReactNode } from 'react'
import type { ListLoadLabels, ListLoadProps } from '../shared/types'

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

export interface List1Labels extends ListLoadLabels {
  emptyDescription: string
  emptyTitle: string
  title: string
  trend: { down: string; flat: string; up: string }
}

export interface List1Props extends ListLoadProps {
  className?: string
  currency?: string
  labels?: Partial<List1Labels>
  locale?: string
  metrics: List1Metric[]
}
