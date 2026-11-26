import { dataPriorities } from '../../shared/properties/data-priority'
import type {
  Tasks3ColumnId,
  Tasks3GroupBy,
  Tasks3KanbanGroupBy,
  Tasks3Mode,
  Tasks3PriorityFilter,
  Tasks3Sort,
  Tasks3SortDirection,
  Tasks3Status,
} from './types'

export const tasks3Modes: readonly Tasks3Mode[] = ['list', 'kanban']

export const tasks3Statuses: readonly Tasks3Status[] = [
  'todo',
  'in-progress',
  'done',
]

export const tasks3PriorityFilters: readonly Tasks3PriorityFilter[] = [
  ...dataPriorities,
  'none',
]

export const tasks3Sorts: readonly Tasks3Sort[] = [
  'due',
  'updated',
  'priority',
  'title',
  'project',
]

export const tasks3DefaultSortDirection = {
  due: 'asc',
  priority: 'desc',
  project: 'asc',
  title: 'asc',
  updated: 'desc',
} as const satisfies Record<Tasks3Sort, Tasks3SortDirection>

export const tasks3GroupBys: readonly Tasks3GroupBy[] = [
  'priority',
  'status',
  'project',
]

export const tasks3KanbanGroupBys: readonly Tasks3KanbanGroupBy[] = [
  'priority',
  'status',
]

export const tasks3NoGroup = 'none'

export const tasks3VisibleTags = 1

export const tasks3LeadingWidth = 'w-5'

export const tasks3FieldWidth = {
  assignees: 'w-40',
  due: 'w-32',
  project: 'w-40',
  updated: 'w-20',
} as const satisfies Partial<Record<Tasks3ColumnId, string>>
