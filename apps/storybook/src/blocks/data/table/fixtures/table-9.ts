import type {
  Table9Campaign,
  Table9ColumnVisibility,
  Table9Density,
  Table9Period,
  Table9RowAction,
  Table9Sort,
  Table9Summary,
} from '@tc96/ui/blocks/data/table/table-9'
import {
  campaigns as dataGridCampaigns,
  pageSizeOptions as dataGridPageSizeOptions,
  period as dataGridPeriod,
  rowActions as dataGridRowActions,
  summary as dataGridSummary,
} from '../../data-grid/fixtures/data-grid-9.ts'

export const campaigns: Table9Campaign[] = dataGridCampaigns

export const summary: Table9Summary = dataGridSummary

export const period: Table9Period = dataGridPeriod

export const initialSort: Table9Sort = { direction: 'desc', key: 'spend' }

export const rowActions: Table9RowAction[] = dataGridRowActions

export const pageSizeOptions = dataGridPageSizeOptions

export interface Table9ViewSettings {
  columnVisibility: Table9ColumnVisibility
  density: Table9Density
  sort: Table9Sort | null
}

export const factorySettings: Table9ViewSettings = {
  columnVisibility: {},
  density: 'tall',
  sort: initialSort,
}
