import type { ArgTypes } from '@storybook/react-vite'
import { tasksModes } from '@tc96/ui/blocks/data/tasks/tasks-6'
import {
  type TasksStoryControls,
  tasksControlArgs,
  tasksControlArgTypes,
} from '../tasks-story.ts'

export interface Tasks6Controls extends TasksStoryControls {
  create: string
  headerActions: boolean
  title: string
}

export const tasks6ControlArgs: Tasks6Controls = {
  ...tasksControlArgs('list', tasksModes),
  create: 'Nova tarefa',
  groupBy: 'priority',
  headerActions: true,
  title: 'Todas as tarefas',
}

export const tasks6ControlArgTypes: Partial<ArgTypes<Tasks6Controls>> = {
  ...tasksControlArgTypes(tasksModes),
  create: {
    control: 'text',
    description:
      'Text of `labels.create`, the primary action, last in the toolbar.',
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onCreate`; on, the primary action closes the toolbar.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the heading, the name of the section and of the collection.',
  },
}
