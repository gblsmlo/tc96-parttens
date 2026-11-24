import type { StatsLoadLabels, StatsLoadProps } from '../shared/types'
export type Stats5Format = 'currency' | 'number' | 'percent'

export interface Stats5Item {
  format?: Stats5Format
  id: string
  label: string
  lowerIsBetter?: boolean
  trend: number
  value: number
}

export interface Stats5Labels extends StatsLoadLabels {
  down: string
  flat: string
  title: string
  up: string
}

export interface Stats5Props extends StatsLoadProps {
  className?: string
  currency?: string
  items: Stats5Item[]
  labels?: Partial<Stats5Labels>
  locale?: string
}
