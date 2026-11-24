import type { StatsLoadLabels, StatsLoadProps } from '../shared/types'

export type Stats7ValueKind = 'currency' | 'number' | 'percent'

export interface Stats7Metric {
  caption?: string
  id: string
  kind?: Stats7ValueKind
  label: string
  points: number[]
  value: number
}

export interface Stats7Labels extends StatsLoadLabels {
  emptyDescription: string
  emptyTitle: string
  title: string
}

export interface Stats7Props extends StatsLoadProps {
  className?: string
  currency?: string
  labels?: Partial<Stats7Labels>
  locale?: string
  metrics: Stats7Metric[]
}
