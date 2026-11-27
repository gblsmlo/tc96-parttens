import type { ArgTypes } from '@storybook/react-vite'
import { tasksModes } from '@tc96/ui/blocks/data/tasks/tasks-1'
import {
  type TasksStoryControls,
  tasksControlArgs,
  tasksControlArgTypes,
} from '../tasks-story.ts'

export interface Tasks1Controls extends TasksStoryControls {
  bulkActions: boolean
  create: string
  headerActions: boolean
  paginated: boolean
  title: string
}

export const tasks1ControlArgs: Tasks1Controls = {
  ...tasksControlArgs('datatable', tasksModes),
  bulkActions: true,
  create: 'Nova tarefa',
  groupBy: 'none',
  headerActions: true,
  paginated: true,
  title: 'Tarefas',
}

export const tasks1ControlArgTypes: Partial<ArgTypes<Tasks1Controls>> = {
  ...tasksControlArgTypes(tasksModes),
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `selectedIds`, `onSelectedIdsChange` and the bulk callbacks; off, the table has no select column and no action bar.',
  },
  create: {
    control: 'text',
    description: 'Text of `labels.create`, the primary toolbar action.',
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onSearchChange` and `onCreate`; on, the search field sits before Visualização and Nova tarefa after it.',
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
