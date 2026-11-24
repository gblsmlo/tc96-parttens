import type {
  Table3Condition,
  Table3Person,
  Table3Renewal,
  Table3RowAction,
  Table3Sort,
  Table3View,
} from '@tc96/ui/blocks/data/table/table-3'
import * as source from '../../data-grid/fixtures/data-grid-3.ts'

export const owners: Table3Person[] = source.owners
export const renewals: Table3Renewal[] = source.renewals
export const rowActions: Table3RowAction[] = source.rowActions
export const views: Table3View[] = source.views
export const initialSort: Table3Sort = source.initialSort
export const initialConditions: Table3Condition[] = source.initialConditions
