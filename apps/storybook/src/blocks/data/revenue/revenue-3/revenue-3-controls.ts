import type { ArgTypes } from '@storybook/react-vite'

export interface Revenue3Controls {
  currency: string
  empty: boolean
  exportAction: boolean
  kpis: boolean
  locale: string
  rowActions: boolean
  title: string
  toggleAll: boolean
}

export const revenue3ControlArgs: Revenue3Controls = {
  currency: 'BRL',
  empty: false,
  exportAction: true,
  kpis: true,
  locale: 'pt-BR',
  rowActions: true,
  title: 'Receita por região',
  toggleAll: true,
}

export const revenue3ControlArgTypes: Partial<ArgTypes<Revenue3Controls>> = {
  currency: {
    control: 'inline-radio',
    description: 'ISO currency of the ARR values, subtotals and indicators.',
    options: ['BRL', 'USD'],
  },
  empty: {
    control: 'boolean',
    description: 'Passes no accounts, which renders the empty row of the grid.',
  },
  exportAction: {
    control: 'boolean',
    description:
      'Passes `onExport`; off, the Exportar button of the toolbar is not rendered.',
  },
  kpis: {
    control: 'boolean',
    description:
      'Passes `summary`; off, the band of three indicators below the toolbar is not rendered.',
  },
  locale: {
    control: 'inline-radio',
    description: 'Locale of the amounts, percentages and dates.',
    options: ['pt-BR', 'en-US'],
  },
  rowActions: {
    control: 'boolean',
    description:
      'Passes `rowActions` and `onRowAction`; off, the menu column is not rendered.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`, the toolbar heading and the name of the grid.',
  },
  toggleAll: {
    control: 'boolean',
    description:
      'Passes `collapsedRegionIds` and `onCollapsedRegionIdsChange`; off, the Expandir tudo button is not rendered and the grid keeps the collapse locally.',
  },
}
