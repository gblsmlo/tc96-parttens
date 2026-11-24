import type { ArgTypes } from '@storybook/react-vite'

export interface Settings14Controls {
  description: string
  empty: boolean
  newAccount: string
  title: string
  withActions: boolean
  withArchived: boolean
}

export const settings14ControlArgs: Settings14Controls = {
  description:
    'Bancos e caixas onde os lançamentos são liquidados. Novos lançamentos começam na conta padrão.',
  empty: false,
  newAccount: 'Nova conta',
  title: 'Contas',
  withActions: true,
  withArchived: true,
}

export const settings14ControlArgTypes: Partial<ArgTypes<Settings14Controls>> =
  {
    description: {
      control: 'text',
      description: 'Text of `labels.description`, under the title.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes an empty `accounts` list, which replaces the rows by the empty state.',
    },
    newAccount: {
      control: 'text',
      description: 'Text of `labels.newAccount`, the button of `onCreate`.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the heading of the section.',
    },
    withActions: {
      control: 'boolean',
      description:
        'Passes `onCreate` and `onAccountAction`; off removes the New account button and the row menus.',
    },
    withArchived: {
      control: 'boolean',
      description:
        'Passes `archivedAccounts`; off removes the archived section, which only appears with archived accounts.',
    },
  }
