// biome-ignore-all lint/a11y/useSemanticElements: a virtualizable spreadsheet uses the WAI-ARIA grid pattern instead of table layout elements

'use client'

import type { RowData } from '@tanstack/react-table'
import { ScrollArea } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import { type ReactNode, useMemo, useRef } from 'react'
import { useCollapsedGroups } from '../../../shared/hooks/use-collapsed-groups'
import { useLatestCallback } from '../../../shared/hooks/use-latest-callback'
import {
  scrollbarInsetStyle,
  useScrollbarInsets,
} from '../../../shared/hooks/use-scrollbar-insets'
import { DEFAULT_END_REACHED_THRESHOLD } from '../../../shared/lib/end-reached'
import { isRowReorderActive } from '../../../shared/lib/row-reorder'
import { useColumnLayouts } from '../hooks/use-column-layouts'
import { useDataGridCellEvents } from '../hooks/use-data-grid-cell-events'
import { useDataGridCellSelection } from '../hooks/use-data-grid-cell-selection'
import { useDataGridDragScroll } from '../hooks/use-data-grid-drag-scroll'
import { useDataGridEndReached } from '../hooks/use-data-grid-end-reached'
import { useDataGridFocus } from '../hooks/use-data-grid-focus'
import { DataGridRowContext } from '../hooks/use-data-grid-row-context'
import { useDataGridRows } from '../hooks/use-data-grid-rows'
import { useDataGridVirtualizer } from '../hooks/use-data-grid-virtualizer'
import {
  findFirstNavigableColumnIndex,
  indexColumns,
  resolveFillColumnId,
} from '../lib/columns'
import { ROW_HEIGHT } from '../lib/constants'
import type { DataGridTable } from '../lib/data-grid-features'
import type {
  DataGridDensity,
  DataGridRowDragAnnouncements,
  DataGridRowMove,
} from '../types'
import { DataGridAddRow } from './data-grid-add-row'
import { DataGridBody } from './data-grid-body'
import { DataGridFooter } from './data-grid-footer'
import type { DataGridGroupCellContext } from './data-grid-group-row'
import { DataGridHeaderRows } from './data-grid-header-rows'
import { DataGridPagination } from './data-grid-pagination'
import { DataGridRowReorder } from './data-grid-row-reorder'
import {
  DataGridSelectionActions,
  type DataGridSelectionActionsProp,
} from './data-grid-selection-actions'
import type { DataGridRowSkeletonAnatomy } from './data-grid-skeleton-rows'

