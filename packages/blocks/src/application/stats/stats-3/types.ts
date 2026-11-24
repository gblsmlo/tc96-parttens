import type { StatsLoadLabels, StatsLoadProps } from '../shared/types'
export interface Stats3Item {
  id: string
  label: string
  total: number
  value: number
}

export interface Stats3Labels extends StatsLoadLabels {
  ratio: (value: string, total: string) => string
  title: string
}

export interface Stats3Props extends StatsLoadProps {
  className?: string
  items: Stats3Item[]
  labels?: Partial<Stats3Labels>
  locale?: string
  segments?: number
}
