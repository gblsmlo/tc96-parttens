import type { ArgTypes } from '@storybook/react-vite'

export interface Settings21Controls {
  description: string
  empty: boolean
  title: string
  withActions: boolean
}

export const settings21ControlArgs: Settings21Controls = {
  description: 'Gerencie os aplicativos conectados ao seu espaço de trabalho.',
  empty: false,
  title: 'Aplicativos conectados',
  withActions: true,
}

export const settings21ControlArgTypes: Partial<ArgTypes<Settings21Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes an empty `apps` list, which replaces the rows by the empty state.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
    withActions: {
      control: 'boolean',
      description:
        'Passes `onConnect` and `onDisconnect`; off removes every row button.',
    },
  }
