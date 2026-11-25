import type {
  Marketing2Campaign,
  Marketing2ColumnVisibility,
  Marketing2Density,
  Marketing2Period,
  Marketing2RowAction,
  Marketing2Sort,
  Marketing2Summary,
} from '@tc96/ui/blocks/data/marketing/marketing-2'
import {
  campaigns as dataGridCampaigns,
  pageSizeOptions as dataGridPageSizeOptions,
  period as dataGridPeriod,
  rowActions as dataGridRowActions,
  summary as dataGridSummary,
} from '../../marketing/fixtures/marketing-1.ts'

export const campaigns: Marketing2Campaign[] = dataGridCampaigns

export const summary: Marketing2Summary = dataGridSummary

export const period: Marketing2Period = dataGridPeriod

export const initialSort: Marketing2Sort = { direction: 'desc', key: 'spend' }

export const rowActions: Marketing2RowAction[] = dataGridRowActions

export const pageSizeOptions = dataGridPageSizeOptions

export interface Marketing2ViewSettings {
  columnVisibility: Marketing2ColumnVisibility
  density: Marketing2Density
  sort: Marketing2Sort | null
}

export const factorySettings: Marketing2ViewSettings = {
  columnVisibility: {},
  density: 'tall',
  sort: initialSort,
}
