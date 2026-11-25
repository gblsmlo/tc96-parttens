import type {
  Finance2Filters,
  Finance2Sort,
  Finance2Transaction,
  Finance2View,
} from '@tc96/ui/blocks/data/finance/finance-2'
import {
  createFinance1Transactions,
  emptyFilters as dataGridEmptyFilters,
  initialSort as dataGridInitialSort,
  views as dataGridViews,
  finance1PageSize,
  finance1TotalCount,
  queryFinance1Transactions,
} from '../../finance/fixtures/finance-1.ts'

export const finance2TotalCount = finance1TotalCount
export const finance2PageSize = finance1PageSize

export const initialSort: Finance2Sort = dataGridInitialSort

export const emptyFilters: Finance2Filters = dataGridEmptyFilters

export const views: Finance2View[] = dataGridViews

export const createFinance2Transactions = (
  count: number,
  offset = 0,
): Finance2Transaction[] => createFinance1Transactions(count, offset)

export const transactions = createFinance2Transactions(finance2PageSize)

export interface Finance2Query {
  filters: Finance2Filters
  search: string
  sort: Finance2Sort | null
}

export const queryFinance2Transactions = (
  rows: readonly Finance2Transaction[],
  query: Finance2Query,
): Finance2Transaction[] => queryFinance1Transactions(rows, query)
