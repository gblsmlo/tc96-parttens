'use client'

import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useMemo } from 'react'
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
import { createDataGrid2Columns } from './data-grid-2-columns'
import { DataGrid2Skeleton } from './data-grid-2-skeleton'
import { DataGrid2Toolbar } from './data-grid-2-toolbar'
import { resolveDataGrid2Labels } from './labels'
import type {
  DataGrid2ColumnVisibility,
  DataGrid2Member,
  DataGrid2Props,
} from './types'

export const defaultDataGrid2ColumnVisibility: DataGrid2ColumnVisibility = {
  location: false,
  priority: false,
}

const defaultPageSizeOptions = [10, 20, 50]

export function DataGrid2({
  className,
  columnVisibility,
  currency,
  density = 'tall',
  error,
  labels: labelsProp,
  locale = defaultGridLocale,
  members,
  onColumnVisibilityChange,
  onDensityChange,
  onRetry,
  onSave,
  onShowPausedChange,
  onSortChange,
  pageSize = 10,
  pageSizeOptions = defaultPageSizeOptions,
  pending,
  showPaused = false,
  sort,
}: Readonly<DataGrid2Props>) {
  const labels = useMemo(() => resolveDataGrid2Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createDataGrid2Columns({ formatter, labels }),
    [formatter, labels],
  )

  const controlledSorting = useMemo(
    () => (sort === undefined ? undefined : sortingFromSort(sort)),
    [sort],
  )
  const { table } = useDataGrid<DataGrid2Member>({
    columns,
    data: members,
    density,
    onDensityChange,
    enablePagination: true,
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
        columnVisibility: columnVisibility ?? defaultDataGrid2ColumnVisibility,
      },
    },
  })

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <DataGrid2Skeleton label={labels.loading} />,
  })

  return (
    <GridFrame
      className={className}
      data-block="data-grid-2"
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
          <DataGrid2Toolbar
            description={labels.summary(table.getRowCount())}
            labels={labels}
            onSave={onSave}
            onShowPausedChange={onShowPausedChange}
            showPaused={showPaused}
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
              pageSizeLabel={labels.pageSize}
              pageSizeOptions={pageSizeChoices(pageSizeOptions, pageSize)}
              table={table}
            />
          }
          table={table}
        />
      )}
    </GridFrame>
  )
}
