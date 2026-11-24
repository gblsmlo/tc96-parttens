import type {
  Table1Person,
  Table1RowAction,
  Table1Sort,
  Table1Ticket,
  Table1View,
} from '@tc96/ui/blocks/data/table/table-1'
import * as source from '../../data-grid/fixtures/data-grid-1.ts'

export const tickets: Table1Ticket[] = source.tickets
export const owners: Table1Person[] = source.owners
export const rowActions: Table1RowAction[] = source.rowActions
export const views: Table1View[] = source.views
export const initialSort: Table1Sort = source.initialSort
