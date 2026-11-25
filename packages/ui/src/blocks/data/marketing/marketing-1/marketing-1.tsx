'use client'

import { DataGrid } from '@tc96/ui/patterns/data-grid/components/data-grid'
import { DataGridPagination } from '@tc96/ui/patterns/data-grid/components/data-grid-pagination'
import { useDataGrid } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import {
  createTableFormatter,
  defaultGridLocale,
} from '../../shared/grid/format'
import { GridFrame } from '../../shared/grid/grid-frame'
import { gridLoadState } from '../../shared/grid/grid-load-state'
import {
  pageSizeChoices,
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../../shared/grid/grid-state'
import { GridToolbar } from '../../shared/grid/grid-toolbar'
import { resolveMarketing1Labels } from './labels'
import { createMarketing1Columns } from './marketing-1-columns'
import { Marketing1Kpis } from './marketing-1-kpis'
import { Marketing1Skeleton } from './marketing-1-skeleton'
import { Marketing1Toolbar } from './marketing-1-toolbar'
import type {
  Marketing1Campaign,
  Marketing1ColumnVisibility,
  Marketing1Props,
} from './types'

const defaultPageSizeOptions = [10, 20, 50]

export function Marketing1({
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
  pageSize = 10,
  pageSizeOptions = defaultPageSizeOptions,
  pending,
  period,
  rowActions,
  sort,
  summary,
}: Readonly<Marketing1Props>) {
  const labels = useMemo(
    () => resolveMarketing1Labels(labelsProp),
    [labelsProp],
  )
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
      createMarketing1Columns({
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
  const { table } = useDataGrid<Marketing1Campaign>({
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
    columnVisibility: columnVisibility as
      | Marketing1ColumnVisibility
      | undefined,
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
    skeleton: <Marketing1Skeleton label={labels.loading} />,
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
      data-block="marketing-1"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar
            aria-label={labels.toolbar}
            left={
              <CollectionToolbarHeading>
                <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
              </CollectionToolbarHeading>
            }
          />
        ) : (
          <Marketing1Toolbar
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
          <Marketing1Kpis
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
