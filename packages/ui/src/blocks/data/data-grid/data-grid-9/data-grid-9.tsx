'use client'

import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { createTableFormatter, defaultGridLocale } from '../shared/format'
import { GridFrame } from '../shared/grid-frame'
import { gridLoadState } from '../shared/grid-load-state'
import {
  pageSizeChoices,
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../shared/grid-state'
import { GridToolbar } from '../shared/grid-toolbar'
import { createDataGrid9Columns } from './data-grid-9-columns'
import { DataGrid9Kpis } from './data-grid-9-kpis'
import { DataGrid9Skeleton } from './data-grid-9-skeleton'
import { DataGrid9Toolbar } from './data-grid-9-toolbar'
import { resolveDataGrid9Labels } from './labels'
import type {
  DataGrid9Campaign,
  DataGrid9ColumnVisibility,
  DataGrid9Props,
} from './types'

const defaultPageSizeOptions = [10, 20, 50]

export function DataGrid9({
  activeViewId,
  campaigns,
  className,
  columnVisibility,
  currency,
  density = 'tall',
  error,
  labels: labelsProp,
  locale = defaultGridLocale,
  onColumnVisibilityChange,
  onCreate,
  onDensityChange,
  onExport,
  onRetry,
  onRowAction,
  onSortChange,
  onViewChange,
  onViewCreate,
  pageSize = 10,
  pageSizeOptions = defaultPageSizeOptions,
  pending,
  period,
  rowActions,
  sort,
  summary,
  views,
}: Readonly<DataGrid9Props>) {
  const labels = useMemo(() => resolveDataGrid9Labels(labelsProp), [labelsProp])
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
      createDataGrid9Columns({
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
  const { table } = useDataGrid<DataGrid9Campaign>({
    columns,
    data: campaigns,
    density,
    onDensityChange,
    enablePagination: true,
    getRowId: (campaign) => campaign.id,
    pageSize,
    sorting: controlledSorting,
    onSortingChange: onSortChange
      ? (sorting) => onSortChange(sortFromSorting(sorting))
      : undefined,
    columnVisibility: columnVisibility as DataGrid9ColumnVisibility | undefined,
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (visibility) =>
          onColumnVisibilityChange(visibilityFromState(visibility))
      : undefined,
    tableOptions: {
      initialState: { columnVisibility: columnVisibility ?? {} },
    },
  })

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <DataGrid9Skeleton label={labels.loading} />,
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
    <GridFrame
      className={className}
      data-block="data-grid-9"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar
            aria-label={labels.toolbar}
            description=""
            title={labels.title}
          />
        ) : (
          <DataGrid9Toolbar
            activeViewId={activeViewId}
            description={description}
            labels={labels}
            locale={locale}
            onCreate={onCreate}
            onExport={onExport}
            onViewChange={onViewChange}
            onViewCreate={onViewCreate}
            table={table}
            views={views}
          />
        )
      }
    >
      {loadState ?? (
        <>
          <DataGrid9Kpis
            formatter={formatter}
            labels={labels}
            summary={summary}
            total={campaigns.length}
          />
          <DataGrid
            aria-label={labels.title}
            emptyMessage={labels.empty}
            footer={
              <DataGridPagination
                pageSizeLabel={labels.pageSize}
                pageSizeOptions={pageSizeChoices(pageSizeOptions, pageSize)}
                table={table}
              />
            }
            table={table}
          />
        </>
      )}
    </GridFrame>
  )
}
