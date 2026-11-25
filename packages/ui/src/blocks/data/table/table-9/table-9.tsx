'use client'

import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
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
import { resolveTable9Labels } from './labels'
import { createTable9Columns } from './table-9-columns'
import { Table9Kpis } from './table-9-kpis'
import { Table9Skeleton } from './table-9-skeleton'
import { Table9Toolbar } from './table-9-toolbar'
import type {
  Table9Campaign,
  Table9ColumnVisibility,
  Table9Props,
} from './types'

const defaultPageSizeOptions = [10, 20, 50]

export function Table9({
  campaigns,
  className,
  columnVisibility,
  currency,
  density = 'tall',
  error,
  labels: labelsProp,
  locale = defaultTableLocale,
  onColumnVisibilityChange,
  onCreate,
  onDensityChange,
  onExport,
  onRetry,
  onRowAction,
  onSortChange,
  pageSize = 10,
  pageSizeOptions = defaultPageSizeOptions,
  pending,
  period,
  rowActions,
  sort,
  summary,
}: Readonly<Table9Props>) {
  const labels = useMemo(() => resolveTable9Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const rowActionRef = useRef(onRowAction)
  useLayoutEffect(() => {
    rowActionRef.current = onRowAction
  })
  const handleRowAction = useCallback(
    (actionId: string, campaignId: string) =>
      rowActionRef.current?.(actionId, campaignId),
    [],
  )
  const hasRowMenu = Boolean(onRowAction)
  const columns = useMemo(
    () =>
      createTable9Columns({
        formatter,
        labels,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        rowActions,
      }),
    [formatter, handleRowAction, hasRowMenu, labels, rowActions],
  )

  const controlledSorting = useMemo(
    () => (sort === undefined ? undefined : sortingFromSort(sort)),
    [sort],
  )
  const { table } = useDataTable<Table9Campaign>({
    columns,
    data: campaigns,
    density,
    onDensityChange,
    enablePagination: true,
    enableSorting: true,
    getRowId: (campaign) => campaign.id,
    pageSize,
    sorting: controlledSorting,
    onSortingChange: onSortChange
      ? (sorting) => onSortChange(sortFromSorting(sorting))
      : undefined,
    columnVisibility: columnVisibility as Table9ColumnVisibility | undefined,
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (visibility) =>
          onColumnVisibilityChange(visibilityFromState(visibility))
      : undefined,
    tableOptions: {
      initialState: { columnVisibility: columnVisibility ?? {} },
    },
  })

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Table9Skeleton label={labels.loading} />,
  })

  const activeInView = table
    .getFilteredRowModel()
    .rows.filter((row) => row.original.status === 'active').length
  const description = labels.subtitle(
    campaigns.length,
    activeInView,
    labels.period(
      formatter.shortDate(period.from),
      formatter.shortDate(period.to),
    ),
  )

  return (
    <TableFrame
      className={className}
      data-block="table-9"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar
            aria-label={labels.toolbar}
            left={
              <CollectionToolbarHeading>
                <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
              </CollectionToolbarHeading>
            }
          />
        ) : (
          <Table9Toolbar
            description={description}
            labels={labels}
            onCreate={onCreate}
            onExport={onExport}
            table={table}
          />
        )
      }
    >
      {loadState ?? (
        <>
          <Table9Kpis
            formatter={formatter}
            labels={labels}
            summary={summary}
            total={campaigns.length}
          />
          <div className="grid gap-2">
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
          </div>
        </>
      )}
    </TableFrame>
  )
}
