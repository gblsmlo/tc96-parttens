import type {
  TasksBaseProps,
  TasksLabels,
  TasksLabelsOverride,
  TasksSavedViewProps,
} from '../shared'

export interface Tasks6Labels extends TasksLabels {
  savePreference: string
}

export type Tasks6LabelsOverride = TasksLabelsOverride<Tasks6Labels>

export type Tasks6Props = TasksBaseProps<Tasks6Labels> & TasksSavedViewProps
