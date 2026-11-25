'use client'

import type { PaginationState } from '@tanstack/react-table'
import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { TableFrame } from '../../shared/table/table-frame'
import { tableLoadState } from '../../shared/table/table-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../../shared/table/table-state'
import { TableToolbar } from '../../shared/table/table-toolbar'
import { TableViewSwitcher } from '../../shared/table/table-view-switcher'
import { resolveSupport2Labels } from './labels'
import { createSupport2Columns } from './support-2-columns'
import { createSupport2SelectionActions } from './support-2-selection-actions'
import { Support2Skeleton } from './support-2-skeleton'
import { Support2Toolbar } from './support-2-toolbar'
import type {
  Support2Props,
  Support2Queue,
  Support2Status,
  Support2Ticket,
} from './types'

export const defaultSupport2PageSizeOptions: readonly number[] = [10, 20, 50]

const noOwners: NonNullable<Support2Props['owners']> = []

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

export function Support2({
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
  onSearchChange,
  onSelectedIdsChange,
  onSortChange,
  onStatusChange,
  onStatusUpdate,
  onViewChange,
  onViewCreate,
  owners = noOwners,
  pageSize: pageSizeProp,
  pageSizeOptions = defaultSupport2PageSizeOptions,
  pending,
  queue: queueProp,
  rowActions,
  search,
  selectedIds,
  sort,
  status: statusProp,
  tickets,
  views,
}: Readonly<Support2Props>) {
  const labels = useMemo(() => resolveSupport2Labels(labelsProp), [labelsProp])
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
      createSupport2Columns({
        labels,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        rowActions,
      }),
    [handleRowAction, hasRowMenu, labels, rowActions],
  )

  const [queue, setQueue] = useControllable<Support2Queue | null>(
    queueProp,
    null,
    onQueueChange,
  )
  const [status, setStatus] = useControllable<Support2Status | null>(
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

  const { table } = useDataTable<Support2Ticket>({
    columnFilters,
    columns,
    columnVisibility,
    data: tickets,
    density,
    enablePagination: true,
    enableRowSelection: true,
    enableSorting: true,
    getRowId: (ticket) => ticket.id,
    globalFilter: search,
    onColumnFiltersChange: (filters) => {
      const find = (id: string) =>
        filters.find((filter) => filter.id === id)?.value
      setQueue((find('queue') as Support2Queue | undefined) ?? null)
      setStatus((find('status') as Support2Status | undefined) ?? null)
      setPageIndex(0)
    },
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (visibility) =>
          onColumnVisibilityChange(visibilityFromState(visibility))
      : undefined,
    onDensityChange: onDensityChange
      ? (next) => onDensityChange(next)
      : undefined,
    onGlobalFilterChange: onSearchChange
      ? (value) => onSearchChange(String(value ?? ''))
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

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Support2Skeleton label={labels.loading} />,
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
      createSupport2SelectionActions({
        labels,
        onAssignOwner,
        onStatusUpdate,
        owners,
      }),
    [labels, onAssignOwner, onStatusUpdate, owners],
  )

  const changeQueue = (next: Support2Queue | null) => {
    setQueue(next)
    setPageIndex(0)
  }
  const changeStatus = (next: Support2Status | null) => {
    setStatus(next)
    setPageIndex(0)
  }

  const toolbarLeft = views?.length ? (
    <TableViewSwitcher
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
    <TableFrame
      className={className}
      data-block="support-2"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar aria-label={labels.toolbar} left={toolbarLeft} />
        ) : (
          <Support2Toolbar
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
        <>
          <DataTable
            aria-label={labels.title}
            emptyMessage={labels.empty}
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
          <DataGridPagination
            pageSizeLabel={labels.rowsPerPage}
            pageSizeOptions={pageSizeOptions}
            table={table}
          />
        </>
      )}
    </TableFrame>
  )
}
