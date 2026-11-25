'use client'

import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useMemo } from 'react'
import { createTableFormatter } from '../../shared/table/format'
import { TableFrame } from '../../shared/table/table-frame'
import { tableLoadState } from '../../shared/table/table-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../../shared/table/table-state'
import { TableToolbar } from '../../shared/table/table-toolbar'
import { createFinance2Columns } from './finance-2-columns'
import { createFinance2SelectionActions } from './finance-2-selection-actions'
import { Finance2Skeleton } from './finance-2-skeleton'
import { emptyFinance2Filters, Finance2Toolbar } from './finance-2-toolbar'
import { Finance2ViewSwitcher } from './finance-2-view-switcher'
import { resolveFinance2Labels } from './labels'
import type { Finance2Props, Finance2Transaction } from './types'

const selectionFromIds = (ids: readonly string[]) =>
  Object.fromEntries(ids.map((id) => [id, true] as const)) as Record<
    string,
    true
  >

const idsFromSelection = (selection: Record<string, boolean>) =>
  Object.keys(selection).filter((id) => selection[id])

export function Finance2({
  activeViewId,
  className,
  columnVisibility,
  currency,
  density = 'tall',
  error,
  filters = emptyFinance2Filters,
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
}: Readonly<Finance2Props>) {
  const labels = useMemo(() => resolveFinance2Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createFinance2Columns({ formatter, labels }),
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

  const { table } = useDataTable<Finance2Transaction>({
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
    skeleton: <Finance2Skeleton label={labels.loading} />,
  })

  const selectionActions = useMemo(
    () =>
      createFinance2SelectionActions({
        labels,
        onExportSelected,
        onFlag,
        onRefund,
      }),
    [labels, onExportSelected, onFlag, onRefund],
  )

  const toolbarLeft =
    views?.length && onViewChange ? (
      <Finance2ViewSwitcher
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
    <TableFrame
      className={className}
      data-block="finance-2"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar aria-label={labels.toolbar} left={toolbarLeft} />
        ) : (
          <Finance2Toolbar
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
