import type {
  Revenue4Account,
  Revenue4Region,
  Revenue4RowAction,
  Revenue4Summary,
} from '@tc96/ui/blocks/data/revenue/revenue-4'
import {
  accounts as dataGridAccounts,
  regions as dataGridRegions,
  rowActions as dataGridRowActions,
  summarize as dataGridSummarize,
} from '../../revenue/fixtures/revenue-3.ts'

export const regions: Revenue4Region[] = dataGridRegions

export const accounts: Revenue4Account[] = dataGridAccounts

export const summarize = (list: readonly Revenue4Account[]): Revenue4Summary =>
  dataGridSummarize(list)

export const summary: Revenue4Summary = summarize(accounts)

export const rowActions: Revenue4RowAction[] = dataGridRowActions
