'use client'

import type { PaginationState } from '@tanstack/react-table'
import { ActionBar } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { TableFrame } from '../shared/table-frame'
import { tableLoadState } from '../shared/table-load-state'
import {
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../shared/table-state'
import { TableToolbar } from '../shared/table-toolbar'
import { TableToolbarHeading } from '../shared/table-toolbar-heading'
import { TableViewSwitcher } from '../shared/table-view-switcher'
import { resolveTable1Labels } from './labels'
import { createTable1Columns } from './table-1-columns'
import { createTable1SelectionActions } from './table-1-selection-actions'
import { Table1Skeleton } from './table-1-skeleton'
import { Table1Toolbar } from './table-1-toolbar'
import type {
  Table1Props,
  Table1Queue,
  Table1Status,
  Table1Ticket,
} from './types'

export const defaultTable1PageSizeOptions: readonly number[] = [10, 20, 50]

const noOwners: NonNullable<Table1Props['owners']> = []

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

export function Table1({
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
  pageSizeOptions = defaultTable1PageSizeOptions,
  pending,
  queue: queueProp,
  rowActions,
  search,
  selectedIds,
  sort,
  status: statusProp,
  tickets,
  views,
}: Readonly<Table1Props>) {
  const labels = useMemo(() => resolveTable1Labels(labelsProp), [labelsProp])
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
      createTable1Columns({
        labels,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        rowActions,
      }),
    [handleRowAction, hasRowMenu, labels, rowActions],
  )

  const [queue, setQueue] = useControllable<Table1Queue | null>(
    queueProp,
    null,
    onQueueChange,
  )
  const [status, setStatus] = useControllable<Table1Status | null>(
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

  const { table } = useDataTable<Table1Ticket>({
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
      setQueue((find('queue') as Table1Queue | undefined) ?? null)
      setStatus((find('status') as Table1Status | undefined) ?? null)
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
    skeleton: <Table1Skeleton label={labels.loading} />,
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
      createTable1SelectionActions({
        labels,
        onAssignOwner,
        onStatusUpdate,
        owners,
      }),
    [labels, onAssignOwner, onStatusUpdate, owners],
  )

  const changeQueue = (next: Table1Queue | null) => {
    setQueue(next)
    setPageIndex(0)
  }
  const changeStatus = (next: Table1Status | null) => {
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
    <TableToolbarHeading
      description={loadState ? undefined : description}
      title={labels.title}
    />
  )

  return (
    <TableFrame
      className={className}
      data-block="table-1"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar aria-label={labels.toolbar} left={toolbarLeft} />
        ) : (
          <Table1Toolbar
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
