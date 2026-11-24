'use client'

import { Badge } from '@tc96/ui/badge'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { TableFrame } from '../shared/table-frame'
import { tableLoadState } from '../shared/table-load-state'
import { sortFromSorting, sortingFromSort } from '../shared/table-state'
import { TableToolbar } from '../shared/table-toolbar'
import { resolveTable5Labels } from './labels'
import { createTable5Columns } from './table-5-columns'
import { Table5Skeleton } from './table-5-skeleton'
import { Table5Toolbar } from './table-5-toolbar'
import type { Table5Props, Table5Task, Table5View } from './types'

const table5Views: readonly Table5View[] = ['all', 'active', 'backlog']

const defaultPageSizeOptions: readonly number[] = [5, 10, 20]

const subtasksOf = (task: Table5Task) => task.subtasks

function collectProjects(tasks: readonly Table5Task[]): string[] {
  const projects = new Set<string>()
  const visit = (list: readonly Table5Task[]) => {
    for (const task of list) {
      projects.add(task.project)
      if (task.subtasks) visit(task.subtasks)
    }
  }
  visit(tasks)
  return [...projects]
}

export function Table5({
  className,
  error,
  expanded,
  labels: labelsProp,
  onCreate,
  onExpandedChange,
  onRetry,
  onRowAction,
  onShowSubtasksChange,
  onSortChange,
  onViewChange,
  pageSize = 5,
  pageSizeOptions = defaultPageSizeOptions,
  pending,
  rowActions,
  showSubtasks = true,
  sort,
  tasks,
  view = 'all',
  viewCounts,
}: Readonly<Table5Props>) {
  const labels = useMemo(() => resolveTable5Labels(labelsProp), [labelsProp])
  const rowActionRef = useRef(onRowAction)
  useLayoutEffect(() => {
    rowActionRef.current = onRowAction
  })
  const handleRowAction = useCallback(
    (actionId: string, taskId: string) =>
      rowActionRef.current?.(actionId, taskId),
    [],
  )
  const hasRowMenu = Boolean(onRowAction)
  const columns = useMemo(
    () =>
      createTable5Columns({
        labels,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        rowActions,
      }),
    [handleRowAction, hasRowMenu, labels, rowActions],
  )
  const projects = useMemo(() => collectProjects(tasks), [tasks])
  const rows = useMemo(
    () =>
      showSubtasks ? tasks : tasks.map(({ subtasks: _, ...task }) => task),
    [showSubtasks, tasks],
  )

  const controlledSorting = useMemo(
    () => (sort === undefined ? undefined : sortingFromSort(sort)),
    [sort],
  )
  const { table } = useDataTable<Table5Task>({
    columns,
    data: rows,
    density: 'medium',
    enableExpanding: showSubtasks,
    enablePagination: true,
    enableSorting: true,
    expanded,
    getRowId: (task) => task.id,
    getSubRows: subtasksOf,
    onExpandedChange,
    onSortingChange: onSortChange
      ? (sorting) => onSortChange(sortFromSorting(sorting))
      : undefined,
    pageSize,
    sorting: controlledSorting,
  })

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Table5Skeleton label={labels.loading} />,
  })

  const content = (
    <div className="grid gap-4">
      <DataTable
        aria-label={labels.title}
        emptyMessage={labels.empty}
        table={table}
      />
      <DataGridPagination
        pageSizeLabel={labels.rowsPerPage}
        pageSizeOptions={pageSizeOptions}
        table={table}
      />
    </div>
  )

  return (
    <TableFrame
      className={className}
      data-block="table-5"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar
            aria-label={labels.toolbar}
            description=""
            title={labels.title}
          />
        ) : (
          <Table5Toolbar
            description={labels.summary(tasks.length, showSubtasks)}
            labels={labels}
            onCreate={onCreate}
            onShowSubtasksChange={onShowSubtasksChange}
            projects={projects}
            showSubtasks={showSubtasks}
            table={table}
          />
        )
      }
    >
      {loadState ??
        (onViewChange ? (
          <Tabs
            onValueChange={(next) => onViewChange(next as Table5View)}
            value={view}
          >
            <TabsList aria-label={labels.viewsLabel} variant="underline">
              {table5Views.map((id) => (
                <TabsTab data-view={id} key={id} value={id}>
                  {labels.views[id]}
                  {viewCounts ? (
                    <Badge className="tabular-nums" variant="secondary">
                      {viewCounts[id]}
                    </Badge>
                  ) : null}
                </TabsTab>
              ))}
            </TabsList>
            <TabsPanel className="pt-2" value={view}>
              {content}
            </TabsPanel>
          </Tabs>
        ) : (
          content
        ))}
    </TableFrame>
  )
}
