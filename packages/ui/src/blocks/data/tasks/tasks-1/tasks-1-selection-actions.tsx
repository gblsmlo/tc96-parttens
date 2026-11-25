import {
  CheckCircleIcon,
  DotsThreeIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import { dataPriorities } from '../../shared/properties/data-priority'
import { tasks1Statuses } from './tasks-1-options'
import type {
  Tasks1Labels,
  Tasks1Option,
  Tasks1Priority,
  Tasks1Status,
  Tasks1Task,
} from './types'

export interface Tasks1SelectionActionsOptions {
  labels: Tasks1Labels
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks1Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks1Status) => void
  onDone: () => void
  projects: readonly Tasks1Option[]
  selectedRows: readonly Tasks1Task[]
}

export function createTasks1SelectionActions({
  labels,
  onBulkDelete,
  onBulkPriorityChange,
  onBulkProjectChange,
  onBulkStatusChange,
  onDone,
  projects,
  selectedRows,
}: Tasks1SelectionActionsOptions): ActionBarGroup<Tasks1Task>[] {
  const ids = selectedRows.map((task) => task.id)
  const apply =
    (report: () => void): ActionBarItem<Tasks1Task>['onSelect'] =>
    () => {
      onDone()
      report()
    }

  const more: ActionBarGroup<Tasks1Task>[] = []
  if (onBulkStatusChange)
    more.push({
      id: 'status',
      items: tasks1Statuses.map((status) => ({
        id: `status:${status}`,
        label: labels.statuses[status],
        onSelect: apply(() => onBulkStatusChange(ids, status)),
      })),
      label: labels.status,
    })
  if (onBulkPriorityChange)
    more.push({
      id: 'priority',
      items: [
        ...dataPriorities.map((priority) => ({
          id: `priority:${priority}`,
          label: labels.priorities[priority],
          onSelect: apply(() => onBulkPriorityChange(ids, priority)),
        })),
        {
          id: 'priority:none',
          label: labels.noPriority,
          onSelect: apply(() => onBulkPriorityChange(ids, null)),
        },
      ],
      label: labels.columns.priority,
    })
  if (onBulkProjectChange)
    more.push({
      id: 'project',
      items: [
        ...projects.map((project) => ({
          id: `project:${project.id}`,
          label: project.label,
          onSelect: apply(() => onBulkProjectChange(ids, project.id)),
        })),
        {
          id: 'project:none',
          label: labels.noProject,
          onSelect: apply(() => onBulkProjectChange(ids, null)),
        },
      ],
      label: labels.columns.project,
    })

  const items: ActionBarItem<Tasks1Task>[] = []
  if (onBulkStatusChange)
    items.push({
      icon: <CheckCircleIcon aria-hidden="true" />,
      id: 'complete',
      label: labels.complete,
      onSelect: apply(() => onBulkStatusChange(ids, 'done')),
    })
  if (more.length)
    items.push({
      icon: <DotsThreeIcon aria-hidden="true" />,
      id: 'more',
      label: labels.moreOptions,
      submenu: more,
    })
  if (onBulkDelete)
    items.push({
      icon: <TrashIcon aria-hidden="true" />,
      id: 'delete',
      label: labels.delete,
      onSelect: apply(() => onBulkDelete(ids)),
      variant: 'destructive',
    })

  return items.length ? [{ id: 'bulk', items }] : []
}
