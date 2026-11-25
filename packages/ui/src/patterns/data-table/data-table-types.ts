import type {
  EditableCellRow,
  EditableCellValueChange,
} from '../collection/shared/lib/editable-cell'
import type {
  RowDragAnnouncements,
  RowMove,
} from '../collection/shared/lib/row-reorder'

import type { CollectionDensity } from '../collection/types/collection'

export type { CollectionDensity }

export type DataTableAlign = 'start' | 'center' | 'end'

export type DataTableCellRow = EditableCellRow

export type DataTableCellValueChange = EditableCellValueChange

export type DataTableRowMove = RowMove

export type DataTableRowDragAnnouncements = RowDragAnnouncements

export interface DataTableTableMeta {
  dataGridDensity?: CollectionDensity
  onDataGridDensityChange?: (density: CollectionDensity) => void
  onDataTableCellValueChange?: (change: DataTableCellValueChange) => void
}
