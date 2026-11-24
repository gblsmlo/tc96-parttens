'use client'

import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react'
import type { Column, Row, RowData } from '@tanstack/react-table'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { TableRow } from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import { memo, type ReactNode } from 'react'
import type { DataTableColumnMeta } from './data-table-aggregation'
import type { DataTableFeatures } from './data-table-features'

export interface DataTableGroupCellContext<TData extends RowData> {
  collapsed: boolean
  column: Column<DataTableFeatures, TData, unknown>
  count: number
  group: string
  rows: readonly Row<DataTableFeatures, TData>[]
}

export interface DataTableGroupRowProps<TData extends RowData> {
  collapsed: boolean
  columns: readonly Column<DataTableFeatures, TData, unknown>[]
  count: number
  getGroupToggleLabel?: (group: string, collapsed: boolean) => string
  group: string
  labelColumnId?: string
  onToggle: (group: string, collapsed: boolean) => void
  renderGroupCell?: (context: DataTableGroupCellContext<TData>) => ReactNode
  rows: readonly Row<DataTableFeatures, TData>[]
}

const defaultGroupToggleLabel = (group: string, collapsed: boolean) =>
  collapsed ? `Expandir ${group}` : `Recolher ${group}`

const groupCellClassName =
  'h-10 whitespace-nowrap bg-muted/40 px-2.5 align-middle font-medium'

const ALIGN_CLASS = {
  center: 'text-center',
  end: 'text-end',
  start: 'text-start',
} as const

function DataTableGroupLabel({
  collapsed,
  count,
  getGroupToggleLabel = defaultGroupToggleLabel,
  group,
  onToggle,
}: Pick<
  DataTableGroupRowProps<RowData>,
  'collapsed' | 'count' | 'getGroupToggleLabel' | 'group' | 'onToggle'
>) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <Button
        aria-expanded={!collapsed}
        aria-label={getGroupToggleLabel(group, collapsed)}
        data-slot="data-table-group-toggle"
        onClick={() => onToggle(group, !collapsed)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        {collapsed ? (
          <CaretRightIcon aria-hidden="true" />
        ) : (
          <CaretDownIcon aria-hidden="true" />
        )}
      </Button>
      <span className="truncate" data-slot="data-table-group-label">
        {group}
      </span>
      <Badge
        className="tabular-nums"
        data-slot="data-table-group-count"
        variant="secondary"
      >
        {count}
      </Badge>
    </div>
  )
}

function DataTableGroupRowView<TData extends RowData>({
  collapsed,
  columns,
  count,
  getGroupToggleLabel,
  group,
  labelColumnId,
  onToggle,
  renderGroupCell,
  rows,
}: DataTableGroupRowProps<TData>) {
  const label = (
    <DataTableGroupLabel
      collapsed={collapsed}
      count={count}
      getGroupToggleLabel={getGroupToggleLabel}
      group={group}
      onToggle={onToggle}
    />
  )

  if (!renderGroupCell) {
    return (
      <TableRow
        data-collapsed={collapsed ? 'true' : undefined}
        data-slot="data-table-group-row"
      >
        <th
          className={cn(groupCellClassName, 'text-start')}
          colSpan={columns.length}
          scope="rowgroup"
        >
          {label}
        </th>
      </TableRow>
    )
  }

  const labelIndex = Math.max(
    columns.findIndex((column) => column.id === labelColumnId),
    0,
  )

  return (
    <TableRow
      data-collapsed={collapsed ? 'true' : undefined}
      data-slot="data-table-group-row"
    >
      {columns.map((column, index) => {
        const align =
          ALIGN_CLASS[
            (column.columnDef.meta as DataTableColumnMeta<TData> | undefined)
              ?.align ?? 'start'
          ]
        if (index === labelIndex) {
          return (
            <th
              className={cn(groupCellClassName, 'text-start')}
              data-column-id={column.id}
              key={column.id}
              scope="rowgroup"
            >
              {label}
            </th>
          )
        }
        return (
          <td
            className={cn(groupCellClassName, align)}
            data-column-id={column.id}
            data-slot="data-table-group-cell"
            key={column.id}
          >
            {index < labelIndex
              ? null
              : renderGroupCell({ collapsed, column, count, group, rows })}
          </td>
        )
      })}
    </TableRow>
  )
}

export const DataTableGroupRow = memo(
  DataTableGroupRowView,
) as typeof DataTableGroupRowView