export interface DataGridProps<TData extends RowData> {
  table: DataGridTable<TData>
  pagination?: boolean
  fillColumn?: string | false
  footer?: ReactNode
  density?: DataGridDensity
  isLoading?: boolean
  loadingRowAnatomy?: DataGridRowSkeletonAnatomy
  loadingRowCount?: number
  loadingMore?: boolean
  loadingMoreRowCount?: number
  onEndReached?: () => void
  endReachedThreshold?: number
  emptyMessage?: string
  maxHeight?: number | string
  getRowGroup?: (row: TData) => string | null
  collapsedGroupIds?: readonly string[]
  defaultCollapsedGroupIds?: readonly string[]
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  renderGroupCell?: (context: DataGridGroupCellContext<TData>) => ReactNode
  getGroupToggleLabel?: (group: string, collapsed: boolean) => string
  onRowMove?: (move: DataGridRowMove) => void
  rowDragAnnouncements?: DataGridRowDragAnnouncements
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
  loadingRowAnatomy,
  loadingRowCount = 5,
  loadingMore = false,
  loadingMoreRowCount = 3,
  onEndReached,
  endReachedThreshold = DEFAULT_END_REACHED_THRESHOLD,
  emptyMessage = 'Nenhum registro para exibir.',
  maxHeight,
  getRowGroup,
  collapsedGroupIds: controlledCollapsedGroupIds,
  defaultCollapsedGroupIds = NO_GROUPS,
  onCollapsedGroupIdsChange,
  renderGroupCell,
  getGroupToggleLabel,
  onRowMove,
  rowDragAnnouncements,
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
  const scrollAreaRef = useRef<HTMLDivElement>(null)
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
  const model = useDataGridRows({
    collapsedGroupIds,
    getRowGroup,
    table,
    withGroupRows: Boolean(renderGroupCell),
  })
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
  const sorting = table.options.state?.sorting ?? table.atoms.sorting.get()
  const reorderActive = isRowReorderActive({
    enabled: Boolean(onRowMove),
    grouped: Boolean(getRowGroup),
    loading: isLoading,
    sorted: sorting.length > 0,
    virtualized: shouldVirtualize,
  })
  const expandable = Boolean(table.options.enableExpanding)
  const loadingMoreCount =
    loadingMore && !isLoading && model.pageRows.length > 0
      ? loadingMoreRowCount
      : 0
  useDataGridEndReached({
    density,
    enabled: Boolean(onEndReached) && !isLoading,
    gridRef,
    hasBottomBar: Boolean(onRowAdd || footerContent),
    loadingMore: loadingMoreCount > 0,
    onEndReached,
    rowCount: table.options.data.length,
    threshold: endReachedThreshold,
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
      rowReorder: reorderActive,
      rowSelectable,
    }),
    [
      columnLayouts,
      density,
      enableRowSelection,
      interactions,
      leafColumns,
      meta,
      reorderActive,
      rowSelectable,
    ],
  )

  const bodyRowCount = isLoading
    ? loadingRowCount
    : model.collectionRowCount === 0
      ? 1
      : model.collectionRowCount + model.groupRowCount
  useScrollbarInsets(
    scrollAreaRef,
    '[data-slot="data-grid-header"]',
    footerContent
      ? '[data-slot="data-grid-footer"]'
      : '[data-slot="data-grid-add-row-group"]',
    Boolean(footerContent || onRowAdd),
  )
  const ariaRowCount =
    model.headerRowCount +
    bodyRowCount +
    loadingMoreCount +
    (onRowAdd ? 1 : 0) +
    (footerContent ? 1 : 0)
  const totalSize = table.getTotalSize()

  return (
    <div
      className={cn(
        'relative flex min-h-0 min-w-0 flex-1 flex-col',
        fillColumnId ? 'w-full' : 'w-fit max-w-full',
        className,
      )}
    >
      <ScrollArea
        className={cn(
          'relative size-auto min-h-0 flex-1 rounded-md border bg-background text-sm',
          fillColumnId ? 'w-full' : 'w-fit max-w-full',
        )}
        data-slot="data-grid"
        ref={scrollAreaRef}
        verticalScrollbarProps={{ style: scrollbarInsetStyle }}
        viewportProps={{
          'aria-busy': isLoading || loadingMoreCount > 0 || undefined,
          'aria-colcount': leafColumns.length,
          'aria-label': ariaLabel,
          'aria-multiselectable': true,
          'aria-rowcount': ariaRowCount,
          className:
            'grid h-full cursor-grab select-none rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-[drag-scroll=dragging]:cursor-grabbing data-has-overflow-x:overscroll-x-contain data-has-overflow-y:overscroll-y-contain',
          'data-density': density,
          'data-drag-scroll': dragScroll.isDragScrolling
            ? 'dragging'
            : undefined,
          onClickCapture: dragScroll.onClickCapture,
          onLostPointerCapture: dragScroll.onLostPointerCapture,
          onPointerCancel: dragScroll.onPointerCancel,
          onPointerDownCapture: dragScroll.onPointerDownCapture,
          onPointerMove: dragScroll.onPointerMove,
          onPointerUp: dragScroll.onPointerUp,
          ref: gridRef,
          role: expandable ? 'treegrid' : 'grid',
          style: { maxHeight },
          tabIndex: rows.length > 0 && !isLoading ? -1 : 0,
        }}
      >
        <DataGridHeaderRows
          columnLayouts={columnLayouts}
          fillColumnId={fillColumnId}
          table={table}
        />
        <DataGridRowContext value={rowContext}>
          <DataGridRowReorder
            active={reorderActive}
            announcements={rowDragAnnouncements}
            indexByRowId={model.rowIndexById}
            onRowMove={onRowMove}
            paginationRowOffset={model.paginationRowOffset}
            positions={model.positions}
            rows={rows}
          >
            <DataGridBody
              columnIds={leafColumns.map((column) => column.id)}
              columnLayouts={columnLayouts}
              columns={leafColumns}
              density={density}
              emptyMessage={emptyMessage}
              entries={model.entries}
              expandable={expandable}
              focusedColumnId={cellSelection.focusedColumnId}
              focusedRowId={cellSelection.focusedRowId}
              getRowSelected={getRowSelected}
              hasInteracted={cellSelection.hasInteracted}
              headerRowCount={model.headerRowCount}
              isLoading={isLoading}
              labelColumnId={leafColumns[firstNavigableColumn]?.id}
              loadingMoreRowCount={loadingMoreCount}
              loadingMoreRowIndexOffset={bodyRowCount}
              {...(loadingRowAnatomy ? { loadingRowAnatomy } : {})}
              loadingRowCount={loadingRowCount}
              minWidth={totalSize}
              onToggleGroup={onToggleGroup}
              pageRowCount={model.pageRows.length}
              renderGroupCell={renderGroupCell}
              getGroupToggleLabel={getGroupToggleLabel}
              selection={cellSelection.selection}
              totalSize={
                virtualizer.totalSize + loadingMoreCount * ROW_HEIGHT[density]
              }
              virtualItems={virtualizer.virtualItems}
              virtualized={shouldVirtualize}
            />
          </DataGridRowReorder>
        </DataGridRowContext>
        {onRowAdd ? (
          <DataGridAddRow
            ariaRowIndex={
              model.headerRowCount + bodyRowCount + loadingMoreCount + 1
            }
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
      </ScrollArea>
      <DataGridSelectionActions
        selectionActions={selectionActions}
        table={table}
      />
    </div>
  )
}
