import type { ArgTypes } from '@storybook/react-vite'

export interface Projects2Controls {
  create: boolean
  empty: boolean
  pageSize: number
  rowActions: boolean
  subtasksSwitch: boolean
  title: string
  views: boolean
}

export const projects2ControlArgs: Projects2Controls = {
  create: true,
  empty: false,
  pageSize: 5,
  rowActions: true,
  subtasksSwitch: true,
  title: 'Entrega de tarefas',
  views: true,
}

export const projects2ControlArgTypes: Partial<ArgTypes<Projects2Controls>> = {
  create: {
    control: 'boolean',
    description:
      'Passes `onCreate`; off, the Nova tarefa button of the toolbar is not rendered.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no tasks, which renders the empty row of the table.',
  },
  pageSize: {
    control: 'inline-radio',
    description: 'Initial rows per page; the footer selector changes it.',
    options: [5, 10, 20],
  },
  rowActions: {
    control: 'boolean',
    description:
      'Passes `rowActions` and `onRowAction`; off, the menu column is not rendered.',
  },
  subtasksSwitch: {
    control: 'boolean',
    description:
      'Passes `onShowSubtasksChange`; off, the Mostrar subtarefas switch is not rendered.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`, the toolbar heading and the name of the table.',
  },
  views: {
    control: 'boolean',
    description:
      'Passes `onViewChange` and `viewCounts`; off, the Todas, Ativas and Backlog tabs are not rendered.',
  },
}
