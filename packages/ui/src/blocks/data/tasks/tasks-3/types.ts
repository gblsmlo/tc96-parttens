import type {
  TasksBaseProps,
  TasksLabels,
  TasksLabelsOverride,
} from '../shared'

export interface Tasks3Labels extends TasksLabels {
  description: string
}

export type Tasks3LabelsOverride = TasksLabelsOverride<Tasks3Labels>

export type Tasks3Props = TasksBaseProps<Tasks3Labels>
