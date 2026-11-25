import type { ArgTypes } from '@storybook/react-vite'

export interface Support3Controls {
  empty: boolean
  locale: string
  reorder: boolean
  rowMenu: boolean
  title: string
}

export const support3ControlArgs: Support3Controls = {
  empty: false,
  locale: 'pt-BR',
  reorder: true,
  rowMenu: true,
  title: 'Regras de roteamento',
}

export const support3ControlArgTypes: Partial<ArgTypes<Support3Controls>> = {
  empty: {
    control: 'boolean',
    description: 'Passes no rules, which renders the empty row of the grid.',
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
      'Text of `labels.title`, the toolbar heading and the name of the grid.',
  },
}
