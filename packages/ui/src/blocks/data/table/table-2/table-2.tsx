'use client'

import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useMemo } from 'react'
import { createTableFormatter, defaultTableLocale } from '../shared/format'
import { TableFrame } from '../shared/table-frame'
import { tableLoadState } from '../shared/table-load-state'
import {
  pageSizeChoices,
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../shared/table-state'
import { TableToolbar } from '../shared/table-toolbar'
import { resolveTable2Labels } from './labels'
import { createTable2Columns } from './table-2-columns'
import { Table2Skeleton } from './table-2-skeleton'
import { Table2Toolbar } from './table-2-toolbar'
import type { Table2ColumnVisibility, Table2Member, Table2Props } from './types'

export const defaultTable2ColumnVisibility: Table2ColumnVisibility = {
  location: false,
  priority: false,
}

const defaultPageSizeOptions = [10, 20, 50]

export function Table2({
  activeViewId,
  className,
  columnVisibility,
  currency,
  density = 'tall',
  error,
  labels: labelsProp,
  locale = defaultTableLocale,
  members,
  onColumnVisibilityChange,
  onDensityChange,
  onRetry,
  onSave,
  onShowPausedChange,
  onSortChange,
  onViewChange,
  onViewCreate,
  pageSize = 10,
  pageSizeOptions = defaultPageSizeOptions,
  pending,
  showPaused = false,
  sort,
  views,
}: Readonly<Table2Props>) {
  const labels = useMemo(() => resolveTable2Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createTable2Columns({ formatter, labels }),
    [formatter, labels],
  )

  const controlledSorting = useMemo(
    () => (sort === undefined ? undefined : sortingFromSort(sort)),
    [sort],
  )
  const { table } = useDataTable<Table2Member>({
    columns,
    data: members,
    density,
    onDensityChange,
    enablePagination: true,
    enableSorting: true,
    getRowId: (member) => member.id,
    pageSize,
    sorting: controlledSorting,
    onSortingChange: onSortChange
      ? (sorting) => onSortChange(sortFromSorting(sorting))
      : undefined,
    columnVisibility: columnVisibility,
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (visibility) =>
          onColumnVisibilityChange(visibilityFromState(visibility))
      : undefined,
    tableOptions: {
      initialState: {
        columnVisibility: columnVisibility ?? defaultTable2ColumnVisibility,
      },
    },
  })

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Table2Skeleton label={labels.loading} />,
  })

  return (
    <TableFrame
      className={className}
      data-block="table-2"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar
            aria-label={labels.toolbar}
            description=""
            title={labels.title}
          />
        ) : (
          <Table2Toolbar
            activeViewId={activeViewId}
            description={labels.summary(table.getRowCount())}
            labels={labels}
            locale={locale}
            onSave={onSave}
            onShowPausedChange={onShowPausedChange}
            onViewChange={onViewChange}
            onViewCreate={onViewCreate}
            showPaused={showPaused}
            table={table}
            views={views}
          />
        )
      }
    >
      {loadState ?? (
        <>
          <DataTable
            aria-label={labels.title}
            emptyMessage={labels.empty}
            table={table}
          />
          <DataGridPagination
            pageSizeLabel={labels.pageSize}
            pageSizeOptions={pageSizeChoices(pageSizeOptions, pageSize)}
            table={table}
          />
        </>
      )}
    </TableFrame>
  )
}
