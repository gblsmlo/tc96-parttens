import { dataPriorities } from '../../shared/properties/data-priority'
import type {
  Tasks5ColumnId,
  Tasks5GroupBy,
  Tasks5KanbanGroupBy,
  Tasks5Mode,
  Tasks5PriorityFilter,
  Tasks5Sort,
  Tasks5SortDirection,
  Tasks5Status,
} from './types'

export const tasks5Modes: readonly Tasks5Mode[] = ['list', 'kanban']

export const tasks5Statuses: readonly Tasks5Status[] = [
  'todo',
  'in-progress',
  'done',
]

export const tasks5PriorityFilters: readonly Tasks5PriorityFilter[] = [
  ...dataPriorities,
  'none',
]

export const tasks5Sorts: readonly Tasks5Sort[] = [
  'due',
  'updated',
  'priority',
  'title',
  'project',
]

export const tasks5DefaultSortDirection = {
  due: 'asc',
  priority: 'desc',
  project: 'asc',
  title: 'asc',
  updated: 'desc',
} as const satisfies Record<Tasks5Sort, Tasks5SortDirection>

export const tasks5GroupBys: readonly Tasks5GroupBy[] = [
  'priority',
  'status',
  'project',
]

export const tasks5KanbanGroupBys: readonly Tasks5KanbanGroupBy[] = [
  'priority',
  'status',
]

export const tasks5NoGroup = 'none'

export const tasks5VisibleTags = 1

export const tasks5LeadingWidth = 'w-5'

export const tasks5FieldWidth = {
  assignees: 'w-40',
  due: 'w-32',
  tags: 'w-48',
  project: 'w-40',
  updated: 'w-20',
} as const satisfies Partial<Record<Tasks5ColumnId, string>>
