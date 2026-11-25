'use client'

import { DataGrid } from '@tc96/ui/patterns/data-grid/components/data-grid'
import { DataGridPagination } from '@tc96/ui/patterns/data-grid/components/data-grid-pagination'
import { useDataGrid } from '@tc96/ui/patterns/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useMemo } from 'react'
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
import { resolveTeam1Labels } from './labels'
import { createTeam1Columns } from './team-1-columns'
import { Team1Skeleton } from './team-1-skeleton'
import { Team1Toolbar } from './team-1-toolbar'
import type { Team1ColumnVisibility, Team1Member, Team1Props } from './types'

export const defaultTeam1ColumnVisibility: Team1ColumnVisibility = {
  location: false,
  priority: false,
}

const defaultPageSizeOptions = [10, 20, 50]

export function Team1({
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
}: Readonly<Team1Props>) {
  const labels = useMemo(() => resolveTeam1Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createTeam1Columns({ formatter, labels, locale }),
    [formatter, labels, locale],
  )

  const controlledSorting = useMemo(
    () => (sort === undefined ? undefined : sortingFromSort(sort)),
    [sort],
  )
  const { table } = useDataGrid<Team1Member>({
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
        columnVisibility: columnVisibility ?? defaultTeam1ColumnVisibility,
      },
    },
  })

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Team1Skeleton label={labels.loading} />,
  })

  return (
    <GridFrame
      className={className}
      data-block="team-1"
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
          <Team1Toolbar
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
