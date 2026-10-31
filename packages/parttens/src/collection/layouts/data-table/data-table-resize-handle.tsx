'use client'

import type { Header, RowData } from '@tanstack/react-table'
import { cn } from '@tc96/utils'
import type { KeyboardEvent, ReactElement } from 'react'
import type { DataTableFeatures, DataTableTable } from './use-data-table'

const RESIZE_STEP_PX = 8
const DEFAULT_MIN_COLUMN_SIZE = 20
const DEFAULT_MAX_COLUMN_SIZE = Number.MAX_SAFE_INTEGER

export interface DataTableResizeHandleProps<TData extends RowData> {
  header: Header<DataTableFeatures, TData, unknown>
  table: DataTableTable<TData>
}

export function DataTableResizeHandle<TData extends RowData>({
  header,
  table,
}: DataTableResizeHandleProps<TData>): ReactElement {
  const { column } = header
  const min = column.columnDef.minSize ?? DEFAULT_MIN_COLUMN_SIZE
  const max = column.columnDef.maxSize ?? DEFAULT_MAX_COLUMN_SIZE
  const size = column.getSize()
  const label =
    typeof column.columnDef.header === 'string'
      ? column.columnDef.header
      : column.id

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === 'ArrowLeft'
        ? -RESIZE_STEP_PX
        : event.key === 'ArrowRight'
          ? RESIZE_STEP_PX
          : 0
    if (!delta) return
    event.preventDefault()
    table.setColumnSizing((current) => ({
      ...current,
      [column.id]: Math.min(max, Math.max(min, size + delta)),
    }))
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: the grab area is an ::after box, which a void <hr> cannot render
    <div
      aria-label={`Redimensionar coluna ${label}`}
      aria-orientation="vertical"
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={size}
      className={cn(
        'absolute inset-y-0 end-0 z-10 w-0.5 cursor-ew-resize touch-none select-none outline-none after:absolute after:inset-y-0 after:end-0 after:w-3 hover:bg-primary focus-visible:bg-primary',
        column.getIsResizing() ? 'bg-primary' : 'bg-border',
      )}
      onDoubleClick={() => column.resetSize()}
      onKeyDown={handleKeyDown}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      role="separator"
      tabIndex={0}
    />
  )
}
