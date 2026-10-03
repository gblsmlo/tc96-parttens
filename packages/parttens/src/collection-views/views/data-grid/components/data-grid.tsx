// biome-ignore-all lint/a11y/useSemanticElements: a virtualizable spreadsheet uses the WAI-ARIA grid pattern instead of table layout elements

'use client'

import type { RowData } from '@tanstack/react-table'
import { ScrollAreaPrimitive, ScrollBar } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import { type ReactNode, useMemo, useRef } from 'react'
import { useCollapsedGroups } from '../hooks/use-collapsed-groups'
import { useColumnLayouts } from '../hooks/use-column-layouts'
import { useDataGridCellEvents } from '../hooks/use-data-grid-cell-events'
import { useDataGridCellSelection } from '../hooks/use-data-grid-cell-selection'
import { useDataGridDragScroll } from '../hooks/use-data-grid-drag-scroll'
import { useDataGridFocus } from '../hooks/use-data-grid-focus'
import { DataGridRowContext } from '../hooks/use-data-grid-row-context'
import { useDataGridRows } from '../hooks/use-data-grid-rows'
import { useDataGridVirtualizer } from '../hooks/use-data-grid-virtualizer'
import { useLatestCallback } from '../hooks/use-latest-callback'
import {
  findFirstNavigableColumnIndex,
  indexColumns,
  resolveFillColumnId,
} from '../lib/columns'
import type { DataGridTable } from '../lib/data-grid-features'
import type { DataGridDensity } from '../types'
import { DataGridAddRow } from './data-grid-add-row'
import { DataGridBody } from './data-grid-body'
import { DataGridFooter } from './data-grid-footer'
import { DataGridHeaderRows } from './data-grid-header-rows'
import { DataGridPagination } from './data-grid-pagination'
import {
  DataGridSelectionActions,
  type DataGridSelectionActionsProp,
} from './data-grid-selection-actions'

export interface DataGridProps<TData extends RowData> {
  table: DataGridTable<TData>
  pagination?: boolean
  fillColumn?: string | false
  footer?: ReactNode
  density?: DataGridDensity
  isLoading?: boolean
  loadingRowCount?: number
  emptyMessage?: string
  maxHeight?: number | string
  getRowGroup?: (row: TData) => string | null
  collapsedGroupIds?: readonly string[]
  defaultCollapsedGroupIds?: readonly string[]
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  getRowSelected?: (row: TData) => boolean
  onRowAdd?: () => void | Promise<void>
  addRowLabel?: string
  virtualize?: boolean
  overscan?: number
  className?: string
  selectionActions?: DataGridSelectionActionsProp<TData>
  'aria-label'?: string
}

const NO_GROUPS: readonly string[] = []

