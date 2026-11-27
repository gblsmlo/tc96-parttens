import { dataPriorities } from '../../shared/properties/data-priority'
import type {
  TasksColumnId,
  TasksFilterId,
  TasksGroupBy,
  TasksKanbanGroupBy,
  TasksMode,
  TasksPriorityFilter,
  TasksSort,
  TasksSortDirection,
  TasksStatus,
} from './types'

export const tasksModes: readonly TasksMode[] = ['list', 'kanban', 'datatable']

export const tasksStatuses: readonly TasksStatus[] = [
  'todo',
  'in-progress',
  'done',
]

export const tasksPriorityFilters: readonly TasksPriorityFilter[] = [
  ...dataPriorities,
  'none',
]

export const tasksSorts: readonly TasksSort[] = [
  'due',
  'updated',
  'priority',
  'title',
  'kind',
]

export const tasksDefaultSortDirection = {
  due: 'asc',
  priority: 'desc',
  kind: 'asc',
  title: 'asc',
  updated: 'desc',
} as const satisfies Record<TasksSort, TasksSortDirection>

export const tasksGroupBys: readonly TasksGroupBy[] = [
  'priority',
  'status',
  'kind',
]

export const tasksKanbanGroupBys: readonly TasksKanbanGroupBy[] = [
  'priority',
  'status',
]

export const tasksFilterIds: readonly TasksFilterId[] = [
  'status',
  'priority',
  'assignee',
  'kind',
]

export const tasksColumnIds: readonly TasksColumnId[] = [
  'title',
  'status',
  'priority',
  'tags',
  'due',
  'kind',
  'assignees',
  'creator',
  'updated',
]

export const tasksNoGroup = 'none'
