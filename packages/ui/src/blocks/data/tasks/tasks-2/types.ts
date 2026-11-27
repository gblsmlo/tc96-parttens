import type { ReactNode } from 'react'
import type {
  TasksBaseProps,
  TasksLabels,
  TasksLabelsOverride,
  TasksOption,
  TasksSearchProps,
} from '../shared'

export interface Tasks2CreateOption extends TasksOption {
  icon?: ReactNode
}

export interface Tasks2Labels extends TasksLabels {
  search: string
}

export type Tasks2LabelsOverride = TasksLabelsOverride<Tasks2Labels>

export interface Tasks2Props
  extends TasksBaseProps<Tasks2Labels>,
    TasksSearchProps {
  createOptions?: Tasks2CreateOption[]
  onCreate?: (optionId?: string) => void
}
