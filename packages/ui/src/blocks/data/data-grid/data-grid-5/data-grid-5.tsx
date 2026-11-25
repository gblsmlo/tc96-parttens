'use client'

import { Badge } from '@tc96/ui/badge'
import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { GridFrame } from '../shared/grid-frame'
import { gridLoadState } from '../shared/grid-load-state'
import { sortFromSorting, sortingFromSort } from '../shared/grid-state'
import { GridToolbar } from '../shared/grid-toolbar'
import { GridToolbarHeading } from '../shared/grid-toolbar-heading'
import { createDataGrid5Columns } from './data-grid-5-columns'
import { DataGrid5Skeleton } from './data-grid-5-skeleton'
import { DataGrid5Toolbar } from './data-grid-5-toolbar'
import { resolveDataGrid5Labels } from './labels'
import type { DataGrid5Props, DataGrid5Task, DataGrid5View } from './types'

const dataGrid5Views: readonly DataGrid5View[] = ['all', 'active', 'backlog']

const defaultPageSizeOptions: readonly number[] = [5, 10, 20]

const subtasksOf = (task: DataGrid5Task) => task.subtasks

function collectProjects(tasks: readonly DataGrid5Task[]): string[] {
  const projects = new Set<string>()
  const visit = (list: readonly DataGrid5Task[]) => {
    for (const task of list) {
      projects.add(task.project)
      if (task.subtasks) visit(task.subtasks)
    }
  }
  visit(tasks)
  return [...projects]
}

export function DataGrid5({
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
}: Readonly<DataGrid5Props>) {
  const labels = useMemo(() => resolveDataGrid5Labels(labelsProp), [labelsProp])
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
      createDataGrid5Columns({
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
  const { table } = useDataGrid<DataGrid5Task>({
    columns,
    data: rows,
    density: 'medium',
    enableExpanding: showSubtasks,
    enablePagination: true,
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

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <DataGrid5Skeleton label={labels.loading} />,
  })

  const content = (
    <DataGrid
      aria-label={labels.title}
      emptyMessage={labels.empty}
      footer={
        <DataGridPagination
          pageSizeLabel={labels.rowsPerPage}
          pageSizeOptions={pageSizeOptions}
          table={table}
        />
      }
      table={table}
    />
  )

  return (
    <GridFrame
      className={className}
      data-block="data-grid-5"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar
            aria-label={labels.toolbar}
            left={<GridToolbarHeading title={labels.title} />}
          />
        ) : (
          <DataGrid5Toolbar
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
            onValueChange={(next) => onViewChange(next as DataGrid5View)}
            value={view}
          >
            <TabsList aria-label={labels.viewsLabel} variant="underline">
              {dataGrid5Views.map((id) => (
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
    </GridFrame>
  )
}
