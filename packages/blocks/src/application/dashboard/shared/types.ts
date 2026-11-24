export type DashboardTone =
  | 'error'
  | 'info'
  | 'outline'
  | 'secondary'
  | 'success'
  | 'warning'

export interface DashboardBadgeData {
  label: string
  tone?: DashboardTone
}

export type DashboardValueFormat = 'currency' | 'number' | 'percent'

export type DashboardTrend = 'negative' | 'neutral' | 'positive'

export interface DashboardKpi {
  delta?: number
  format?: DashboardValueFormat
  id: string
  label: string
  sparkline?: number[]
  trend?: DashboardTrend
  value: number
}

export interface DashboardFormatProps {
  currency?: string
  locale?: string
}
