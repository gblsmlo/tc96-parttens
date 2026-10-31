import type { RowData } from '@tanstack/react-table'
import type { CSSProperties } from 'react'
import type { DataGridColumn } from './data-grid-features'

export interface ColumnLayout {
  pinned: false | 'start' | 'end'
  style: CSSProperties
}

export type ColumnLayouts = ReadonlyMap<string, ColumnLayout>

function columnStyle(size: number, fill: boolean): CSSProperties {
  return {
    flex: `${fill ? 1 : 0} 0 ${size}px`,
    minWidth: size,
    width: size,
  }
}

function pinnedColumnStyle<TData extends RowData>(
  column: DataGridColumn<TData>,
  pinned: ColumnLayout['pinned'],
  fillColumnId?: string,
): CSSProperties {
  const base = columnStyle(
    column.getSize(),
    !pinned && column.id === fillColumnId,
  )
  if (pinned === 'start') {
    return {
      ...base,
      insetInlineStart: column.getStart('start'),
      position: 'sticky',
      zIndex: 5,
    }
  }
  if (pinned === 'end') {
    return {
      ...base,
      insetInlineEnd: column.getAfter('end'),
      position: 'sticky',
      zIndex: 5,
    }
  }
  return base
}

function sameStyle(a: CSSProperties, b: CSSProperties) {
  const keys = Object.keys(a) as (keyof CSSProperties)[]
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => a[key] === b[key])
  )
}

export function resolveColumnLayout<TData extends RowData>(
  column: DataGridColumn<TData>,
  fillColumnId?: string,
): ColumnLayout {
  const pinned = column.getIsPinned()
  return { pinned, style: pinnedColumnStyle(column, pinned, fillColumnId) }
}

export function buildColumnLayouts<TData extends RowData>(
  columns: readonly DataGridColumn<TData>[],
  fillColumnId?: string,
  previous?: ColumnLayouts,
): ColumnLayouts {
  const layouts = new Map<string, ColumnLayout>()
  for (const column of columns) {
    const pinned = column.getIsPinned()
    const style = pinnedColumnStyle(column, pinned, fillColumnId)
    const before = previous?.get(column.id)
    layouts.set(
      column.id,
      before && before.pinned === pinned && sameStyle(before.style, style)
        ? before
        : { pinned, style },
    )
  }
  if (previous && previous.size === layouts.size) {
    const before = [...previous]
    const unchanged = [...layouts].every(
      ([id, layout], index) =>
        before[index]?.[0] === id && before[index]?.[1] === layout,
    )
    if (unchanged) return previous
  }
  return layouts
}
