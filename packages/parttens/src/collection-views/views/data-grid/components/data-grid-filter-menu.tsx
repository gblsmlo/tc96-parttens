'use client'

import type { RowData } from '@tanstack/react-table'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import { Popover, PopoverPopup, PopoverTrigger } from '@tc96/ui/popover'
import { ListFilterIcon } from 'lucide-react'
import type React from 'react'
import type { DataGridTable } from '../lib/data-grid-features'
import type { DataGridColumnMeta } from '../types'

export interface DataGridFilterMenuProps<TData extends RowData> {
  className?: string
  label?: string
  table: DataGridTable<TData>
}

export function DataGridFilterMenu<TData extends RowData>({
  className,
  label = 'Filtrar',
  table,
}: DataGridFilterMenuProps<TData>): React.ReactElement | null {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanFilter())
  if (columns.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            aria-label={label}
            className={className}
            size="sm"
            variant="ghost"
          />
        }
      >
        <ListFilterIcon />
        {label}
      </PopoverTrigger>
      <PopoverPopup align="end" aria-label={label} className="w-72">
        <div className="flex flex-col gap-3" data-slot="data-grid-filter-menu">
          <div>
            <h3 className="font-medium text-sm">Filtrar por</h3>
            <p className="text-muted-foreground text-xs">
              Preencha um ou mais campos.
            </p>
          </div>
          {columns.map((column) => {
            const meta = (column.columnDef.meta ?? {}) as DataGridColumnMeta
            const columnLabel = meta.label ?? column.id
            const inputId = `data-grid-filter-${column.id}`
            return (
              <label
                className="grid gap-1.5 text-sm"
                htmlFor={inputId}
                key={column.id}
              >
                <span className="font-medium">{columnLabel}</span>
                <Input
                  aria-label={`Filtrar ${columnLabel}`}
                  id={inputId}
                  onChange={(event) => {
                    const value = event.target.value
                    column.setFilterValue(value || undefined)
                    table.setPageIndex(0)
                  }}
                  placeholder={`Buscar em ${columnLabel.toLocaleLowerCase('pt-BR')}…`}
                  value={String(column.getFilterValue() ?? '')}
                />
              </label>
            )
          })}
          {table.store.state.columnFilters.length > 0 ? (
            <Button
              onClick={() => table.resetColumnFilters()}
              size="sm"
              variant="ghost"
            >
              Limpar filtros
            </Button>
          ) : null}
        </div>
      </PopoverPopup>
    </Popover>
  )
}
