import type { StatsLoadLabels, StatsLoadProps } from '../shared/types'
export type Stats4Range = '7d' | '30d' | '90d'

export interface Stats4Source {
  colorClassName: string
  id: string
  name: string
  value: number
}

export interface Stats4Labels extends StatsLoadLabels {
  goal: (goal: string) => string
  goalProgress: (total: string, goal: string, percent: string) => string
  range: string
  ranges: Record<Stats4Range, string>
  sources: string
  sourcesBar: string
  title: string
  total: (range: string) => string
}

export interface Stats4Props extends StatsLoadProps {
  className?: string
  goal: number
  labels?: Partial<Stats4Labels>
  locale?: string
  onRangeChange?: (range: Stats4Range) => void
  range: Stats4Range
  ranges?: Stats4Range[]
  sources: Stats4Source[]
  total: number
}
