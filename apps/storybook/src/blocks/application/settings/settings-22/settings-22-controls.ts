import type { ArgTypes } from '@storybook/react-vite'

export interface Settings22Controls {
  description: string
  empty: boolean
  newKey: string
  title: string
  withActions: boolean
}

export const settings22ControlArgs: Settings22Controls = {
  description: 'Chaves para acessar a API da sua conta.',
  empty: false,
  newKey: 'Nova chave',
  title: 'Chaves de API',
  withActions: true,
}

export const settings22ControlArgTypes: Partial<ArgTypes<Settings22Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes an empty `keys` list, which replaces the table by the empty state.',
    },
    newKey: {
      control: 'text',
      description: 'Text of `labels.newKey`, the button of `onCreate`.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
    withActions: {
      control: 'boolean',
      description:
        'Passes `onCreate`, `onCopy`, `onActiveChange` and `onKeyAction`; off removes the New key button, the copy buttons, the row menus and enabled switches.',
    },
  }
