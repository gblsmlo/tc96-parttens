import type {
  TasksBaseProps,
  TasksLabels,
  TasksLabelsOverride,
  TasksSavedViewProps,
} from '../shared'

export interface Tasks4Labels extends TasksLabels {
  savePreference: string
}

export type Tasks4LabelsOverride = TasksLabelsOverride<Tasks4Labels>

export type Tasks4Props = TasksBaseProps<Tasks4Labels> & TasksSavedViewProps