export function DataGrid<TData extends RowData>({
  table,
  pagination,
  fillColumn,
  footer,
  density: densityProp,
  isLoading = false,
  loadingRowCount = 5,
  emptyMessage = 'Nenhum registro para exibir.',
  maxHeight,
  getRowGroup,
  collapsedGroupIds: controlledCollapsedGroupIds,
  defaultCollapsedGroupIds = NO_GROUPS,
  onCollapsedGroupIdsChange,
  getRowSelected,
  onRowAdd,
  addRowLabel = 'Adicionar linha',
  virtualize = false,
  overscan = 8,
  className,
  selectionActions,
  'aria-label': ariaLabel,
}: DataGridProps<TData>) {
  const gridRef = useRef<HTMLDivElement>(null)
  const showsPagination = pagination ?? !table.options.manualPagination
  const footerContent =
    footer ?? (showsPagination ? <DataGridPagination table={table} /> : null)
  const density = densityProp ?? table.options.meta?.dataGridDensity ?? 'short'
  const leafColumns = table.getVisibleLeafColumns()
  const fillColumnId = resolveFillColumnId(leafColumns, fillColumn)
  const columnIndexById = useMemo(
    () => indexColumns(leafColumns),
    [leafColumns],
  )
  const columnLayouts = useColumnLayouts(leafColumns, fillColumnId)
  const firstNavigableColumn = findFirstNavigableColumnIndex(leafColumns)

  const { collapsedGroupIds, setGroupCollapsed } = useCollapsedGroups({
    controlled: controlledCollapsedGroupIds,
    defaultValue: defaultCollapsedGroupIds,
    onChange: onCollapsedGroupIdsChange,
  })
  const onToggleGroup = useLatestCallback(setGroupCollapsed)
  const model = useDataGridRows({ collapsedGroupIds, getRowGroup, table })
  const { rows } = model

  const cellSelection = useDataGridCellSelection({
    availableColumnIds: columnIndexById,
    coreRowsById: table.getCoreRowModel().rowsById,
    availableRowIds: model.positions,
    firstColumnId: leafColumns[firstNavigableColumn]?.id,
    firstRowId: rows[0]?.id,
    visibleRowIds: model.rowIndexById,
  })
  const { focusCell, registry } = useDataGridFocus({
    focusedColumnId: cellSelection.focusedColumnId,
    focusedRowId: cellSelection.focusedRowId,
    hasInteracted: cellSelection.hasInteracted,
  })

  const shouldVirtualize =
    virtualize && !getRowGroup && !isLoading && rows.length > 0
  const virtualizer = useDataGridVirtualizer({
    density,
    enabled: shouldVirtualize,
    gridRef,
    hasBottomBar: Boolean(onRowAdd || footerContent),
    maxHeight,
    overscan,
    rows,
    table,
  })
  const interactions = useDataGridCellEvents({
    columnIndexById,
    columns: leafColumns,
    firstNavigableColumn,
    focusCell,
    registry,
    rowIndexById: model.rowIndexById,
    rows,
    scrollRowIntoView: shouldVirtualize
      ? virtualizer.scrollRowIntoView
      : undefined,
    selectCell: cellSelection.selectCell,
    selection: cellSelection.selection,
  })
  const dragScroll = useDataGridDragScroll()

  const rowSelectable =
    Boolean(getRowSelected) || Boolean(table.options.enableRowSelection)
  const meta = table.options.meta
  const enableRowSelection = table.options.enableRowSelection
  const rowContext = useMemo(
    () => ({
      columnLayouts,
      columns: leafColumns,
      density,
      enableRowSelection,
      interactions,
      meta,
      rowSelectable,
    }),
    [
      columnLayouts,
      density,
      enableRowSelection,
      interactions,
      leafColumns,
      meta,
      rowSelectable,
    ],
  )

  const bodyRowCount = isLoading
    ? loadingRowCount
    : model.collectionRowCount === 0
      ? 1
      : model.collectionRowCount + model.groupRowCount
  const ariaRowCount =
    model.headerRowCount +
    bodyRowCount +
    (onRowAdd ? 1 : 0) +
    (footerContent ? 1 : 0)
  const totalSize = table.getTotalSize()

  return (
    <div
      className={cn(
        'relative min-w-0',
        fillColumnId ? 'w-full' : 'w-fit max-w-full',
        className,
      )}
    >
      <ScrollAreaPrimitive.Root
        className={cn(
          'relative h-auto rounded-md border bg-background text-sm',
          fillColumnId ? 'w-full' : 'w-fit max-w-full',
        )}
        data-slot="data-grid"
      >
        <ScrollAreaPrimitive.Viewport
          aria-busy={isLoading || undefined}
          aria-colcount={leafColumns.length}
          aria-label={ariaLabel}
          aria-multiselectable
          aria-rowcount={ariaRowCount}
          className="grid h-full cursor-grab select-none rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-[drag-scroll=dragging]:cursor-grabbing data-has-overflow-x:overscroll-x-contain data-has-overflow-y:overscroll-y-contain"
          data-density={density}
          data-drag-scroll={dragScroll.isDragScrolling ? 'dragging' : undefined}
          data-slot="scroll-area-viewport"
          onClickCapture={dragScroll.onClickCapture}
          onLostPointerCapture={dragScroll.onLostPointerCapture}
          onPointerCancel={dragScroll.onPointerCancel}
          onPointerDownCapture={dragScroll.onPointerDownCapture}
          onPointerMove={dragScroll.onPointerMove}
          onPointerUp={dragScroll.onPointerUp}
          ref={gridRef}
          role="grid"
          style={{ maxHeight }}
          tabIndex={rows.length > 0 && !isLoading ? -1 : 0}
        >
          <ScrollAreaPrimitive.Content
            data-slot="scroll-area-content"
            style={{ minWidth: 0 }}
          >
            <DataGridHeaderRows
              columnLayouts={columnLayouts}
              fillColumnId={fillColumnId}
              table={table}
            />
            <DataGridRowContext value={rowContext}>
              <DataGridBody
                columnIds={leafColumns.map((column) => column.id)}
                columnLayouts={columnLayouts}
                density={density}
                emptyMessage={emptyMessage}
                entries={model.entries}
                focusedColumnId={cellSelection.focusedColumnId}
                focusedRowId={cellSelection.focusedRowId}
                getRowSelected={getRowSelected}
                hasInteracted={cellSelection.hasInteracted}
                headerRowCount={model.headerRowCount}
                isLoading={isLoading}
                loadingRowCount={loadingRowCount}
                minWidth={totalSize}
                onToggleGroup={onToggleGroup}
                pageRowCount={model.pageRows.length}
                selection={cellSelection.selection}
                totalSize={virtualizer.totalSize}
                virtualItems={virtualizer.virtualItems}
                virtualized={shouldVirtualize}
              />
            </DataGridRowContext>
            {onRowAdd ? (
              <DataGridAddRow
                ariaRowIndex={model.headerRowCount + bodyRowCount + 1}
                label={addRowLabel}
                minWidth={totalSize}
                onAdd={onRowAdd}
              />
            ) : null}
            {footerContent ? (
              <DataGridFooter
                ariaRowIndex={ariaRowCount}
                columnCount={leafColumns.length}
              >
                {footerContent}
              </DataGridFooter>
            ) : null}
          </ScrollAreaPrimitive.Content>
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
        <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
      </ScrollAreaPrimitive.Root>
      <DataGridSelectionActions
        selectionActions={selectionActions}
        table={table}
      />
    </div>
  )
}
