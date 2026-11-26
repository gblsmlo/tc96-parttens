import type { ArgTypes } from '@storybook/react-vite'
import type {
  Tasks4GroupBy,
  Tasks4Mode,
} from '@tc96/ui/blocks/data/tasks/tasks-4'

export interface Tasks4Controls {
  create: string
  editable: boolean
  empty: boolean
  filters: boolean
  groupBy: Tasks4GroupBy | 'none'
  headerActions: boolean
  mode: Tasks4Mode
  openable: boolean
  title: string
}

export const tasks4ControlArgs: Tasks4Controls = {
  create: 'Nova tarefa',
  editable: true,
  empty: false,
  filters: true,
  groupBy: 'priority',
  headerActions: true,
  mode: 'list',
  openable: true,
  title: 'Todas as tarefas',
}

export const tasks4ControlArgTypes: Partial<ArgTypes<Tasks4Controls>> = {
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
      'Passes `onStatusFilterChange`, `onPriorityFilterChange` and `onAssigneeFilterChange`; on, the filter menu opens the right slot with one submenu per property and a count badge.',
  },
  groupBy: {
    control: 'inline-radio',
    description:
      'The initial `groupBy`; the group menu changes it too. The Kanban reads Prioridade unless it is Status.',
    options: ['none', 'priority', 'status', 'project'],
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
