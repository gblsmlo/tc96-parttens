'use client'

import { flexRender, type RowData } from '@tanstack/react-table'
import { Menu, MenuTrigger } from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { HEADER_ALIGN } from '../lib/constants'
import type { DataGridHeader } from '../lib/data-grid-features'
import type { DataGridColumnMeta } from '../types'
import { DataGridColumnMenu } from './data-grid-column-menu'
import { DataGridColumnTypeIcon } from './data-grid-column-type-icon'
import { DataGridResizeHandle } from './data-grid-resize-handle'

export function DataGridColumnHeader<TData extends RowData>({
  header,
}: {
  header: DataGridHeader<TData>
}) {
  const { column } = header
  const meta = (column.columnDef.meta ?? {}) as DataGridColumnMeta
  const align = HEADER_ALIGN[meta.align ?? 'start']
  const sorted = column.getIsSorted()
  const table = header.getContext().table
  const visibleLeafColumns = table.getVisibleLeafColumns()
  const isLastColumn =
    visibleLeafColumns[visibleLeafColumns.length - 1]?.id === column.id
  const label = flexRender(column.columnDef.header, header.getContext())
  const showMenu =
    column.getCanSort() || column.getCanHide() || column.getCanPin()

  return (
    <div className={cn('flex size-full min-w-0 items-center gap-1', align)}>
      {showMenu ? (
        <Menu modal={false}>
          <MenuTrigger
            aria-label={`Opções da coluna ${meta.label ?? column.id}`}
            className={cn(
              'flex size-full min-w-0 items-center gap-1.5 rounded-sm px-1 font-medium outline-none hover:bg-accent/40 focus-visible:ring-1 focus-visible:ring-ring data-popup-open:bg-accent/40',
              align,
            )}
          >
            {meta.type ? <DataGridColumnTypeIcon type={meta.type} /> : null}
            <span className="truncate">{label}</span>
            {sorted === 'asc' ? (
              <ChevronUpIcon className="size-3.5 shrink-0 text-muted-foreground" />
            ) : sorted === 'desc' ? (
              <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
            ) : null}
            <ChevronDownIcon className="ms-auto size-3.5 shrink-0 text-muted-foreground" />
          </MenuTrigger>
          <DataGridColumnMenu column={column} table={table} />
        </Menu>
      ) : (
        <div
          className={cn(
            'flex min-w-0 flex-1 items-center gap-1.5 truncate px-1 font-medium',
            align,
          )}
        >
          {meta.type ? <DataGridColumnTypeIcon type={meta.type} /> : null}
          <span className="truncate">{label}</span>
        </div>
      )}

      {column.getCanResize() ? (
        <DataGridResizeHandle
          column={column}
          header={header}
          isLastColumn={isLastColumn}
          table={table}
        />
      ) : null}
    </div>
  )
}
