import { dueOf } from './task-fields'
import {
  NOW,
  peopleById,
  priorityOptions,
  statusOptions,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from './tasks'

const DAY = 24 * 60 * 60 * 1000

export type TaskSortField =
  | 'assignee'
  | 'due'
  | 'estimate'
  | 'priority'
  | 'status'
  | 'title'

export interface TaskSort {
  desc: boolean
  field: TaskSortField
}

const indexOf = <TValue>(
  options: readonly { value: TValue }[],
  value: TValue,
) => options.findIndex((option) => option.value === value)

const assigneeName = (task: Task) =>
  peopleById.get(task.assigneeId)?.name ?? task.assigneeId

export const taskSortFields: readonly {
  compare: (a: Task, b: Task) => number
  label: string
  value: TaskSortField
}[] = [
  {
    compare: (a, b) => a.title.localeCompare(b.title, 'pt-BR'),
    label: 'Tarefa',
    value: 'title',
  },
  {
    compare: (a, b) =>
      indexOf(statusOptions, a.status) - indexOf(statusOptions, b.status),
    label: 'Status',
    value: 'status',
  },
  {
    compare: (a, b) =>
      indexOf(priorityOptions, a.priority) -
      indexOf(priorityOptions, b.priority),
    label: 'Prioridade',
    value: 'priority',
  },
  {
    compare: (a, b) => Date.parse(dueOf(a)) - Date.parse(dueOf(b)),
    label: 'Prazo',
    value: 'due',
  },
  {
    compare: (a, b) => a.estimate - b.estimate,
    label: 'Estimativa',
    value: 'estimate',
  },
  {
    compare: (a, b) => assigneeName(a).localeCompare(assigneeName(b), 'pt-BR'),
    label: 'Responsável',
    value: 'assignee',
  },
]

export const isTaskSortField = (value: string): value is TaskSortField =>
  taskSortFields.some((field) => field.value === value)

export type TaskDueFilter = 'next-7-days' | 'next-30-days' | 'overdue'

const daysFromNow = (task: Task) =>
  (Date.parse(dueOf(task)) - NOW.getTime()) / DAY

export const taskDueFilters: readonly {
  label: string
  matches: (task: Task) => boolean
  value: TaskDueFilter
}[] = [
  {
    label: 'Atrasadas',
    matches: (task) => daysFromNow(task) < 0 && task.status !== 'done',
    value: 'overdue',
  },
  {
    label: 'Próximos 7 dias',
    matches: (task) => daysFromNow(task) >= 0 && daysFromNow(task) < 7,
    value: 'next-7-days',
  },
  {
    label: 'Próximos 30 dias',
    matches: (task) => daysFromNow(task) >= 0 && daysFromNow(task) < 30,
    value: 'next-30-days',
  },
]

export const isTaskDueFilter = (value: string): value is TaskDueFilter =>
  taskDueFilters.some((filter) => filter.value === value)

export type TaskEstimateRange = 'large' | 'medium' | 'small'

export const taskEstimateRanges: readonly {
  label: string
  matches: (task: Task) => boolean
  value: TaskEstimateRange
}[] = [
  { label: 'Até 4 h', matches: (task) => task.estimate <= 4, value: 'small' },
  {
    label: '5 a 8 h',
    matches: (task) => task.estimate > 4 && task.estimate <= 8,
    value: 'medium',
  },
  {
    label: 'Mais de 8 h',
    matches: (task) => task.estimate > 8,
    value: 'large',
  },
]

export interface TaskQuery {
  assigneeIds: readonly string[]
  due: TaskDueFilter | null
  estimates: readonly TaskEstimateRange[]
  priorities: readonly TaskPriority[]
  sort: TaskSort | null
  statuses: readonly TaskStatus[]
}

export const emptyTaskQuery: TaskQuery = {
  assigneeIds: [],
  due: null,
  estimates: [],
  priorities: [],
  sort: null,
  statuses: [],
}

export const countTaskQuery = (query: TaskQuery) =>
  query.assigneeIds.length +
  query.priorities.length +
  query.statuses.length +
  query.estimates.length +
  (query.due ? 1 : 0) +
  (query.sort ? 1 : 0)

export const sameTaskQuery = (a: TaskQuery, b: TaskQuery) =>
  JSON.stringify({ ...emptyTaskQuery, ...a }) ===
  JSON.stringify({ ...emptyTaskQuery, ...b })

const matchesAny = <TValue>(selected: readonly TValue[], value: TValue) =>
  selected.length === 0 || selected.includes(value)

export const matchesTaskQuery = (task: Task, query: TaskQuery) =>
  matchesAny(query.assigneeIds, task.assigneeId) &&
  matchesAny(query.priorities, task.priority) &&
  matchesAny(query.statuses, task.status) &&
  (query.estimates.length === 0 ||
    taskEstimateRanges.some(
      (range) => query.estimates.includes(range.value) && range.matches(task),
    )) &&
  (query.due === null ||
    taskDueFilters.some(
      (filter) => filter.value === query.due && filter.matches(task),
    ))

export const sortTasks = (tasks: readonly Task[], sort: TaskSort | null) => {
  const field = taskSortFields.find(({ value }) => value === sort?.field)
  if (!(sort && field)) return [...tasks]
  const direction = sort.desc ? -1 : 1
  return [...tasks].sort((a, b) => direction * field.compare(a, b))
}
