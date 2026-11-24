import type { ArgTypes } from '@storybook/react-vite'

export interface Table7Controls {
  empty: boolean
  locale: string
  reorder: boolean
  rowMenu: boolean
  title: string
}

export const table7ControlArgs: Table7Controls = {
  empty: false,
  locale: 'pt-BR',
  reorder: true,
  rowMenu: true,
  title: 'Regras de roteamento',
}

export const table7ControlArgTypes: Partial<ArgTypes<Table7Controls>> = {
  empty: {
    control: 'boolean',
    description: 'Passes no rules, which renders the empty row of the table.',
  },
  locale: {
    control: 'inline-radio',
    description: 'Locale of the match counts.',
    options: ['pt-BR', 'en-US'],
  },
  reorder: {
    control: 'boolean',
    description:
      'Passes `onRuleMove` and `onResetOrder`; off, the handles are inert and the toolbar has no Restaurar ordem.',
  },
  rowMenu: {
    control: 'boolean',
    description: 'Passes `rowActions` and `onRowAction`; off, no row menu.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`, the toolbar heading and the name of the table.',
  },
}
