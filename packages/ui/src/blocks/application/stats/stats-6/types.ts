import type { StatsLoadLabels, StatsLoadProps } from '../shared/types'
export type Stats6Period = 'day' | 'week' | 'month' | 'year'

export interface Stats6Sleeve {
  amount: number
  delta: number
  id: string
  name: string
  share: number
}

export interface Stats6Labels extends StatsLoadLabels {
  period: string
  periods: Record<Stats6Period, string>
  share: string
  title: string
}

export interface Stats6Props extends StatsLoadProps {
  className?: string
  currency?: string
  labels?: Partial<Stats6Labels>
  locale?: string
  onPeriodChange?: (period: Stats6Period) => void
  period: Stats6Period
  periods?: Stats6Period[]
  sleeves: Stats6Sleeve[]
}
