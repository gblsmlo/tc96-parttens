import type { ArgTypes } from '@storybook/react-vite'
import type {
  Tasks6KanbanGroupBy,
  Tasks6Mode,
} from '@tc96/ui/blocks/data/tasks/tasks-6'

export interface Tasks6Controls {
  create: string
  editable: boolean
  empty: boolean
  filters: boolean
  kanbanGroupBy: Tasks6KanbanGroupBy
  headerActions: boolean
  mode: Tasks6Mode
  openable: boolean
  title: string
}

export const tasks6ControlArgs: Tasks6Controls = {
  create: 'Nova tarefa',
  editable: true,
  empty: false,
  filters: true,
  kanbanGroupBy: 'status',
  headerActions: true,
  mode: 'list',
  openable: true,
  title: 'Todas as tarefas',
}

export const tasks6ControlArgTypes: Partial<ArgTypes<Tasks6Controls>> = {
  create: {
    control: 'text',
    description:
      'Text of `labels.create`, the primary `Action`, last in the toolbar.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes `onDueChange`, `onProjectChange`, `onAssigneesChange`, `onStatusChange`, `onPriorityChange` and the bulk callbacks; off, every field is read-only, the Kanban takes no drop and nothing can be selected.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no tasks, which renders `labels.empty`.',
  },
  filters: {
    control: 'boolean',
    description:
      'Passes `onStatusFilterChange`, `onPriorityFilterChange` and `onAssigneeFilterChange`; on, the Exibição menu lists one submenu per property under Propriedades and its trigger counts the active filters.',
  },
  kanbanGroupBy: {
    control: 'inline-radio',
    description:
      'The initial `kanbanGroupBy`; the Exibição menu changes it in the Quadro. The list is never grouped.',
    options: ['status', 'priority'],
  },
  headerActions: {
    control: 'boolean',
    description: 'Passes `onCreate`; on, the `Action` closes the toolbar.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The initial layout; the layout menu changes it too and calls `onModeChange`.',
    options: ['list', 'kanban'],
  },
  openable: {
    control: 'boolean',
    description: 'Passes `onOpen`; on, a row and a Kanban card open the task.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the heading, the name of the section and of the list.',
  },
}
