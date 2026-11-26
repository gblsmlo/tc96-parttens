import { dataPriorities } from '../../shared/properties/data-priority'
import type {
  Tasks4ColumnId,
  Tasks4GroupBy,
  Tasks4KanbanGroupBy,
  Tasks4Mode,
  Tasks4PriorityFilter,
  Tasks4Sort,
  Tasks4SortDirection,
  Tasks4Status,
} from './types'

export const tasks4Modes: readonly Tasks4Mode[] = ['list', 'kanban']

export const tasks4Statuses: readonly Tasks4Status[] = [
  'todo',
  'in-progress',
  'done',
]

export const tasks4PriorityFilters: readonly Tasks4PriorityFilter[] = [
  ...dataPriorities,
  'none',
]

export const tasks4Sorts: readonly Tasks4Sort[] = [
  'due',
  'updated',
  'priority',
  'title',
  'project',
]

export const tasks4DefaultSortDirection = {
  due: 'asc',
  priority: 'desc',
  project: 'asc',
  title: 'asc',
  updated: 'desc',
} as const satisfies Record<Tasks4Sort, Tasks4SortDirection>

export const tasks4GroupBys: readonly Tasks4GroupBy[] = [
  'priority',
  'status',
  'project',
]

export const tasks4KanbanGroupBys: readonly Tasks4KanbanGroupBy[] = [
  'priority',
  'status',
]

export const tasks4NoGroup = 'none'

export const tasks4VisibleTags = 1

export const tasks4LeadingWidth = 'w-5'

export const tasks4FieldWidth = {
  assignees: 'w-40',
  due: 'w-32',
  project: 'w-40',
  updated: 'w-20',
} as const satisfies Partial<Record<Tasks4ColumnId, string>>
