import type { ArgTypes } from '@storybook/react-vite'

export interface Table1Controls {
  bulkActions: boolean
  empty: boolean
  headerActions: boolean
  pageSize: number
  rowActions: boolean
  savedViews: boolean
  title: string
}

export const table1ControlArgs: Table1Controls = {
  bulkActions: true,
  empty: false,
  headerActions: true,
  pageSize: 6,
  rowActions: true,
  savedViews: true,
  title: 'Fila de suporte',
}

export const table1ControlArgTypes: Partial<ArgTypes<Table1Controls>> = {
  bulkActions: {
    control: 'boolean',
    description:
      'Passes `onAssignOwner` and `onStatusUpdate`; off, the ActionBar keeps only the count and Limpar seleção.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no tickets, which renders the empty row of the table.',
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
      'Passes `views`, `activeViewId`, `onViewChange` and `onViewCreate`; off, the view switcher is not rendered.',
  },
  title: {
    control: 'text',
    description:
      'Text of `labels.title`, the toolbar heading and the name of the table.',
  },
}
