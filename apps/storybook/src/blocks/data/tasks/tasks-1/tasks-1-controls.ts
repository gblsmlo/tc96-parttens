import type { ArgTypes } from '@storybook/react-vite'
import type { Tasks1GroupBy } from '@tc96/ui/blocks/data/tasks/tasks-1'

export interface Tasks1Controls {
  bulkActions: boolean
  create: string
  editable: boolean
  empty: boolean
  groupBy: Tasks1GroupBy | 'none'
  headerActions: boolean
  openable: boolean
  paginated: boolean
  title: string
}

export const tasks1ControlArgs: Tasks1Controls = {
  bulkActions: true,
  create: 'Nova tarefa',
  editable: true,
  empty: false,
  groupBy: 'none',
  headerActions: true,
  openable: true,
  paginated: true,
  title: 'Tarefas',
}

export const tasks1ControlArgTypes: Partial<ArgTypes<Tasks1Controls>> = {
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onSelectedIdsChange` and the four bulk callbacks; off, the table has no select column and no action bar.',
  },
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes the six cell callbacks (`onStatusChange`, `onTagsChange`, `onDueChange`, `onProjectChange`, `onAssigneesChange`, `onPriorityChange`); off, every cell is read-only and the status icon is an image.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no tasks, which renders `labels.empty`.',
  },
  groupBy: {
    control: 'inline-radio',
    description:
      'The initial `groupBy`; Agrupar por in Exibição changes it too and calls `onGroupByChange`.',
    options: ['none', 'status', 'priority'],
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onSearchChange` and `onCreate`; on, the search field sits before Exibição and Nova tarefa after it.',
  },
  openable: {
    control: 'boolean',
    description: 'Passes `onOpen`; on, a row opens the task.',
  },
  paginated: {
    control: 'boolean',
    description:
      'Passes `page`, `pageCount`, `pageSize` and `total`; off, the footer is not rendered.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the heading, the name of the section and of the table.',
  },
}
