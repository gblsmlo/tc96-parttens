'use client'

import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useMemo } from 'react'
import {
  createTableFormatter,
  defaultTableLocale,
} from '../../shared/table/format'
import { TableFrame } from '../../shared/table/table-frame'
import { tableLoadState } from '../../shared/table/table-load-state'
import {
  pageSizeChoices,
  sortFromSorting,
  sortingFromSort,
  visibilityFromState,
} from '../../shared/table/table-state'
import { TableToolbar } from '../../shared/table/table-toolbar'
import { resolveTeam2Labels } from './labels'
import { createTeam2Columns } from './team-2-columns'
import { Team2Skeleton } from './team-2-skeleton'
import { Team2Toolbar } from './team-2-toolbar'
import type { Team2ColumnVisibility, Team2Member, Team2Props } from './types'

export const defaultTeam2ColumnVisibility: Team2ColumnVisibility = {
  location: false,
  priority: false,
}

const defaultPageSizeOptions = [10, 20, 50]

export function Team2({
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
  pageSize = 10,
  pageSizeOptions = defaultPageSizeOptions,
  pending,
  showPaused = false,
  sort,
}: Readonly<Team2Props>) {
  const labels = useMemo(() => resolveTeam2Labels(labelsProp), [labelsProp])
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const columns = useMemo(
    () => createTeam2Columns({ formatter, labels, locale }),
    [formatter, labels, locale],
  )

  const controlledSorting = useMemo(
    () => (sort === undefined ? undefined : sortingFromSort(sort)),
    [sort],
  )
  const { table } = useDataTable<Team2Member>({
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
        columnVisibility: columnVisibility ?? defaultTeam2ColumnVisibility,
      },
    },
  })

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Team2Skeleton label={labels.loading} />,
  })

  return (
    <TableFrame
      className={className}
      data-block="team-2"
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
          <Team2Toolbar
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
