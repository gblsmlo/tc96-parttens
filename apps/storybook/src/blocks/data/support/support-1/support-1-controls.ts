import type { ArgTypes } from '@storybook/react-vite'

export interface Support1Controls {
  bulkActions: boolean
  empty: boolean
  headerActions: boolean
  pageSize: number
  rowActions: boolean
  savedViews: boolean
  title: string
}

export const support1ControlArgs: Support1Controls = {
  bulkActions: true,
  empty: false,
  headerActions: true,
  pageSize: 6,
  rowActions: true,
  savedViews: true,
  title: 'Fila de suporte',
}

export const support1ControlArgTypes: Partial<ArgTypes<Support1Controls>> = {
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onAssignOwner` and `onStatusUpdate`; off, the ActionBar keeps only the count and Limpar seleção.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no tickets, which renders the empty row of the grid.',
  },
  headerActions: {
    control: 'boolean',
    description:
      'Passes `onExport` and `onCreate`; off, the toolbar buttons are not rendered.',
  },
  pageSize: {
    control: 'inline-radio',
    description:
      'Rows per page, one of the `pageSizeOptions`; the footer selector changes it too.',
    options: [6, 12, 24],
  },
  rowActions: {
    control: 'boolean',
    description:
      'Passes `rowActions` and `onRowAction`; off, the menu column is not rendered.',
  },
  savedViews: {
    control: 'boolean',
    description:
      'Passes `views`, `activeViewId`, `onViewChange` and `onViewCreate`; off, the toolbar shows the heading and the ticket summary in its place.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`: the name of the section and of the grid, and the toolbar heading when there are no views.',
  },
}
