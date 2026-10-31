'use client'

import type { RowData } from '@tanstack/react-table'
import {
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import { ArrowDownUpIcon } from 'lucide-react'
import type React from 'react'
import type { DataGridTable } from '../lib/data-grid-features'
import type { DataGridColumnMeta } from '../types'

export interface DataGridSortSubmenuProps<TData extends RowData> {
  label?: string
  table: DataGridTable<TData>
}

export function DataGridSortSubmenu<TData extends RowData>({
  label = 'Ordenar por',
  table,
}: DataGridSortSubmenuProps<TData>): React.ReactElement | null {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanSort())
  if (columns.length === 0) return null

  return (
    <MenuSub>
      <MenuSubTrigger>
        <ArrowDownUpIcon aria-hidden="true" />
        {label}
      </MenuSubTrigger>
      <MenuSubPopup>
        {columns.flatMap((column) => {
          const meta = (column.columnDef.meta ?? {}) as DataGridColumnMeta
          const columnLabel = meta.label ?? column.id
          return [
            <MenuItem
              key={`${column.id}-asc`}
              onClick={() => column.toggleSorting(false)}
            >
              {columnLabel}: crescente
            </MenuItem>,
            <MenuItem
              key={`${column.id}-desc`}
              onClick={() => column.toggleSorting(true)}
            >
              {columnLabel}: decrescente
            </MenuItem>,
          ]
        })}
        {table.store.state.sorting.length > 0 ? (
          <>
            <MenuSeparator />
            <MenuItem onClick={() => table.resetSorting()}>
              Limpar ordenação
            </MenuItem>
          </>
        ) : null}
      </MenuSubPopup>
    </MenuSub>
  )
}
