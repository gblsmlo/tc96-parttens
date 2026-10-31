'use client'

import type { RowData } from '@tanstack/react-table'
import { cn } from '@tc96/utils'
import type React from 'react'
import type { DataGridTable } from '../lib/data-grid-features'

export interface DataGridSelectionSummaryProps<TData extends RowData>
  extends Omit<React.ComponentProps<'span'>, 'children'> {
  table: DataGridTable<TData>
}

export function DataGridSelectionSummary<TData extends RowData>({
  className,
  table,
  ...props
}: DataGridSelectionSummaryProps<TData>): React.ReactElement {
  const count = table.getSelectedRowModel().rows.length
  return (
    <span
      aria-live="polite"
      className={cn(
        'px-2 text-muted-foreground text-sm tabular-nums',
        className,
      )}
      data-slot="data-grid-selection-summary"
      {...props}
    >
      {count} {count === 1 ? 'selecionado' : 'selecionados'}
    </span>
  )
}
