import type { ArgTypes } from '@storybook/react-vite'

export interface Settings18Controls {
  description: string
  empty: boolean
  title: string
}

export const settings18ControlArgs: Settings18Controls = {
  description: 'Escolha o que cada função pode fazer no workspace.',
  empty: false,
  title: 'Permissões',
}

export const settings18ControlArgTypes: Partial<ArgTypes<Settings18Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes an empty `capabilities` list, which replaces the cards by the empty state.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
  }
