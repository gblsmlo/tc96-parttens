import type { Icon } from '@phosphor-icons/react'

export interface RecordGroup2Trigger {
  icon: Icon
  id: string
  label: string
}

export interface RecordGroup2Labels {
  title: string
}

export type RecordGroup2LabelsOverride = Partial<RecordGroup2Labels>

export interface RecordGroup2Props {
  className?: string
  labels?: RecordGroup2LabelsOverride
  onRun: (id: string) => void
  runningId?: string | null
  triggers: readonly RecordGroup2Trigger[]
}
