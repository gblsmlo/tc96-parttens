'use client'

import { flexRender, type Row, type RowData } from '@tanstack/react-table'
import { ScrollArea } from '@tc96/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { cn } from '@tc96/utils'
import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from 'react'
import {
  SelectionActions,
  type SelectionActionsProp,
} from '../collection/shared/components/selection-actions'
import { useCollapsedGroups } from '../collection/shared/hooks/use-collapsed-groups'
import { useEndReached } from '../collection/shared/hooks/use-end-reached'
import { useLatestCallback } from '../collection/shared/hooks/use-latest-callback'
import {
  scrollbarInsetStyle,
  useScrollbarInsets,
} from '../collection/shared/hooks/use-scrollbar-insets'
import { DEFAULT_END_REACHED_THRESHOLD } from '../collection/shared/lib/end-reached'
import { isRowReorderActive } from '../collection/shared/lib/row-reorder'
import {
  aggregate,
  type DataTableAggregation,
  type DataTableAggregationLabels,
  type DataTableAggregations,
  type DataTableColumnMeta,
  defaultAggregationLabels,
} from './data-table-aggregation'
import { DataTableAggregationCell } from './data-table-aggregation-cell'
import { columnAlignClass } from './data-table-align'
import { DataTableBody } from './data-table-body'
import type { DataTableFeatures, DataTableTable } from './data-table-features'
import type { DataTableGroupCellContext } from './data-table-group-row'
import { DataTableResizeHandle } from './data-table-resize-handle'
import {
  type DataTableRowSkeletonAnatomy,
  DataTableSkeletonRows,
} from './data-table-skeleton-rows'
import type {
  CollectionDensity,
  DataTableRowDragAnnouncements,
  DataTableRowMove,
  DataTableTableMeta,
} from './data-table-types'
import { useHorizontalOverflow } from './use-horizontal-overflow'

export type { DataTableRowSkeletonAnatomy } from './data-table-skeleton-rows'

export type DataTableSelectionActionsProp<TData extends RowData> =
  SelectionActionsProp<TData>

export interface DataTableProps<TData extends RowData>
  extends Omit<ComponentProps<'table'>, 'children'> {
  table: DataTableTable<TData>
  loading?: boolean
  loadingAnatomy?: DataTableRowSkeletonAnatomy
  loadingCount?: number
  loadingLabel?: string
  emptyMessage?: string
  /** Moldura do DataGrid, para as duas views lerem como a mesma superfície. */
  bordered?: boolean
  aggregations?: DataTableAggregations
  defaultAggregations?: DataTableAggregations
  onAggregationsChange?: (aggregations: DataTableAggregations) => void
  aggregationLabels?: Partial<DataTableAggregationLabels>
  onRowOpen?: (row: Row<DataTableFeatures, TData>) => void
  getRowOpenLabel?: (row: Row<DataTableFeatures, TData>) => string
  getRowCanOpen?: (row: Row<DataTableFeatures, TData>) => boolean
  density?: CollectionDensity
  selectionActions?: DataTableSelectionActionsProp<TData>
  getRowGroup?: (row: TData) => string | null
  collapsedGroupIds?: readonly string[]
  defaultCollapsedGroupIds?: readonly string[]
  onCollapsedGroupIdsChange?: (groupIds: readonly string[]) => void
  renderGroupCell?: (context: DataTableGroupCellContext<TData>) => ReactNode
  getGroupToggleLabel?: (group: string, collapsed: boolean) => string
  onRowMove?: (move: DataTableRowMove) => void
  rowDragAnnouncements?: DataTableRowDragAnnouncements
  onEndReached?: () => void
  endReachedThreshold?: number
  loadingMore?: boolean
  loadingMoreRowCount?: number
}

const NO_GROUPS: readonly string[] = []
const FALLBACK_ROW_HEIGHT_PX = 40

const DENSITY_CLASS: Record<CollectionDensity, string | undefined> = {
  compact: '[&_tbody_td]:py-1.5',
  'extra-tall': '[&_tbody_td]:py-7',
  medium: '[&_tbody_td]:py-3.5',
  short: undefined,
  tall: '[&_tbody_td]:py-5',
}

const columnMetaOf = <TData,>(column: {
  columnDef: { meta?: unknown }
}): DataTableColumnMeta<TData> =>
  (column.columnDef.meta ?? {}) as DataTableColumnMeta<TData>

