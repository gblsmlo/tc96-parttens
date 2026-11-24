import type {
  Table8Filters,
  Table8Sort,
  Table8Transaction,
  Table8View,
} from '@tc96/ui/blocks/data/table/table-8'
import {
  createDataGrid8Transactions,
  dataGrid8PageSize,
  dataGrid8TotalCount,
  emptyFilters as dataGridEmptyFilters,
  initialSort as dataGridInitialSort,
  views as dataGridViews,
  queryDataGrid8Transactions,
} from '../../data-grid/fixtures/data-grid-8.ts'

export const table8TotalCount = dataGrid8TotalCount
export const table8PageSize = dataGrid8PageSize

export const initialSort: Table8Sort = dataGridInitialSort

export const emptyFilters: Table8Filters = dataGridEmptyFilters

export const views: Table8View[] = dataGridViews

export const createTable8Transactions = (
  count: number,
  offset = 0,
): Table8Transaction[] => createDataGrid8Transactions(count, offset)

export const transactions = createTable8Transactions(table8PageSize)

export interface Table8Query {
  filters: Table8Filters
  search: string
  sort: Table8Sort | null
}

export const queryTable8Transactions = (
  rows: readonly Table8Transaction[],
  query: Table8Query,
): Table8Transaction[] => queryDataGrid8Transactions(rows, query)
