'use client'

import { Badge } from '@tc96/ui/badge'
import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { useDataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { GridFrame } from '../../shared/grid/grid-frame'
import { gridLoadState } from '../../shared/grid/grid-load-state'
import { sortFromSorting, sortingFromSort } from '../../shared/grid/grid-state'
import { GridToolbar } from '../../shared/grid/grid-toolbar'
import { resolveProjects1Labels } from './labels'
import { createProjects1Columns } from './projects-1-columns'
import { Projects1Skeleton } from './projects-1-skeleton'
import { Projects1Toolbar } from './projects-1-toolbar'
import type { Projects1Props, Projects1Task, Projects1View } from './types'

const projects1Views: readonly Projects1View[] = ['all', 'active', 'backlog']

const defaultPageSizeOptions: readonly number[] = [5, 10, 20]

const subtasksOf = (task: Projects1Task) => task.subtasks

function collectProjects(tasks: readonly Projects1Task[]): string[] {
  const projects = new Set<string>()
  const visit = (list: readonly Projects1Task[]) => {
    for (const task of list) {
      projects.add(task.project)
      if (task.subtasks) visit(task.subtasks)
    }
  }
  visit(tasks)
  return [...projects]
}

export function Projects1({
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
}: Readonly<Projects1Props>) {
  const labels = useMemo(() => resolveProjects1Labels(labelsProp), [labelsProp])
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
      createProjects1Columns({
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
  const { table } = useDataGrid<Projects1Task>({
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
    skeleton: <Projects1Skeleton label={labels.loading} />,
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
      data-block="projects-1"
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
          <Projects1Toolbar
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
            onValueChange={(next) => onViewChange(next as Projects1View)}
            value={view}
          >
            <TabsList aria-label={labels.viewsLabel} variant="underline">
              {projects1Views.map((id) => (
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
