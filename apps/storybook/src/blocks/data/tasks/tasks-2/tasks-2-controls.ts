import type { ArgTypes } from '@storybook/react-vite'
import { tasksModes } from '@tc96/ui/blocks/data/tasks/tasks-2'
import {
  type TasksStoryControls,
  tasksControlArgs,
  tasksControlArgTypes,
} from '../tasks-story.ts'

export interface Tasks2Controls extends TasksStoryControls {
  create: string
  createMenu: boolean
  headerActions: boolean
  title: string
}

export const tasks2ControlArgs: Tasks2Controls = {
  ...tasksControlArgs('list', tasksModes),
  create: 'Nova',
  createMenu: true,
  groupBy: 'priority',
  headerActions: true,
  title: 'Todas as tarefas',
}

export const tasks2ControlArgTypes: Partial<ArgTypes<Tasks2Controls>> = {
  ...tasksControlArgTypes(tasksModes),
  create: {
    control: 'text',
    description:
      'Text of `labels.create`, the primary action, last in the toolbar.',
  },
  createMenu: {
    control: 'boolean',
    description:
      'Passes `createOptions`; on, Nova opens a menu and reports the option id, off it is a plain button.',
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
