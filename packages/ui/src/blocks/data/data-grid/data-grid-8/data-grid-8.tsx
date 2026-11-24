'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { useMemo } from 'react'
import { createTableFormatter } from '../shared/format'
import { GridFrame } from '../shared/grid-frame'
import { gridLoadState } from '../shared/grid-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../shared/grid-state'
import { GridToolbar } from '../shared/grid-toolbar'
import { createDataGrid8Columns } from './data-grid-8-columns'
import { createDataGrid8SelectionActions } from './data-grid-8-selection-actions'
import { DataGrid8Skeleton } from './data-grid-8-skeleton'
import { DataGrid8Toolbar, emptyDataGrid8Filters } from './data-grid-8-toolbar'
import { resolveDataGrid8Labels } from './labels'
import type { DataGrid8Props, DataGrid8Transaction } from './types'

const selectionFromIds = (ids: readonly string[]) =>
  Object.fromEntries(ids.map((id) => [id, true] as const)) as Record<
    string,
    true
  >

const idsFromSelection = (selection: Record<string, boolean>) =>
  Object.keys(selection).filter((id) => selection[id])

export function DataGrid8({
  activeViewId,
  className,
  columnVisibility,
  currency,
  density = 'tall',
  error,
  filters = emptyDataGrid8Filters,
  hasMore = false,
  labels: labelsProp,
  loadedCount,
  loadingMore = false,
  locale,
  maxHeight = 560,
  onColumnVisibilityChange,
  onDensityChange,
  onExport,
  onExportSelected,
  onFiltersChange,
  onFlag,
  onLoadMore,
  onRefresh,
  onRefund,
  onRetry,
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onViewChange,
  onViewCreate,
  pending,
  refreshing = false,
  search = '',
  selectedIds,
  sort,
  totalCount,
  transactions,
  views,
}: Readonly<DataGrid8Props>) {
  const labels = useMemo(() => resolveDataGrid8Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createDataGrid8Columns({ formatter, labels }),
    [formatter, labels],
  )
  const controlledSorting = useMemo(
    () => (sort === undefined ? undefined : sortingFromSort(sort)),
    [sort],
  )
  const controlledSelection = useMemo(
    () => (selectedIds ? selectionFromIds(selectedIds) : undefined),
    [selectedIds],
  )

  const { table } = useDataGrid<DataGrid8Transaction>({
    columns,
    columnVisibility,
    data: transactions,
    density,
    enableRowSelection: true,
    getRowId: (transaction) => transaction.id,
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (visibility) =>
          onColumnVisibilityChange(visibilityFromState(visibility))
      : undefined,
    onDensityChange,
    onRowSelectionChange: onSelectedIdsChange
      ? (selection) => onSelectedIdsChange(idsFromSelection(selection))
      : undefined,
    onSortingChange: onSortChange
      ? (sorting) => onSortChange(sortFromSorting(sorting))
      : undefined,
    rowSelection: controlledSelection,
    sorting: controlledSorting,
    tableOptions: { manualFiltering: true, manualSorting: true },
  })

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <DataGrid8Skeleton label={labels.loading} />,
  })

  const selectionActions = useMemo(
    () =>
      createDataGrid8SelectionActions({
        labels,
        onExportSelected,
        onFlag,
        onRefund,
      }),
    [labels, onExportSelected, onFlag, onRefund],
  )

  return (
    <GridFrame
      className={className}
      data-block="data-grid-8"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar
            aria-label={labels.toolbar}
            description=""
            title={labels.title}
          />
        ) : (
          <DataGrid8Toolbar
            activeViewId={activeViewId}
            description={labels.loaded(
              formatter.number(loadedCount ?? transactions.length),
              formatter.number(totalCount),
            )}
            filters={filters}
            labels={labels}
            onExport={onExport}
            onFiltersChange={onFiltersChange}
            onRefresh={onRefresh}
            onSearchChange={onSearchChange}
            onViewChange={onViewChange}
            onViewCreate={onViewCreate}
            refreshing={refreshing}
            search={search}
            table={table}
            views={views}
          />
        )
      }
    >
      {loadState ?? (
        <DataGrid
          aria-label={labels.title}
          emptyMessage={labels.empty}
          endReachedThreshold={8}
          loadingMore={loadingMore}
          maxHeight={maxHeight}
          onEndReached={hasMore && onLoadMore ? onLoadMore : undefined}
          selectionActions={({
            clearSelection,
            selectedCount,
            selectedRows,
          }) => (
            <ActionBar
              actions={selectionActions}
              clearSelectionLabel={labels.clearSelection}
              formatSelection={(count) =>
                labels.selected(
                  count,
                  formatter.compactMoney(
                    selectedRows.reduce(
                      (total, transaction) => total + transaction.amount,
                      0,
                    ),
                  ),
                )
              }
              label={labels.selectionActions}
              onClearSelection={clearSelection}
              selectedCount={selectedCount}
              selectedRows={selectedRows}
            />
          )}
          table={table}
          virtualize
        />
      )}
    </GridFrame>
  )
}
