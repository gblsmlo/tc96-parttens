'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useMemo } from 'react'
import { createTableFormatter } from '../shared/format'
import { TableFrame } from '../shared/table-frame'
import { tableLoadState } from '../shared/table-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../shared/table-state'
import { TableToolbar } from '../shared/table-toolbar'
import { TableToolbarHeading } from '../shared/table-toolbar-heading'
import { resolveTable8Labels } from './labels'
import { createTable8Columns } from './table-8-columns'
import { createTable8SelectionActions } from './table-8-selection-actions'
import { Table8Skeleton } from './table-8-skeleton'
import { emptyTable8Filters, Table8Toolbar } from './table-8-toolbar'
import { Table8ViewSwitcher } from './table-8-view-switcher'
import type { Table8Props, Table8Transaction } from './types'

const selectionFromIds = (ids: readonly string[]) =>
  Object.fromEntries(ids.map((id) => [id, true] as const)) as Record<
    string,
    true
  >

const idsFromSelection = (selection: Record<string, boolean>) =>
  Object.keys(selection).filter((id) => selection[id])

export function Table8({
  activeViewId,
  className,
  columnVisibility,
  currency,
  density = 'tall',
  error,
  filters = emptyTable8Filters,
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
}: Readonly<Table8Props>) {
  const labels = useMemo(() => resolveTable8Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createTable8Columns({ formatter, labels }),
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

  const { table } = useDataTable<Table8Transaction>({
    columns,
    columnVisibility,
    data: transactions,
    density,
    enableRowSelection: true,
    enableSorting: true,
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

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Table8Skeleton label={labels.loading} />,
  })

  const selectionActions = useMemo(
    () =>
      createTable8SelectionActions({
        labels,
        onExportSelected,
        onFlag,
        onRefund,
      }),
    [labels, onExportSelected, onFlag, onRefund],
  )

  const toolbarLeft =
    views?.length && onViewChange ? (
      <Table8ViewSwitcher
        activeViewId={activeViewId}
        labels={labels}
        onViewChange={onViewChange}
        onViewCreate={onViewCreate}
        views={views}
      />
    ) : (
      <TableToolbarHeading
        description={
          loadState
            ? undefined
            : labels.loaded(
                formatter.number(loadedCount ?? transactions.length),
                formatter.number(totalCount),
              )
        }
        title={labels.title}
      />
    )

  return (
    <TableFrame
      className={className}
      data-block="table-8"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar aria-label={labels.toolbar} left={toolbarLeft} />
        ) : (
          <Table8Toolbar
            filters={filters}
            labels={labels}
            left={toolbarLeft}
            onExport={onExport}
            onFiltersChange={onFiltersChange}
            onRefresh={onRefresh}
            onSearchChange={onSearchChange}
            refreshing={refreshing}
            search={search}
            table={table}
          />
        )
      }
    >
      {loadState ?? (
        <div className="flex min-h-0 flex-col" style={{ maxHeight }}>
          <DataTable
            aria-label={labels.title}
            emptyMessage={labels.empty}
            endReachedThreshold={8}
            loadingMore={loadingMore}
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
          />
        </div>
      )}
    </TableFrame>
  )
}
