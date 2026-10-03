import type { RowData } from '@tanstack/react-table'
import {
  DEFAULT_MAX_COLUMN_SIZE,
  DEFAULT_MIN_COLUMN_SIZE,
  RESIZE_STEP_PX,
} from './constants'
import type { DataGridColumn } from './data-grid-features'

export function resolveColumnSizeBounds<TData extends RowData>(
  column: DataGridColumn<TData>,
) {
  return {
    max: column.columnDef.maxSize ?? DEFAULT_MAX_COLUMN_SIZE,
    min: column.columnDef.minSize ?? DEFAULT_MIN_COLUMN_SIZE,
  }
}

export function resolveResizeKeySize<TData extends RowData>(
  column: DataGridColumn<TData>,
  key: string,
) {
  const delta =
    key === 'ArrowLeft'
      ? -RESIZE_STEP_PX
      : key === 'ArrowRight'
        ? RESIZE_STEP_PX
        : 0
  if (!delta) return undefined
  const { max, min } = resolveColumnSizeBounds(column)
  return Math.min(max, Math.max(min, column.getSize() + delta))
}
