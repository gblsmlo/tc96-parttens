import {
  Projects2,
  type Projects2Expanded,
  type Projects2Props,
  type Projects2Sort,
  type Projects2View,
} from '@tc96/ui/blocks/data/projects/projects-2'
import { useMemo, useState } from 'react'
import {
  initialExpanded,
  initialSort,
  rowActions,
  tasksForView,
  viewCounts,
} from '../fixtures/projects-2.ts'
import type { Projects2Controls } from './projects-2-controls.ts'

interface ComposedProjects2Props extends Projects2Controls {
  onCreate?: Projects2Props['onCreate']
  onExpandedChange?: Projects2Props['onExpandedChange']
  onRowAction?: Projects2Props['onRowAction']
  onShowSubtasksChange?: Projects2Props['onShowSubtasksChange']
  onSortChange?: Projects2Props['onSortChange']
  onViewChange?: Projects2Props['onViewChange']
}

export const ComposedProjects2 = ({
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
}: Readonly<ComposedProjects2Props>) => {
  const [view, setView] = useState<Projects2View>('all')
  const [expanded, setExpanded] = useState<Projects2Expanded>(initialExpanded)
  const [showSubtasks, setShowSubtasks] = useState(true)
  const [sort, setSort] = useState<Projects2Sort | null>(initialSort)
  const tasks = useMemo(() => (empty ? [] : tasksForView(view)), [empty, view])

  return (
    <Projects2
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
