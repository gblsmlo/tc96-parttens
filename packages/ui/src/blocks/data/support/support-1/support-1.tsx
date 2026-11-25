'use client'

import type { PaginationState } from '@tanstack/react-table'
import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { GridFrame } from '../../shared/grid/grid-frame'
import { gridLoadState } from '../../shared/grid/grid-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../../shared/grid/grid-state'
import { GridToolbar } from '../../shared/grid/grid-toolbar'
import { GridViewSwitcher } from '../../shared/grid/grid-view-switcher'
import { resolveSupport1Labels } from './labels'
import { createSupport1Columns } from './support-1-columns'
import { createSupport1SelectionActions } from './support-1-selection-actions'
import { Support1Skeleton } from './support-1-skeleton'
import { Support1Toolbar } from './support-1-toolbar'
import type {
  Support1Props,
  Support1Queue,
  Support1Status,
  Support1Ticket,
} from './types'

export const defaultSupport1PageSizeOptions: readonly number[] = [10, 20, 50]

const noOwners: NonNullable<Support1Props['owners']> = []

function useControllable<TValue>(
  controlled: TValue | undefined,
  initial: TValue,
  onChange: ((value: TValue) => void) | undefined,
): [TValue, (value: TValue) => void] {
  const [local, setLocal] = useState(initial)
  const value = controlled === undefined ? local : controlled
  const setValue = useCallback(
    (next: TValue) => {
      setLocal(next)
      onChange?.(next)
    },
    [onChange],
  )
  return [value, setValue]
}

