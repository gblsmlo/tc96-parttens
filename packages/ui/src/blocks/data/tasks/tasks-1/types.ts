import type { CollectionPaginationButtonLabels } from '@tc96/ui/patterns/collection-pagination/components/collection-pagination'
import type {
  TasksBaseProps,
  TasksLabels,
  TasksLabelsOverride,
  TasksPaginationProps,
  TasksSavedViewProps,
  TasksSearchProps,
} from '../shared'

export interface Tasks1Labels extends TasksLabels {
  pageRange: (first: number, last: number, total: number) => string
  pagination: string
  paginationButtons: CollectionPaginationButtonLabels
  savePreference: string
  search: string
}

export type Tasks1LabelsOverride = TasksLabelsOverride<Tasks1Labels>

export type Tasks1Props = TasksBaseProps<Tasks1Labels> &
  TasksSearchProps &
  TasksPaginationProps &
  Pick<TasksSavedViewProps, 'onSavePreference'>
