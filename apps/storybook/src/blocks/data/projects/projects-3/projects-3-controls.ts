import type { ArgTypes } from '@storybook/react-vite'
import type {
  Projects3GroupBy,
  Projects3Mode,
} from '@tc96/ui/blocks/data/projects/projects-3'

export interface Projects3Controls {
  bulkActions: boolean
  create: string
  editable: boolean
  empty: boolean
  groupBy: Projects3GroupBy | 'none'
  headerActions: boolean
  mode: Projects3Mode
  openable: boolean
  paginated: boolean
  savedViews: boolean
  title: string
}

export const projects3ControlArgs: Projects3Controls = {
  bulkActions: true,
  create: 'Nova tarefa',
  editable: true,
  empty: false,
  groupBy: 'none',
  headerActions: true,
  mode: 'table',
  openable: true,
  paginated: true,
  savedViews: false,
  title: 'Tarefas',
}

export const projects3ControlArgTypes: Partial<ArgTypes<Projects3Controls>> = {
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onSelectedIdsChange` and the five bulk callbacks; off, the table has no select column and no action bar.',
  },
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  editable: {
    control: 'boolean',
    description:
      'Passes the seven cell callbacks (`onTypeChange`, `onPriorityChange`, `onStatusChange`, `onStartChange`, `onDueChange`, `onAssigneeChange`, `onTagsChange`); off, every cell is read-only and the Kanban takes no drop.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no tasks, which renders `labels.empty`.',
  },
  groupBy: {
    control: 'inline-radio',
    description:
      'The initial `groupBy`; Agrupar por in Exibição changes it too and calls `onGroupByChange`. The Kanban reads Status unless it is Prioridade.',
    options: ['none', 'status', 'priority', 'assignee'],
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onSearchChange` and `onCreate`; on, the search field sits before Exibição and Nova tarefa after it.',
  },
  mode: {
    control: 'inline-radio',
    description:
      'The active layout; the mode tabs of Exibição change it too and call `onModeChange`.',
    options: ['table', 'kanban'],
  },
  openable: {
    control: 'boolean',
    description: 'Passes `onOpen`; on, a row and a Kanban card open the task.',
  },
  paginated: {
    control: 'boolean',
    description:
      'Passes `page`, `pageCount`, `pageSize` and `total`; off, the footer is not rendered.',
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `savedViews` and their callbacks; on, the view switcher replaces the heading and Exibição offers Salvar preferência.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the heading, the name of the section and of the table.',
  },
}
