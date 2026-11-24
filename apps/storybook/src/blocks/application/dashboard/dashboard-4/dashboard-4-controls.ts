import type { ArgTypes } from '@storybook/react-vite'

export interface Dashboard4Controls {
  empty: boolean
  error: boolean
  pending: boolean
  rowActions: boolean
  tableTools: boolean
  team: boolean
  title: string
}

export const dashboard4ControlArgs: Dashboard4Controls = {
  empty: false,
  error: false,
  pending: false,
  rowActions: true,
  tableTools: true,
  team: true,
  title: 'Rastreador de módulos',
}

export const dashboard4ControlArgTypes: Partial<ArgTypes<Dashboard4Controls>> =
  {
    empty: {
      control: 'boolean',
      description: 'Passes `metrics` and `modules` empty.',
    },
    error: {
      control: 'boolean',
      description: 'The `error` prop: renders the error surface.',
    },
    pending: {
      control: 'boolean',
      description: 'The `pending` prop: renders the skeleton.',
    },
    rowActions: {
      control: 'boolean',
      description:
        'Passes `onOpen`, `onFavoriteChange` and `onRowAction`; off, the actions column is not rendered.',
    },
    tableTools: {
      control: 'boolean',
      description:
        'Passes `onSearchChange`, `onFilterChange`, `onAddModule` and `pagination` with `onPageChange`; off, the table shows every row with no tools.',
    },
    team: {
      control: 'boolean',
      description: 'Passes `team` and `onInvite` to the navbar.',
    },
    title: {
      control: 'text',
      description: 'Text of `labels.title`, the name of the section.',
    },
  }
