import type {
  Tasks2ColumnId,
  Tasks2GroupBy,
  Tasks2KanbanGroupBy,
  Tasks2Mode,
  Tasks2Sort,
  Tasks2SortDirection,
  Tasks2Status,
} from './types'

export const tasks2Modes: readonly Tasks2Mode[] = ['list', 'kanban']

export const tasks2Statuses: readonly Tasks2Status[] = [
  'todo',
  'in-progress',
  'done',
]

export const tasks2Sorts: readonly Tasks2Sort[] = [
  'due',
  'updated',
  'priority',
  'title',
  'project',
]

export const tasks2DefaultSortDirection = {
  due: 'asc',
  priority: 'desc',
  project: 'asc',
  title: 'asc',
  updated: 'desc',
} as const satisfies Record<Tasks2Sort, Tasks2SortDirection>

export const tasks2GroupBys: readonly Tasks2GroupBy[] = [
  'priority',
  'status',
  'project',
]

export const tasks2KanbanGroupBys: readonly Tasks2KanbanGroupBy[] = [
  'priority',
  'status',
]

export const tasks2NoGroup = 'none'

export const tasks2VisibleTags = 1

export const tasks2LeadingWidth = 'w-5'

export const tasks2FieldWidth = {
  assignees: 'w-40',
  creator: 'w-6',
  due: 'w-32',
  project: 'w-40',
  updated: 'w-20',
} as const satisfies Partial<Record<Tasks2ColumnId, string>>
