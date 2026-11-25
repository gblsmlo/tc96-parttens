import {
  Projects1,
  type Projects1Expanded,
  type Projects1Props,
  type Projects1Sort,
  type Projects1View,
} from '@tc96/ui/blocks/data/projects/projects-1'
import { useMemo, useState } from 'react'
import {
  initialExpanded,
  initialSort,
  rowActions,
  tasksForView,
  viewCounts,
} from '../fixtures/projects-1.ts'
import type { Projects1Controls } from './projects-1-controls.ts'

interface ComposedProjects1Props extends Projects1Controls {
  onCreate?: Projects1Props['onCreate']
  onExpandedChange?: Projects1Props['onExpandedChange']
  onRowAction?: Projects1Props['onRowAction']
  onShowSubtasksChange?: Projects1Props['onShowSubtasksChange']
  onSortChange?: Projects1Props['onSortChange']
  onViewChange?: Projects1Props['onViewChange']
}

export const ComposedProjects1 = ({
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
}: Readonly<ComposedProjects1Props>) => {
  const [view, setView] = useState<Projects1View>('all')
  const [expanded, setExpanded] = useState<Projects1Expanded>(initialExpanded)
  const [showSubtasks, setShowSubtasks] = useState(true)
  const [sort, setSort] = useState<Projects1Sort | null>(initialSort)
  const tasks = useMemo(() => (empty ? [] : tasksForView(view)), [empty, view])

  return (
    <Projects1
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
