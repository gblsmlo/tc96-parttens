import type { ArgTypes } from '@storybook/react-vite'

export interface Settings20Controls {
  description: string
  empty: boolean
  readOnly: boolean
  title: string
}

export const settings20ControlArgs: Settings20Controls = {
  description: 'Escolha por onde receber o aviso de cada evento.',
  empty: false,
  readOnly: false,
  title: 'Canais de notificação',
}

export const settings20ControlArgTypes: Partial<ArgTypes<Settings20Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes an empty `categories` list, which replaces the tabs by the empty state.',
    },
    readOnly: {
      control: 'boolean',
      description:
        'Omits `onChange`; the checkboxes render disabled and keep their values.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
  }
