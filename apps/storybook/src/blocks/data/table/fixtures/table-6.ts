import type {
  Table6Account,
  Table6Region,
  Table6RowAction,
  Table6Summary,
} from '@tc96/ui/blocks/data/table/table-6'
import {
  accounts as dataGridAccounts,
  regions as dataGridRegions,
  rowActions as dataGridRowActions,
  summarize as dataGridSummarize,
} from '../../data-grid/fixtures/data-grid-6.ts'

export const regions: Table6Region[] = dataGridRegions

export const accounts: Table6Account[] = dataGridAccounts

export const summarize = (list: readonly Table6Account[]): Table6Summary =>
  dataGridSummarize(list)

export const summary: Table6Summary = summarize(accounts)

export const rowActions: Table6RowAction[] = dataGridRowActions
