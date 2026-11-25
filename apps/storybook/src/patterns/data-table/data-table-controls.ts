import type { ArgTypes } from '@storybook/react-vite'

export const loadingCells = ['text', 'control'] as const

export type LoadingCellName = (typeof loadingCells)[number]

export interface DataTableControls {
  bordered: boolean
  columnsMenu: boolean
  empty: boolean
  emptyMessage: string
  footer: boolean
  isLoading: boolean
  loadingCell: LoadingCellName
  loadingLines: 1 | 2
  pagination: boolean
  resizable: boolean
  rowClick: boolean
  selectedRow: boolean
  selection: boolean
}

export const dataTableControlArgs: DataTableControls = {
  bordered: true,
  columnsMenu: false,
  empty: false,
  emptyMessage: 'Nenhum projeto para exibir.',
  footer: true,
  isLoading: false,
  loadingCell: 'text',
  loadingLines: 1,
  pagination: true,
  resizable: false,
  rowClick: true,
  selectedRow: false,
  selection: true,
}

export const dataTableControlArgTypes: Partial<ArgTypes<DataTableControls>> = {
  bordered: {
    control: 'boolean',
    description: 'The `bordered` of `DataTable`: the frame around the table.',
  },
  columnsMenu: {
    control: 'boolean',
    description:
      'Adds a toolbar above the table with a `DataTableColumnsSubmenu` inside its view settings menu.',
  },
  empty: {
    control: 'boolean',
    description: 'Passes no rows, so the body shows `emptyMessage`.',
  },
  emptyMessage: {
    control: 'text',
    description:
      'The `emptyMessage` of `DataTable`, shown when there are no rows.',
  },
  footer: {
    control: 'boolean',
    description:
      'Gives Projeto and Horas `meta.aggregations`, which adds the footer with a count and a sum.',
  },
  isLoading: {
    control: 'boolean',
    description:
      'The `isLoading` of `DataTable`: skeleton rows replace the rows.',
  },
  loadingCell: {
    control: 'inline-radio',
    description:
      'The `cell` of `loadingRowAnatomy`; acts only while `isLoading`.',
    options: loadingCells,
  },
  loadingLines: {
    control: 'inline-radio',
    description:
      'The `lines` of `loadingRowAnatomy`; acts only while `isLoading`.',
    options: [1, 2],
  },
  pagination: {
    control: 'boolean',
    description:
      'Passes `enablePagination` with five rows a page and adds a `DataGridPagination` below the table.',
  },
  resizable: {
    control: 'boolean',
    description:
      'Passes `enableColumnResizing` to `useDataTable`: fixed column widths with a resize handle in each header.',
  },
  rowClick: {
    control: 'boolean',
    description:
      'Passes `onRowClick` and `getRowOpenLabel`, which turn every row into a button.',
  },
  selectedRow: {
    control: 'boolean',
    description: 'Selects the second row through the table state.',
  },
  selection: {
    control: 'boolean',
    description:
      'Adds a first column of checkboxes and passes `enableRowSelection`.',
  },
}
