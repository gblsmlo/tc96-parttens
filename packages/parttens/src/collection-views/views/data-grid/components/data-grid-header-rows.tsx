// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import type { RowData } from '@tanstack/react-table'
import { type ColumnLayouts, resolveColumnLayout } from '../lib/column-layout'
import type { DataGridTable } from '../lib/data-grid-features'
import { DataGridColumnHeader } from './data-grid-column-header'

export interface DataGridHeaderRowsProps<TData extends RowData> {
  columnLayouts: ColumnLayouts
  fillColumnId?: string
  table: DataGridTable<TData>
}

export function DataGridHeaderRows<TData extends RowData>({
  columnLayouts,
  fillColumnId,
  table,
}: DataGridHeaderRowsProps<TData>) {
  const totalSize = table.getTotalSize()

  return (
    <div
      className="sticky top-0 z-10 grid border-b bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] dark:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)]"
      data-slot="data-grid-header"
      role="rowgroup"
      style={{ minWidth: totalSize }}
    >
      {table.getHeaderGroups().map((headerGroup, rowIndex) => (
        <div
          aria-rowindex={rowIndex + 1}
          className="flex w-full"
          data-slot="data-grid-header-row"
          key={headerGroup.id}
          role="row"
          style={{ minWidth: totalSize }}
          tabIndex={-1}
        >
          {headerGroup.headers.map((header, columnIndex) => {
            const sorted = header.column.getIsSorted()
            const layout =
              columnLayouts.get(header.column.id) ??
              resolveColumnLayout(header.column, fillColumnId)
            return (
              <div
                aria-colindex={columnIndex + 1}
                aria-sort={
                  sorted === 'asc'
                    ? 'ascending'
                    : sorted === 'desc'
                      ? 'descending'
                      : header.column.getCanSort()
                        ? 'none'
                        : undefined
                }
                className="relative flex min-h-9 items-center border-e px-1.5 text-muted-foreground last:border-e-0 data-[pinned]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] dark:data-[pinned]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)]"
                data-column-id={header.column.id}
                data-pinned={layout?.pinned || undefined}
                data-slot="data-grid-header-cell"
                key={header.id}
                role="columnheader"
                style={layout?.style}
                tabIndex={-1}
              >
                {header.isPlaceholder ? null : (
                  <DataGridColumnHeader header={header} />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
