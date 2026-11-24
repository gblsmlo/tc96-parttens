import type {
  EditableCellRow,
  EditableCellValueChange,
} from '../../shared/lib/editable-cell'
import type {
  RowDragAnnouncements,
  RowMove,
} from '../../shared/lib/row-reorder'

export type DataTableDensity = 'short' | 'medium' | 'tall' | 'extra-tall'

export type DataTableAlign = 'start' | 'center' | 'end'

export type DataTableCellRow = EditableCellRow

export type DataTableCellValueChange = EditableCellValueChange

export type DataTableRowMove = RowMove

export type DataTableRowDragAnnouncements = RowDragAnnouncements

export interface DataTableTableMeta {
  dataGridDensity?: DataTableDensity
  onDataGridDensityChange?: (density: DataTableDensity) => void
  onDataTableCellValueChange?: (change: DataTableCellValueChange) => void
}
