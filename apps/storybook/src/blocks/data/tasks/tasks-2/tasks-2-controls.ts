import type { ArgTypes } from '@storybook/react-vite'
import type {
  Tasks2GroupBy,
  Tasks2Mode,
} from '@tc96/ui/blocks/data/tasks/tasks-2'

export interface Tasks2Controls {
  create: string
  createMenu: boolean
  editable: boolean
  empty: boolean
  groupBy: Tasks2GroupBy | 'none'
  headerActions: boolean
  mode: Tasks2Mode
  openable: boolean
  title: string
}

export const tasks2ControlArgs: Tasks2Controls = {
  create: 'Nova',
  createMenu: true,
  editable: true,
  empty: false,
  groupBy: 'priority',
  headerActions: true,
  mode: 'list',
  openable: true,
  title: 'Todas as tarefas',
}

export const tasks2ControlArgTypes: Partial<ArgTypes<Tasks2Controls>> = {
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  createMenu: {
    control: 'boolean',
    description:
      'Passes `createOptions`; on, Nova opens a menu and reports the option id, off it is a plain button.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes `onDueChange`, `onProjectChange`, `onAssigneesChange`, `onStatusChange` and `onPriorityChange`; off, every field is read-only and the Kanban takes no drop.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no tasks, which renders `labels.empty`.',
  },
  groupBy: {
    control: 'inline-radio',
    description:
      'The initial `groupBy`; Agrupar por in Exibição changes it too. The Kanban reads Prioridade unless it is Status.',
    options: ['none', 'priority', 'status', 'project'],
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onSearchChange` and `onCreate`; on, the search field sits before Exibição and Nova after it.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The active layout; the mode tabs of Exibição change it too and call `onModeChange`.',
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
