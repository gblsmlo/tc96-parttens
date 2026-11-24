'use client'

import { ColumnsIcon } from '@phosphor-icons/react'
import type { RowData } from '@tanstack/react-table'
import {
  MenuCheckboxItem,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import type React from 'react'
import type { DataTableColumnMeta } from './data-table-aggregation'
import type { DataTableTable } from './use-data-table'

export interface DataTableColumnsSubmenuProps<TData extends RowData> {
  label?: string
  table: DataTableTable<TData>
}

export function DataTableColumnsSubmenu<TData extends RowData>({
  label = 'Colunas',
  table,
}: DataTableColumnsSubmenuProps<TData>): React.ReactElement | null {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())
  if (columns.length === 0) return null

  return (
    <MenuSub>
      <MenuSubTrigger>
        <ColumnsIcon aria-hidden="true" />
        {label}
      </MenuSubTrigger>
      <MenuSubPopup>
        {columns.map((column) => {
          const meta = (column.columnDef.meta ??
            {}) as DataTableColumnMeta<TData>
          return (
            <MenuCheckboxItem
              checked={column.getIsVisible()}
              closeOnClick={false}
              key={column.id}
              onCheckedChange={(checked) =>
                column.toggleVisibility(Boolean(checked))
              }
            >
              {meta.label ?? column.id}
            </MenuCheckboxItem>
          )
        })}
      </MenuSubPopup>
    </MenuSub>
  )
}
