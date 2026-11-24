import type { ArgTypes } from '@storybook/react-vite'
import type { DataGridDensity } from '@tc96/ui/patterns'

export const dataGridDensities: DataGridDensity[] = [
  'short',
  'medium',
  'tall',
  'extra-tall',
]

export const loadingCells = ['text', 'control'] as const

export type LoadingCellName = (typeof loadingCells)[number]

export interface DataGridControls {
  addRow: boolean
  density: DataGridDensity
  empty: boolean
  emptyMessage: string
  fillColumn: boolean
  grouped: boolean
  isLoading: boolean
  loadingCell: LoadingCellName
  pagination: boolean
  selectedRow: boolean
  selection: boolean
  selectionActions: boolean
  toolbar: boolean
}

export const dataGridControlArgs: DataGridControls = {
  addRow: false,
  density: 'short',
  empty: false,
  emptyMessage: 'Nenhum projeto para exibir.',
  fillColumn: true,
  grouped: false,
  isLoading: false,
  loadingCell: 'control',
  pagination: true,
  selectedRow: false,
  selection: true,
  selectionActions: true,
  toolbar: false,
}

export const dataGridControlArgTypes: Partial<ArgTypes<DataGridControls>> = {
  addRow: {
    control: 'boolean',
    description:
      'Passes `onRowAdd`, which adds the "Adicionar linha" row below the body.',
  },
  density: {
    control: 'inline-radio',
    description: 'The `density` of `useDataGrid`, the starting row height.',
    options: dataGridDensities,
  },
  empty: {
    control: 'boolean',
    description: 'Passes no rows, so the body shows `emptyMessage`.',
  },
  emptyMessage: {
    control: 'text',
    description:
      'The `emptyMessage` of `DataGrid`, shown when there are no rows.',
  },
  fillColumn: {
    control: 'boolean',
    description:
      'Off passes `fillColumn={false}`: every column keeps its width and the grid shrinks to them.',
  },
  grouped: {
    control: 'boolean',
    description:
      'Passes `getRowGroup` with the owner, which opens a group row per run of the same owner.',
  },
  isLoading: {
    control: 'boolean',
    description:
      'The `isLoading` of `DataGrid`: skeleton rows replace the rows.',
  },
  loadingCell: {
    control: 'inline-radio',
    description:
      'The `cell` of `loadingRowAnatomy`; acts only while `isLoading`.',
    options: loadingCells,
  },
  pagination: {
    control: 'boolean',
    description:
      'Passes `enablePagination` with five rows a page, which adds the pagination footer.',
  },
  selectedRow: {
    control: 'boolean',
    description: 'Selects the second row through the table state.',
  },
  selection: {
    control: 'boolean',
    description: 'Adds `createSelectColumn()` and passes `enableRowSelection`.',
  },
  selectionActions: {
    control: 'boolean',
    description:
      'Passes `selectionActions`, an action bar shown over the footer while rows are selected.',
  },
  toolbar: {
    control: 'boolean',
    description:
      'Adds a toolbar above the grid with `DataGridSearch`, `DataGridFilterMenu`, the sort, density and columns submenus, and `DataGridSelectionSummary`.',
  },
}