export function Support1({
  activeViewId,
  className,
  columnVisibility,
  density = 'tall',
  error,
  labels: labelsProp,
  locale,
  onAssignOwner,
  onColumnVisibilityChange,
  onCreate,
  onDensityChange,
  onExport,
  onPageSizeChange,
  onQueueChange,
  onRetry,
  onRowAction,
  onSaveView,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusUpdate,
  onViewChange,
  onViewCreate,
  owners = noOwners,
  pageSize: pageSizeProp,
  pageSizeOptions = defaultSupport1PageSizeOptions,
  pending,
  queue: queueProp,
  rowActions,
  selectedIds,
  sort,
  status: statusProp,
  tickets,
  views,
}: Readonly<Support1Props>) {
  const labels = useMemo(() => resolveSupport1Labels(labelsProp), [labelsProp])
  const rowActionRef = useRef(onRowAction)
  useLayoutEffect(() => {
    rowActionRef.current = onRowAction
  })
  const handleRowAction = useCallback(
    (actionId: string, ticketId: string) =>
      rowActionRef.current?.(actionId, ticketId),
    [],
  )
  const hasRowMenu = Boolean(onRowAction)
  const columns = useMemo(
    () =>
      createSupport1Columns({
        labels,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        rowActions,
      }),
    [handleRowAction, hasRowMenu, labels, rowActions],
  )

  const [queue, setQueue] = useControllable<Support1Queue | null>(
    queueProp,
    null,
    onQueueChange,
  )
  const [status, setStatus] = useControllable<Support1Status | null>(
    statusProp,
    null,
    onStatusChange,
  )
  const [pageSize, setPageSize] = useControllable(
    pageSizeProp,
    pageSizeOptions[0] ?? 10,
    onPageSizeChange,
  )
  const [pageIndex, setPageIndex] = useState(0)
  const pagination = useMemo<PaginationState>(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize],
  )
  const columnFilters = useMemo(
    () => [
      ...(queue ? [{ id: 'queue', value: queue }] : []),
      ...(status ? [{ id: 'status', value: status }] : []),
    ],
    [queue, status],
  )
  const controlledSorting = useMemo(
    () => (sort === undefined ? undefined : sortingFromSort(sort)),
    [sort],
  )
  const controlledSelection = useMemo(
    () =>
      selectedIds === undefined
        ? undefined
        : Object.fromEntries(selectedIds.map((id) => [id, true as const])),
    [selectedIds],
  )

  const { table } = useDataGrid<Support1Ticket>({
    columnFilters,
    columns,
    columnVisibility,
    data: tickets,
    density,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (ticket) => ticket.id,
    onColumnFiltersChange: (filters) => {
      const find = (id: string) =>
        filters.find((filter) => filter.id === id)?.value
      setQueue((find('queue') as Support1Queue | undefined) ?? null)
      setStatus((find('status') as Support1Status | undefined) ?? null)
      setPageIndex(0)
    },
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (visibility) =>
          onColumnVisibilityChange(visibilityFromState(visibility))
      : undefined,
    onDensityChange: onDensityChange
      ? (next) => onDensityChange(next)
      : undefined,
    onPaginationChange: (next) => {
      if (next.pageSize !== pageSize) {
        setPageSize(next.pageSize)
        setPageIndex(0)
        return
      }
      setPageIndex(next.pageIndex)
    },
    onRowSelectionChange: onSelectedIdsChange
      ? (selection) =>
          onSelectedIdsChange(
            Object.keys(selection).filter((id) => selection[id]),
          )
      : undefined,
    onSortingChange: onSortChange
      ? (sorting) => onSortChange(sortFromSorting(sorting))
      : undefined,
    pagination,
    rowSelection: controlledSelection,
    sorting: controlledSorting,
  })

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Support1Skeleton label={labels.loading} />,
  })

  const visibleTickets = table
    .getFilteredRowModel()
    .rows.map((row) => row.original)
  const description = labels.summary(
    visibleTickets.length,
    visibleTickets.filter((ticket) => ticket.ownerId === null).length,
    visibleTickets.filter(
      (ticket) =>
        ticket.sla.tone === 'breached' || ticket.sla.tone === 'warning',
    ).length,
  )
  const selectionActions = useMemo(
    () =>
      createSupport1SelectionActions({
        labels,
        onAssignOwner,
        onStatusUpdate,
        owners,
      }),
    [labels, onAssignOwner, onStatusUpdate, owners],
  )

  const changeQueue = (next: Support1Queue | null) => {
    setQueue(next)
    setPageIndex(0)
  }
  const changeStatus = (next: Support1Status | null) => {
    setStatus(next)
    setPageIndex(0)
  }

  const toolbarLeft = views?.length ? (
    <GridViewSwitcher
      activeViewId={activeViewId}
      labels={labels}
      locale={locale}
      onViewChange={onViewChange}
      onViewCreate={onViewCreate}
      views={views}
    />
  ) : (
    <CollectionToolbarHeading>
      <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
      <CollectionToolbarDescription>
        {loadState ? undefined : description}
      </CollectionToolbarDescription>
    </CollectionToolbarHeading>
  )

  return (
    <GridFrame
      className={className}
      data-block="support-1"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar aria-label={labels.toolbar} left={toolbarLeft} />
        ) : (
          <Support1Toolbar
            labels={labels}
            left={toolbarLeft}
            onCreate={onCreate}
            onExport={onExport}
            onQueueChange={changeQueue}
            onSaveView={onSaveView}
            onStatusChange={changeStatus}
            queue={queue}
            status={status}
            table={table}
          />
        )
      }
    >
      {loadState ?? (
        <DataGrid
          aria-label={labels.title}
          emptyMessage={labels.empty}
          footer={
            <DataGridPagination
              pageSizeLabel={labels.rowsPerPage}
              pageSizeOptions={pageSizeOptions}
              table={table}
            />
          }
          selectionActions={({
            clearSelection,
            selectedCount,
            selectedRows,
          }) => (
            <ActionBar
              actions={selectionActions}
              clearSelectionLabel={labels.clearSelection}
              formatSelection={labels.selectedCount}
              label={labels.selectionActions}
              onClearSelection={clearSelection}
              selectedCount={selectedCount}
              selectedRows={selectedRows}
            />
          )}
          table={table}
        />
      )}
    </GridFrame>
  )
}
