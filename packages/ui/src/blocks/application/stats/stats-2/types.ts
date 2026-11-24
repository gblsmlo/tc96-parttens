import type { StatsLoadLabels, StatsLoadProps } from '../shared/types'
export interface Stats2Labels extends StatsLoadLabels {
  billed: string
  quota: string
  renewsOn: (date: string) => string
  title: string
  upgrade: string
  usage: (used: string, limit: string) => string
}

export interface Stats2Props extends StatsLoadProps {
  className?: string
  cost: number
  currency?: string
  labels?: Partial<Stats2Labels>
  limit: number
  locale?: string
  onUpgrade?: () => void
  renewsAt: Date
  timeZone?: string
  used: number
}
