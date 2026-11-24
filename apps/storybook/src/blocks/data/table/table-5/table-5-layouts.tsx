import {
  Table5,
  type Table5Expanded,
  type Table5Props,
  type Table5Sort,
  type Table5View,
} from '@tc96/ui/blocks/data/table/table-5'
import { useMemo, useState } from 'react'
import {
  initialExpanded,
  initialSort,
  rowActions,
  tasksForView,
  viewCounts,
} from '../fixtures/table-5.ts'
import type { Table5Controls } from './table-5-controls.ts'

interface ComposedTable5Props extends Table5Controls {
  onCreate?: Table5Props['onCreate']
  onExpandedChange?: Table5Props['onExpandedChange']
  onRowAction?: Table5Props['onRowAction']
  onShowSubtasksChange?: Table5Props['onShowSubtasksChange']
  onSortChange?: Table5Props['onSortChange']
  onViewChange?: Table5Props['onViewChange']
}

export const ComposedTable5 = ({
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
}: Readonly<ComposedTable5Props>) => {
  const [view, setView] = useState<Table5View>('all')
  const [expanded, setExpanded] = useState<Table5Expanded>(initialExpanded)
  const [showSubtasks, setShowSubtasks] = useState(true)
  const [sort, setSort] = useState<Table5Sort | null>(initialSort)
  const tasks = useMemo(() => (empty ? [] : tasksForView(view)), [empty, view])

  return (
    <Table5
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
