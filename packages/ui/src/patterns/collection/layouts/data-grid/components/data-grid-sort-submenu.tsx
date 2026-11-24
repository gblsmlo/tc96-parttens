'use client'

import { ArrowsDownUpIcon } from '@phosphor-icons/react'
import type { RowData } from '@tanstack/react-table'
import {
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import type React from 'react'
import type { DataGridColumnMeta } from '../types'

export interface DataGridSortColumn {
  readonly id: string
  readonly columnDef: { readonly meta?: unknown }
  getCanSort: () => boolean
  toggleSorting: (desc?: boolean) => void
}

export interface DataGridSortTable {
  getAllLeafColumns: () => readonly DataGridSortColumn[]
  resetSorting: () => void
  readonly store: { readonly state: { readonly sorting: readonly unknown[] } }
}

export interface DataGridSortSubmenuProps<_TData extends RowData = RowData> {
  label?: string
  clearLabel?: string
  getOptionLabel?: (columnLabel: string, direction: 'asc' | 'desc') => string
  table: DataGridSortTable
}

const defaultOptionLabel = (columnLabel: string, direction: 'asc' | 'desc') =>
  `${columnLabel}: ${direction === 'asc' ? 'crescente' : 'decrescente'}`

export function DataGridSortSubmenu<TData extends RowData>({
  label = 'Ordenar por',
  clearLabel = 'Limpar ordenação',
  getOptionLabel = defaultOptionLabel,
  table,
}: DataGridSortSubmenuProps<TData>): React.ReactElement | null {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanSort())
  if (columns.length === 0) return null

  return (
    <MenuSub>
      <MenuSubTrigger>
        <ArrowsDownUpIcon aria-hidden="true" />
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
              {getOptionLabel(columnLabel, 'asc')}
            </MenuItem>,
            <MenuItem
              key={`${column.id}-desc`}
              onClick={() => column.toggleSorting(true)}
            >
              {getOptionLabel(columnLabel, 'desc')}
            </MenuItem>,
          ]
        })}
        {table.store.state.sorting.length > 0 ? (
          <>
            <MenuSeparator />
            <MenuItem onClick={() => table.resetSorting()}>
              {clearLabel}
            </MenuItem>
          </>
        ) : null}
      </MenuSubPopup>
    </MenuSub>
  )
}
