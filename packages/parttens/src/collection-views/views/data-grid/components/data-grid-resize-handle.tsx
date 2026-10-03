// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import type { RowData } from '@tanstack/react-table'
import { cn } from '@tc96/utils'
import type {
  DataGridColumn,
  DataGridHeader,
  DataGridTable,
} from '../lib/data-grid-features'
import { resolveColumnSizeBounds, resolveResizeKeySize } from '../lib/resize'
import type { DataGridColumnMeta } from '../types'

export interface DataGridResizeHandleProps<TData extends RowData> {
  column: DataGridColumn<TData>
  header: DataGridHeader<TData>
  isLastColumn: boolean
  table: DataGridTable<TData>
}

export function DataGridResizeHandle<TData extends RowData>({
  column,
  header,
  isLastColumn,
  table,
}: DataGridResizeHandleProps<TData>) {
  const meta = (column.columnDef.meta ?? {}) as DataGridColumnMeta
  const { max, min } = resolveColumnSizeBounds(column)

  return (
    <div
      aria-label={`Redimensionar coluna ${meta.label ?? column.id}`}
      aria-orientation="vertical"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={column.getSize()}
      className={cn(
        'absolute top-0 z-20 h-full w-0.5 cursor-ew-resize touch-none select-none outline-none after:absolute after:inset-y-0 after:start-1/2 after:w-4 hover:bg-primary focus-visible:bg-primary',
        isLastColumn
          ? 'end-0 after:-translate-x-full'
          : '-end-px after:-translate-x-1/2',
        column.getIsResizing() ? 'bg-primary' : 'bg-border',
      )}
      onDoubleClick={() => column.resetSize()}
      onKeyDown={(event) => {
        const size = resolveResizeKeySize(column, event.key)
        if (size === undefined) return
        event.preventDefault()
        table.setColumnSizing((current) => ({
          ...current,
          [column.id]: size,
        }))
      }}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      role="separator"
      tabIndex={0}
    />
  )
}
