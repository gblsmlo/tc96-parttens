import {
  DataGrid5,
  type DataGrid5Expanded,
  type DataGrid5Props,
  type DataGrid5Sort,
  type DataGrid5View,
} from '@tc96/ui/blocks/data/data-grid/data-grid-5'
import { useMemo, useState } from 'react'
import {
  initialExpanded,
  initialSort,
  rowActions,
  tasksForView,
  viewCounts,
} from '../fixtures/data-grid-5.ts'
import type { DataGrid5Controls } from './data-grid-5-controls.ts'

interface ComposedDataGrid5Props extends DataGrid5Controls {
  onCreate?: DataGrid5Props['onCreate']
  onExpandedChange?: DataGrid5Props['onExpandedChange']
  onRowAction?: DataGrid5Props['onRowAction']
  onShowSubtasksChange?: DataGrid5Props['onShowSubtasksChange']
  onSortChange?: DataGrid5Props['onSortChange']
  onViewChange?: DataGrid5Props['onViewChange']
}

export const ComposedDataGrid5 = ({
  create,
  empty,
  onCreate,
  onExpandedChange,
  onRowAction,
  onShowSubtasksChange,
  onSortChange,
  onViewChange,
  pageSize,
  rowActions: showRowActions,
  subtasksSwitch,
  title,
  views,
}: Readonly<ComposedDataGrid5Props>) => {
  const [view, setView] = useState<DataGrid5View>('all')
  const [expanded, setExpanded] = useState<DataGrid5Expanded>(initialExpanded)
  const [showSubtasks, setShowSubtasks] = useState(true)
  const [sort, setSort] = useState<DataGrid5Sort | null>(initialSort)
  const tasks = useMemo(() => (empty ? [] : tasksForView(view)), [empty, view])

  return (
    <DataGrid5
      expanded={expanded}
      labels={{ title }}
      onCreate={create ? (onCreate ?? (() => undefined)) : undefined}
      onExpandedChange={(next) => {
        setExpanded(next)
        onExpandedChange?.(next)
      }}
      onRowAction={
        showRowActions ? (onRowAction ?? (() => undefined)) : undefined
      }
      onShowSubtasksChange={
        subtasksSwitch
          ? (next) => {
              setShowSubtasks(next)
              onShowSubtasksChange?.(next)
            }
          : undefined
      }
      onSortChange={(next) => {
        setSort(next)
        onSortChange?.(next)
      }}
      onViewChange={
        views
          ? (next) => {
              setView(next)
              onViewChange?.(next)
            }
          : undefined
      }
      pageSize={pageSize}
      rowActions={showRowActions ? rowActions : undefined}
      showSubtasks={showSubtasks}
      sort={sort}
      tasks={tasks}
      view={view}
      viewCounts={views ? viewCounts : undefined}
    />
  )
}
