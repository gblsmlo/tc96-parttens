import type {
  Revenue2Condition,
  Revenue2Person,
  Revenue2Renewal,
  Revenue2RowAction,
  Revenue2Sort,
  Revenue2View,
} from '@tc96/ui/blocks/data/revenue/revenue-2'
import * as source from '../../revenue/fixtures/revenue-1.ts'

export const owners: Revenue2Person[] = source.owners
export const renewals: Revenue2Renewal[] = source.renewals
export const rowActions: Revenue2RowAction[] = source.rowActions
export const views: Revenue2View[] = source.views
export const initialSort: Revenue2Sort = source.initialSort
export const initialConditions: Revenue2Condition[] = source.initialConditions