export function DataTable<TData extends RowData>({
  table,
  loading = false,
  loadingAnatomy = {},
  loadingCount = 5,
  loadingLabel = 'Carregando linha',
  emptyMessage = 'Nenhum registro para exibir.',
  bordered = true,
  aggregations: controlledAggregations,
  defaultAggregations = {},
  onAggregationsChange,
  aggregationLabels,
  onRowOpen,
  getRowOpenLabel,
  getRowCanOpen,
  density: densityProp,
  selectionActions,
  getRowGroup,
  collapsedGroupIds: controlledCollapsedGroupIds,
  defaultCollapsedGroupIds = NO_GROUPS,
  onCollapsedGroupIdsChange,
  renderGroupCell,
  getGroupToggleLabel,
  onRowMove,
  rowDragAnnouncements,
  onEndReached,
  endReachedThreshold = DEFAULT_END_REACHED_THRESHOLD,
  loadingMore = false,
  loadingMoreRowCount = 3,
  className,
  style,
  ...props
}: DataTableProps<TData>): ReactElement {
  const [uncontrolledAggregations, setUncontrolledAggregations] =
    useState<DataTableAggregations>(defaultAggregations)
  const aggregations = controlledAggregations ?? uncontrolledAggregations
  const labels = { ...defaultAggregationLabels, ...aggregationLabels }
  const changeAggregation = (
    columnId: string,
    aggregation: DataTableAggregation | null,
  ) => {
    const next = { ...aggregations, [columnId]: aggregation }
    if (controlledAggregations === undefined) setUncontrolledAggregations(next)
    onAggregationsChange?.(next)
  }
  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const columnCount = visibleColumns.length
  const linesColumnIndex = Math.max(
    visibleColumns.findIndex((column) => column.accessorFn),
    0,
  )
  const resizable = Boolean(table.options.enableColumnResizing)
  const fillColumnId = visibleColumns.at(-1)?.id
  const meta = table.options.meta
  const aggregatedRows: Row<DataTableFeatures, TData>[] =
    table.getPrePaginatedRowModel().rows
  const showAggregations = !loading && aggregatedRows.length > 0
  const hasFooter = table
    .getAllLeafColumns()
    .some(
      (column) =>
        column.columnDef.footer ||
        (showAggregations && columnMetaOf<TData>(column).aggregations?.length),
    )
  const density =
    densityProp ?? (meta as DataTableTableMeta | undefined)?.dataGridDensity
  const { collapsedGroupIds, setGroupCollapsed } = useCollapsedGroups({
    controlled: controlledCollapsedGroupIds,
    defaultValue: defaultCollapsedGroupIds,
    onChange: onCollapsedGroupIdsChange,
  })
  const onToggleGroup = useLatestCallback(setGroupCollapsed)
  const reorderActive = isRowReorderActive({
    enabled: Boolean(onRowMove),
    grouped: Boolean(getRowGroup),
    loading: loading,
    sorted: table.store.state.sorting.length > 0,
    virtualized: false,
  })
  const loadingMoreCount =
    loadingMore && !loading && rows.length > 0 ? loadingMoreRowCount : 0
  const [scrollContainerRef, overflow] = useHorizontalOverflow<HTMLDivElement>()
  useEndReached({
    enabled: Boolean(onEndReached) && !loading,
    loadingMore: loadingMoreCount > 0,
    measure: (viewport) => ({
      bottomInset:
        viewport
          .querySelector('[data-slot="table-footer"]')
          ?.getBoundingClientRect().height ?? 0,
      rowHeight:
        viewport.querySelector('tbody tr')?.getBoundingClientRect().height ||
        FALLBACK_ROW_HEIGHT_PX,
    }),
    onEndReached,
    rowCount: table.options.data.length,
    scrollRef: scrollContainerRef,
    threshold: endReachedThreshold,
  })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  useScrollbarInsets(
    scrollAreaRef,
    '[data-slot="table-header"]',
    '[data-slot="table-footer"]',
    hasFooter,
  )

  return (
    <div
      className="group/data-table relative flex min-h-0 min-w-0 flex-1 flex-col"
      data-overflow-end={overflow.end || undefined}
      data-overflow-start={overflow.start || undefined}
      data-slot="data-table"
    >
      <ScrollArea
        className={cn(
          'relative flex size-auto min-h-0 flex-1 flex-col',
          bordered && 'rounded-md border bg-background',
        )}
        clampContentMinWidth={false}
        ref={scrollAreaRef}
        verticalScrollbarProps={{ style: scrollbarInsetStyle }}
        viewportProps={{
          className: 'h-auto min-h-0 flex-1',
          'data-slot': 'data-table-viewport',
          ref: scrollContainerRef,
        }}
      >
        <Table
          aria-busy={loading || loadingMoreCount > 0 || undefined}
          data-density={density}
          render={
            <div
              className="overflow-x-visible!"
              data-bordered={bordered ? '' : undefined}
            />
          }
          className={cn(
            resizable &&
              'table-fixed [&_td]:overflow-hidden [&_td]:text-ellipsis [&_th]:overflow-hidden',
            density && DENSITY_CLASS[density],
            className,
          )}
          style={
            resizable ? { minWidth: table.getTotalSize(), ...style } : style
          }
          {...props}
        >
          {resizable ? (
            <colgroup>
              {visibleColumns.map((column) => (
                <col
                  key={column.id}
                  style={
                    column.id === fillColumnId
                      ? undefined
                      : { width: column.getSize() }
                  }
                />
              ))}
            </colgroup>
          ) : null}
          <TableHeader className="sticky top-0 z-10 not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-black)_2%)] dark:not-in-data-[variant=card]:bg-[color-mix(in_srgb,var(--card),var(--color-white)_2%)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className={
                      cn(
                        resizable && 'relative',
                        columnAlignClass(header.column),
                      ) || undefined
                    }
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {resizable &&
                    !header.isPlaceholder &&
                    header.subHeaders.length === 0 &&
                    header.column.id !== fillColumnId &&
                    header.column.getCanResize() ? (
                      <DataTableResizeHandle header={header} table={table} />
                    ) : null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {loading ? (
            <TableBody>
              <DataTableSkeletonRows
                label={loadingLabel}
                anatomy={loadingAnatomy}
                columnCount={columnCount}
                linesColumnIndex={linesColumnIndex}
                rowCount={loadingCount}
                scope="loading"
              />
            </TableBody>
          ) : rows.length ? (
            <DataTableBody
              collapsedGroupIds={collapsedGroupIds}
              getGroupToggleLabel={getGroupToggleLabel}
              getRowCanOpen={getRowCanOpen}
              getRowGroup={getRowGroup}
              getRowOpenLabel={getRowOpenLabel}
              loadingMore={
                loadingMoreCount > 0 ? (
                  <DataTableSkeletonRows
                    label={loadingLabel}
                    anatomy={loadingAnatomy}
                    columnCount={columnCount}
                    linesColumnIndex={linesColumnIndex}
                    loadingMore
                    rowCount={loadingMoreCount}
                    scope="loading-more"
                  />
                ) : null
              }
              meta={meta}
              onRowOpen={onRowOpen}
              onRowMove={onRowMove}
              onToggleGroup={onToggleGroup}
              renderGroupCell={renderGroupCell}
              reorderActive={reorderActive}
              rowDragAnnouncements={rowDragAnnouncements}
              rows={rows}
              table={table}
              visibleColumns={visibleColumns}
            />
          ) : (
            <TableBody>
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columnCount}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {hasFooter ? (
            <TableFooter className="sticky bottom-0 z-10">
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow className="group/footer" key={footerGroup.id}>
                  {footerGroup.headers.map((header) => {
                    const { column } = header
                    const meta = columnMetaOf<TData>(column)
                    const options = meta.aggregations ?? []
                    const selected = aggregations[column.id] ?? null
                    const aggregation =
                      selected && options.includes(selected) ? selected : null
                    const result =
                      aggregation === null
                        ? 0
                        : aggregate(aggregatedRows, aggregation, (row) =>
                            meta.getAggregationValue
                              ? meta.getAggregationValue(row.original)
                              : row.getValue(column.id),
                          )

                    const content =
                      header.isPlaceholder ? null : options.length === 0 ? (
                        flexRender(column.columnDef.footer, header.getContext())
                      ) : showAggregations ? (
                        <DataTableAggregationCell
                          align={meta.align}
                          labels={labels}
                          onValueChange={(next) =>
                            changeAggregation(column.id, next)
                          }
                          options={options}
                          result={
                            aggregation === null
                              ? null
                              : (meta.formatAggregation?.(
                                  result,
                                  aggregation,
                                ) ?? String(result))
                          }
                          value={aggregation}
                        />
                      ) : null

                    return <TableCell key={header.id}>{content}</TableCell>
                  })}
                </TableRow>
              ))}
            </TableFooter>
          ) : null}
        </Table>
      </ScrollArea>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-px start-px w-10 rounded-s-md bg-linear-to-r from-background to-transparent opacity-0 transition-opacity group-data-overflow-start/data-table:opacity-100 rtl:bg-linear-to-l"
        data-slot="data-table-overflow-start"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-px end-px w-10 rounded-e-md bg-linear-to-l from-background to-transparent opacity-0 transition-opacity group-data-overflow-end/data-table:opacity-100 rtl:bg-linear-to-r"
        data-slot="data-table-overflow-end"
      />
      <SelectionActions
        selectionActions={selectionActions}
        slot="data-table-selection-actions"
        table={table}
      />
    </div>
  )
}
