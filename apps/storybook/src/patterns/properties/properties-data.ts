import type { PersonPropertyOption, PropertyOption } from '@tc96/ui/patterns'
import {
  type PriorityLevel,
  priorityMeta,
  type WorkflowStatus,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'

export const statusOptions: readonly PropertyOption<WorkflowStatus>[] = (
  [
    ['todo', 'To do'],
    ['in-progress', 'In progress'],
    ['done', 'Done'],
    ['canceled', 'Canceled'],
  ] as const
).map(([value, label]) => ({ ...workflowStatusMeta[value], label, value }))

export const priorityOptions: readonly PropertyOption<PriorityLevel>[] = (
  [
    ['high', 'High'],
    ['medium', 'Medium'],
    ['low', 'Low'],
  ] as const
).map(([value, label]) => ({ ...priorityMeta[value], label, value }))

export const people: readonly PersonPropertyOption[] = [
  { label: 'Bruno Lima', value: 'person-1' },
  { label: 'Ana Souza', value: 'person-2' },
]

export const tagOptions: readonly PropertyOption[] = [
  { label: 'Documents', value: 'documents' },
  { label: 'Follow-up', value: 'return' },
]

export const taskItemIds = [
  'status',
  'priority',
  'assignee',
  'dueDate',
  'tags',
] as const

export type TaskItemId = (typeof taskItemIds)[number]
