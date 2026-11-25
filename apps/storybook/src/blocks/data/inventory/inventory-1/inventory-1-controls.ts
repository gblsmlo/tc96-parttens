import type { ArgTypes } from '@storybook/react-vite'

export interface Inventory1Controls {
  addButton: boolean
  empty: boolean
  locale: string
  lowStockThreshold: number
  rowMenu: boolean
  saving: boolean
  title: string
}

export const inventory1ControlArgs: Inventory1Controls = {
  addButton: true,
  empty: false,
  locale: 'pt-BR',
  lowStockThreshold: 10,
  rowMenu: true,
  saving: false,
  title: 'Inventário de produtos',
}

export const inventory1ControlArgTypes: Partial<ArgTypes<Inventory1Controls>> =
  {
    addButton: {
      control: 'boolean',
      description:
        'Passes `onAdd`; off, the Adicionar produto toolbar button is not rendered.',
    },
    empty: {
      control: 'boolean',
      description:
        'Passes no products, which renders the empty row of the grid.',
    },
    locale: {
      control: 'inline-radio',
      description: 'Locale of the prices and of the decimal separator typed.',
      options: ['pt-BR', 'en-US'],
    },
    lowStockThreshold: {
      control: { max: 100, min: 0, step: 1, type: 'number' },
      description: 'Stock below this value shows the low stock warning.',
    },
    rowMenu: {
      control: 'boolean',
      description: 'Passes `rowActions` and `onRowAction`; off, no row menu.',
    },
    saving: {
      control: 'boolean',
      description: 'Marks Salvar alterações as loading and disables Descartar.',
    },
    title: {
      control: 'text',
      description:
        'Text of `labels.title`, the toolbar heading and the name of the grid.',
    },
  }
