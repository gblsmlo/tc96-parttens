'use client'

import type { RowData } from '@tanstack/react-table'
import { Input } from '@tc96/ui/input'
import { cn } from '@tc96/utils'
import type React from 'react'
import type { DataGridTable } from '../lib/data-grid-features'

export interface DataGridSearchProps<TData extends RowData>
  extends Omit<
    React.ComponentProps<typeof Input>,
    'onChange' | 'value' | 'type'
  > {
  table: DataGridTable<TData>
}

export function DataGridSearch<TData extends RowData>({
  'aria-label': ariaLabel,
  className,
  placeholder = 'Buscar…',
  table,
  ...props
}: DataGridSearchProps<TData>): React.ReactElement {
  const accessibleName = ariaLabel ?? placeholder

  return (
    <Input
      aria-label={accessibleName}
      className={cn('max-w-64', className)}
      data-slot="data-grid-search"
      onChange={(event) => {
        table.setGlobalFilter(event.target.value)
        table.setPageIndex(0)
      }}
      placeholder={placeholder}
      type="search"
      value={(table.store.state.globalFilter as string) ?? ''}
      {...props}
    />
  )
}
