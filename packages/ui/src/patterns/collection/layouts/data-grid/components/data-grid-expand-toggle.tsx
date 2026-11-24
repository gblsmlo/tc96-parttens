'use client'

import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react'
import type { Row, RowData } from '@tanstack/react-table'
import { Button } from '@tc96/ui/button'
import type { ReactNode } from 'react'
import type { DataGridFeatures } from '../lib/data-grid-features'

const DEFAULT_INDENT_PX = 20

export interface DataGridExpandToggleProps<TData extends RowData> {
  children?: ReactNode
  getLabel: (row: Row<DataGridFeatures, TData>, expanded: boolean) => string
  indent?: number
  row: Row<DataGridFeatures, TData>
}

export function DataGridExpandToggle<TData extends RowData>({
  children,
  getLabel,
  indent = DEFAULT_INDENT_PX,
  row,
}: DataGridExpandToggleProps<TData>) {
  const canExpand = row.getCanExpand()
  const expanded = row.getIsExpanded()

  return (
    <div
      className="flex min-w-0 items-center gap-1"
      data-depth={row.depth}
      data-slot="data-grid-expand"
      style={{ paddingInlineStart: row.depth * indent }}
    >
      {canExpand ? (
        <Button
          aria-expanded={expanded}
          aria-label={getLabel(row, expanded)}
          data-slot="data-grid-expand-toggle"
          onClick={() => row.toggleExpanded()}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          {expanded ? (
            <CaretDownIcon aria-hidden="true" />
          ) : (
            <CaretRightIcon aria-hidden="true" />
          )}
        </Button>
      ) : (
        <span aria-hidden="true" className="size-7 shrink-0 sm:size-6" />
      )}
      {children}
    </div>
  )
}
