import type {
  Tasks6Option,
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
  { id: 'due', label: 'Prazo' },
  { id: 'newest', label: 'Mais recentes' },
  { id: 'priority', label: 'Prioridade' },
]

export const types: Tasks6Option[] = [
  { id: 'call', label: 'Ligação' },
  { id: 'meeting', label: 'Reunião' },
  { id: 'review', label: 'Revisão' },
]

const typeIds = ['review', 'call', 'meeting', null] as const

export const tasks: Tasks6Task[] = tasks4.map((task, index) => ({
  ...task,
  status: index === tasks4.length - 1 ? 'canceled' : task.status,
  typeId: typeIds[index % typeIds.length] ?? null,
}))
