import type { Icon } from '@phosphor-icons/react'

export interface RecordGroup9Metric {
  icon?: Icon
  id: string
  label: string
  progress?: { max: number; value: number }
  target?: string
  value: number | string
}

export interface RecordGroup9Labels {
  title: string
}

export type RecordGroup9LabelsOverride = Partial<RecordGroup9Labels>

export interface RecordGroup9Props {
  className?: string
  labels?: RecordGroup9LabelsOverride
  metrics: readonly RecordGroup9Metric[]
}
