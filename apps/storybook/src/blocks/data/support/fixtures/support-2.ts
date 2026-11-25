import type {
  Support2Person,
  Support2RowAction,
  Support2Sort,
  Support2Ticket,
  Support2View,
} from '@tc96/ui/blocks/data/support/support-2'
import * as source from '../../support/fixtures/support-1.ts'

export const tickets: Support2Ticket[] = source.tickets
export const owners: Support2Person[] = source.owners
export const rowActions: Support2RowAction[] = source.rowActions
export const views: Support2View[] = source.views
export const initialSort: Support2Sort = source.initialSort
