import { workflowStatusMeta } from '@tc96/ui/property-meta'
import { dataPriorities } from '../../shared/properties/data-priority'
import type {
  Tasks6ColumnId,
  Tasks6DefaultSort,
  Tasks6DefaultStatus,
  Tasks6KanbanGroupBy,
  Tasks6Labels,
  Tasks6Mode,
  Tasks6PriorityFilter,
  Tasks6SortDirection,
  Tasks6SortOption,
  Tasks6StatusOption,
} from './types'

export const tasks6Modes: readonly Tasks6Mode[] = ['list', 'kanban']

export const tasks6Statuses: readonly Tasks6DefaultStatus[] = [
  'todo',
  'in-progress',
  'done',
]

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

export const createTasks6SortOptions = (
  labels: Tasks6Labels,
): Tasks6SortOption[] =>
  tasks6Sorts.map((sort) => ({
    direction: tasks6DefaultSortDirection[sort],
    id: sort,
    label: labels.sorts[sort],
  }))

export const tasks6KanbanGroupBys: readonly Tasks6KanbanGroupBy[] = [
  'status',
  'priority',
]

export const tasks6NoGroup = 'none'

export const tasks6All = 'all'

export const tasks6VisibleTags = 1

export const tasks6LeadingWidth = 'w-5'

export const tasks6FieldWidth = {
  assignees: 'w-40',
  due: 'w-32',
  tags: 'w-48',
  project: 'w-40',
  updated: 'w-20',
} as const satisfies Partial<Record<Tasks6ColumnId, string>>
