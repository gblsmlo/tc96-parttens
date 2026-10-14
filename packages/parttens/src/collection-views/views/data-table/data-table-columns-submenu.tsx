'use client'

import type { RowData } from '@tanstack/react-table'
import { MenuSub, MenuSubPopup, MenuSubTrigger } from '@tc96/ui/menu'
import { Columns3Icon } from 'lucide-react'
import type React from 'react'
import { MenuCheckboxOption } from '../../../shared/components/menu-selection-item'
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
        <Columns3Icon aria-hidden="true" />
        {label}
      </MenuSubTrigger>
      <MenuSubPopup>
        {columns.map((column) => {
          const meta = (column.columnDef.meta ??
            {}) as DataTableColumnMeta<TData>
          return (
            <MenuCheckboxOption
              checked={column.getIsVisible()}
              closeOnClick={false}
              key={column.id}
              onCheckedChange={(checked) =>
                column.toggleVisibility(Boolean(checked))
              }
            >
              {meta.label ?? column.id}
            </MenuCheckboxOption>
          )
        })}
      </MenuSubPopup>
    </MenuSub>
  )
}
