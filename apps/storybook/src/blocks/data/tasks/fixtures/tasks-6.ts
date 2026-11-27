import type {
  Tasks6SortOption,
  Tasks6StatusOption,
  Tasks6Task,
} from '@tc96/ui/blocks/data/tasks/tasks-6'
import { workflowStatusMeta } from '@tc96/ui/property-meta'
import { tasks as tasks4 } from './tasks-4.ts'

export {
  now,
  people,
  projects,
  savedViews,
  tags,
} from './tasks-4.ts'

export const statuses: Tasks6StatusOption[] = [
  { id: 'todo', label: 'A fazer', meta: workflowStatusMeta.todo },
  {
    id: 'in-progress',
    label: 'Em andamento',
    meta: workflowStatusMeta['in-progress'],
  },
  { id: 'done', label: 'Concluída', meta: workflowStatusMeta.done },
  { id: 'canceled', label: 'Cancelada', meta: workflowStatusMeta.canceled },
]

export const sortOptions: Tasks6SortOption[] = [
  { direction: 'asc', id: 'due', label: 'Prazo' },
  { direction: 'desc', id: 'newest', label: 'Mais recentes' },
  { direction: 'desc', id: 'priority', label: 'Prioridade' },
]

export const tasks: Tasks6Task[] = tasks4.map((task, index) => ({
  ...task,
  status: index === tasks4.length - 1 ? 'canceled' : task.status,
}))
