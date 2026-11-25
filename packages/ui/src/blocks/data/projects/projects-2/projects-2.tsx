'use client'

import { Badge } from '@tc96/ui/badge'
import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import { useDataTable } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import {
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@tc96/ui/tabs'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { TableFrame } from '../../shared/table/table-frame'
import { tableLoadState } from '../../shared/table/table-load-state'
import {
  sortFromSorting,
  sortingFromSort,
} from '../../shared/table/table-state'
import { TableToolbar } from '../../shared/table/table-toolbar'
import { resolveProjects2Labels } from './labels'
import { createProjects2Columns } from './projects-2-columns'
import { Projects2Skeleton } from './projects-2-skeleton'
import { Projects2Toolbar } from './projects-2-toolbar'
import type { Projects2Props, Projects2Task, Projects2View } from './types'

const projects2Views: readonly Projects2View[] = ['all', 'active', 'backlog']

const defaultPageSizeOptions: readonly number[] = [5, 10, 20]

const subtasksOf = (task: Projects2Task) => task.subtasks

function collectProjects(tasks: readonly Projects2Task[]): string[] {
  const projects = new Set<string>()
  const visit = (list: readonly Projects2Task[]) => {
    for (const task of list) {
      projects.add(task.project)
      if (task.subtasks) visit(task.subtasks)
    }
  }
  visit(tasks)
  return [...projects]
}

export function Projects2({
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
}: Readonly<Projects2Props>) {
  const labels = useMemo(() => resolveProjects2Labels(labelsProp), [labelsProp])
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
      createProjects2Columns({
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
  const { table } = useDataTable<Projects2Task>({
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
    skeleton: <Projects2Skeleton label={labels.loading} />,
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
      data-block="projects-2"
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
          <Projects2Toolbar
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
            onValueChange={(next) => onViewChange(next as Projects2View)}
            value={view}
          >
            <TabsList aria-label={labels.viewsLabel} variant="underline">
              {projects2Views.map((id) => (
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
