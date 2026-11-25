'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useMemo } from 'react'
import { createTableFormatter } from '../../shared/grid/format'
import { GridFrame } from '../../shared/grid/grid-frame'
import { gridLoadState } from '../../shared/grid/grid-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../../shared/grid/grid-state'
import { GridToolbar } from '../../shared/grid/grid-toolbar'
import { createFinance1Columns } from './finance-1-columns'
import { createFinance1SelectionActions } from './finance-1-selection-actions'
import { Finance1Skeleton } from './finance-1-skeleton'
import { emptyFinance1Filters, Finance1Toolbar } from './finance-1-toolbar'
import { Finance1ViewSwitcher } from './finance-1-view-switcher'
import { resolveFinance1Labels } from './labels'
import type { Finance1Props, Finance1Transaction } from './types'

const selectionFromIds = (ids: readonly string[]) =>
  Object.fromEntries(ids.map((id) => [id, true] as const)) as Record<
    string,
    true
  >

const idsFromSelection = (selection: Record<string, boolean>) =>
  Object.keys(selection).filter((id) => selection[id])

export function Finance1({
  activeViewId,
  className,
  columnVisibility,
  currency,
  density = 'tall',
  error,
  filters = emptyFinance1Filters,
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
}: Readonly<Finance1Props>) {
  const labels = useMemo(() => resolveFinance1Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createFinance1Columns({ formatter, labels }),
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

  const { table } = useDataGrid<Finance1Transaction>({
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
    skeleton: <Finance1Skeleton label={labels.loading} />,
  })

  const selectionActions = useMemo(
    () =>
      createFinance1SelectionActions({
        labels,
        onExportSelected,
        onFlag,
        onRefund,
      }),
    [labels, onExportSelected, onFlag, onRefund],
  )

  const toolbarLeft =
    views?.length && onViewChange ? (
      <Finance1ViewSwitcher
        activeViewId={activeViewId}
        labels={labels}
        onViewChange={onViewChange}
        onViewCreate={onViewCreate}
        views={views}
      />
    ) : (
      <CollectionToolbarHeading>
        <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
        <CollectionToolbarDescription>
          {loadState
            ? undefined
            : labels.loaded(
                formatter.number(loadedCount ?? transactions.length),
                formatter.number(totalCount),
              )}
        </CollectionToolbarDescription>
      </CollectionToolbarHeading>
    )

  return (
    <GridFrame
      className={className}
      data-block="finance-1"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar aria-label={labels.toolbar} left={toolbarLeft} />
        ) : (
          <Finance1Toolbar
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
