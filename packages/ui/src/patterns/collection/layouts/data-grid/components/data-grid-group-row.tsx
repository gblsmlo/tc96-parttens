// biome-ignore-all lint/a11y/useSemanticElements: the WAI-ARIA grid pattern is used instead of table layout elements so the body can be virtualized

'use client'

import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react'
import type { Row, RowData } from '@tanstack/react-table'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { cn } from '@tc96/utils'
import { memo, type ReactNode } from 'react'
import type { ColumnLayouts } from '../lib/column-layout'
import { CELL_ALIGN } from '../lib/constants'
import type {
  DataGridColumn,
  DataGridFeatures,
} from '../lib/data-grid-features'

export interface DataGridGroupCellContext<TData extends RowData> {
  collapsed: boolean
  column: DataGridColumn<TData>
  count: number
  group: string
  rows: readonly Row<DataGridFeatures, TData>[]
}

export interface DataGridGroupRowProps<TData extends RowData> {
  ariaRowIndex: number
  collapsed: boolean
  columnLayouts?: ColumnLayouts
  columns?: readonly DataGridColumn<TData>[]
  count: number
  group: string
  labelColumnId?: string
  onToggle: (group: string, collapsed: boolean) => void
  getGroupToggleLabel?: (group: string, collapsed: boolean) => string
  renderGroupCell?: (context: DataGridGroupCellContext<TData>) => ReactNode
  rows?: readonly Row<DataGridFeatures, TData>[]
}

const defaultGroupToggleLabel = (group: string, collapsed: boolean) =>
  collapsed ? `Expandir ${group}` : `Recolher ${group}`

function DataGridGroupLabel({
  collapsed,
  count,
  getGroupToggleLabel = defaultGroupToggleLabel,
  group,
  onToggle,
}: Pick<
  DataGridGroupRowProps<RowData>,
  'collapsed' | 'count' | 'getGroupToggleLabel' | 'group' | 'onToggle'
>) {
  return (
    <>
      <Button
        aria-expanded={!collapsed}
        aria-label={getGroupToggleLabel(group, collapsed)}
        onClick={() => onToggle(group, !collapsed)}
        size="icon-sm"
        variant="ghost"
      >
        {collapsed ? (
          <CaretRightIcon aria-hidden="true" />
        ) : (
          <CaretDownIcon aria-hidden="true" />
        )}
      </Button>
      <span className="truncate" data-slot="data-grid-group-label">
        {group}
      </span>
      <Badge
        className="size-5 min-w-5 shrink-0 rounded-full p-0 text-xs tabular-nums sm:size-5 sm:min-w-5"
        data-slot="data-grid-group-count"
        variant="secondary"
      >
        {count}
      </Badge>
    </>
  )
}

function DataGridGroupRowView<TData extends RowData>({
  ariaRowIndex,
  collapsed,
  columnLayouts,
  columns,
  count,
  getGroupToggleLabel,
  group,
  labelColumnId,
  onToggle,
  renderGroupCell,
  rows = [],
}: DataGridGroupRowProps<TData>) {
  if (!(renderGroupCell && columns)) {
    return (
      <div
        aria-rowindex={ariaRowIndex}
        className="flex min-h-9 items-center border-b bg-muted/40 px-1 font-medium"
        data-collapsed={collapsed ? 'true' : undefined}
        data-slot="data-grid-group-row"
        role="row"
        tabIndex={-1}
      >
        <div
          className="flex min-w-0 items-center gap-1"
          role="gridcell"
          tabIndex={-1}
        >
          <DataGridGroupLabel
            collapsed={collapsed}
            count={count}
            getGroupToggleLabel={getGroupToggleLabel}
            group={group}
            onToggle={onToggle}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      aria-rowindex={ariaRowIndex}
      className="flex min-h-9 w-full items-center border-b bg-muted/40 font-medium"
      data-collapsed={collapsed ? 'true' : undefined}
      data-slot="data-grid-group-row"
      role="row"
      tabIndex={-1}
    >
      {columns.map((column, columnIndex) => {
        const layout = columnLayouts?.get(column.id)
        const isLabelColumn = column.id === labelColumnId
        return (
          <div
            aria-colindex={columnIndex + 1}
            className={cn(
              'flex min-h-9 min-w-0 items-center gap-1 self-stretch overflow-hidden px-2 data-[pinned]:bg-[color-mix(in_srgb,var(--muted)_40%,var(--background))]',
              CELL_ALIGN[column.columnDef.meta?.align ?? 'start'],
            )}
            data-column-id={column.id}
            data-pinned={layout?.pinned || undefined}
            data-slot="data-grid-group-cell"
            key={column.id}
            role="gridcell"
            style={layout?.style}
            tabIndex={-1}
          >
            {isLabelColumn ? (
              <DataGridGroupLabel
                collapsed={collapsed}
                count={count}
                getGroupToggleLabel={getGroupToggleLabel}
                group={group}
                onToggle={onToggle}
              />
            ) : (
              renderGroupCell({ collapsed, column, count, group, rows })
            )}
          </div>
        )
      })}
    </div>
  )
}

export const DataGridGroupRow = memo(
  DataGridGroupRowView,
) as typeof DataGridGroupRowView
