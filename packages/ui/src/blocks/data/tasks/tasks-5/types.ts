import type {
  TasksBaseProps,
  TasksLabels,
  TasksLabelsOverride,
  TasksSavedViewProps,
} from '../shared'

export interface Tasks5Labels extends TasksLabels {
  savePreference: string
}

export type Tasks5LabelsOverride = TasksLabelsOverride<Tasks5Labels>

export type Tasks5Props = TasksBaseProps<Tasks5Labels> & TasksSavedViewProps
