import { workflowStatusMeta } from '@tc96/ui/property-meta'
import { dataPriorities } from '../../shared/properties/data-priority'
import type {
  Tasks6DefaultSort,
  Tasks6DefaultStatus,
  Tasks6FieldId,
  Tasks6GroupBy,
  Tasks6KanbanGroupBy,
  Tasks6Labels,
  Tasks6Mode,
  Tasks6PriorityFilter,
  Tasks6SortDirection,
  Tasks6StatusOption,
} from './types'

export const tasks6Modes: readonly Tasks6Mode[] = ['list', 'kanban']

export const tasks6Statuses: readonly Tasks6DefaultStatus[] = [
  'todo',
  'in-progress',
  'done',
]

export const tasks6DefaultCompleteStatus: Tasks6DefaultStatus = 'done'

export const createTasks6StatusOptions = (
  labels: Tasks6Labels,
): Tasks6StatusOption[] =>
  tasks6Statuses.map((status) => ({
    id: status,
    label: labels.statuses[status],
    meta: workflowStatusMeta[status],
  }))

export const tasks6PriorityFilters: readonly Tasks6PriorityFilter[] = [
  ...dataPriorities,
  'none',
]

export const tasks6Sorts: readonly Tasks6DefaultSort[] = [
  'due',
  'updated',
  'priority',
  'title',
  'project',
]

export const tasks6DefaultSortDirection = {
  due: 'asc',
  priority: 'desc',
  project: 'asc',
  title: 'asc',
  updated: 'desc',
} as const satisfies Record<Tasks6DefaultSort, Tasks6SortDirection>

export const tasks6GroupBys: readonly Tasks6GroupBy[] = [
  'priority',
  'status',
  'project',
]

export const tasks6KanbanGroupBys: readonly Tasks6KanbanGroupBy[] = [
  'priority',
  'status',
]

export const tasks6Fields: readonly Tasks6FieldId[] = [
  'due',
  'project',
  'assignees',
  'updated',
]

export const tasks6ColumnFields: readonly Tasks6FieldId[] = [
  'start',
  'due',
  'status',
  'priority',
  'type',
  'project',
  'assignees',
  'updated',
]

export const isTasks6FieldId = (value: string): value is Tasks6FieldId =>
  tasks6ColumnFields.some((field) => field === value)

export const tasks6KanbanFields: readonly Tasks6FieldId[] = ['due', 'assignees']

export const tasks6AlwaysVisibleFields: readonly Tasks6FieldId[] = ['due']

export const tasks6NoGroup = 'none'

export const tasks6VisibleTags = 1

export const tasks6LeadingWidth = 'w-5'

export const tasks6FieldWidth = {
  assignees: 'w-40',
  due: 'w-32',
  priority: 'w-32',
  project: 'w-60',
  start: 'w-28',
  status: 'w-36',
  type: 'w-40',
  updated: 'w-20',
} as const satisfies Record<Tasks6FieldId, string>
