import type { ArgTypes } from '@storybook/react-vite'

export interface Settings17Controls {
  description: string
  empty: boolean
  title: string
  withActions: boolean
}

export const settings17ControlArgs: Settings17Controls = {
  description: 'Decida o que é coletado e compartilhado sobre sua conta.',
  empty: false,
  title: 'Privacidade',
  withActions: true,
}

export const settings17ControlArgTypes: Partial<ArgTypes<Settings17Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    empty: {
      control: 'boolean',
      description: 'Passes an empty `controls` list, which renders no rows.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
    withActions: {
      control: 'boolean',
      description:
        'Passes `onAction`; off removes the button of the rows that carry an `actionLabel`.',
    },
  }
