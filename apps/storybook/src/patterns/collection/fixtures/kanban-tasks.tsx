import { type KanbanColumnData, projectCollection } from '@tc96/ui/patterns'
import { createCollection, type Task, type TaskStatus } from './tasks'

const STATUS_COLOR: Record<TaskStatus, string> = {
  backlog: 'var(--color-gray-500)',
  done: 'var(--color-green-500)',
  'in-progress': 'var(--color-blue-500)',
  review: 'var(--color-amber-500)',
  todo: 'var(--color-slate-400)',
}

export const projectTaskColumns = (
  tasks: readonly Task[],
): KanbanColumnData<Task>[] =>
  projectCollection(createCollection(tasks), 'status').map((group) => ({
    cards: [...group.records],
    color: STATUS_COLOR[group.value as TaskStatus],
    count: group.count,
    id: group.value ?? group.id,
    title: group.label,
  }))
