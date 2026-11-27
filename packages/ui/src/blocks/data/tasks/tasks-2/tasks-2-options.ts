import type { TasksColumnId } from '../shared'

export const tasks2LeadingWidth = 'w-5'

export const tasks2FieldWidth = {
  assignees: 'w-40',
  due: 'w-32',
  kind: 'w-40',
  updated: 'w-20',
} as const satisfies Partial<Record<TasksColumnId, string>>

export const tasks2ToggleableColumns: readonly TasksColumnId[] = [
  'tags',
  'due',
  'kind',
  'assignees',
  'updated',
]
