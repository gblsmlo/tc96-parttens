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
import { tasks5Statuses } from './tasks-5-options'
import type {
  Tasks5Labels,
  Tasks5Option,
  Tasks5Person,
  Tasks5Priority,
  Tasks5Status,
  Tasks5Task,
} from './types'

export interface Tasks5SelectionActionsOptions {
  labels: Tasks5Labels
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks5Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks5Status) => void
  onDone: () => void
  people: readonly Tasks5Person[]
  projects: readonly Tasks5Option[]
  selectedRows: readonly Tasks5Task[]
}

export function createTasks5SelectionActions({
  labels,
  onBulkAssigneesChange,
  onBulkDelete,
  onBulkPriorityChange,
  onBulkProjectChange,
  onBulkStatusChange,
  onDone,
  people,
  projects,
  selectedRows,
}: Tasks5SelectionActionsOptions): ActionBarGroup<Tasks5Task>[] {
  const ids = selectedRows.map((task) => task.id)
  const apply =
    (report: () => void): ActionBarItem<Tasks5Task>['onSelect'] =>
    () => {
      onDone()
      report()
    }

  const more: ActionBarGroup<Tasks5Task>[] = []
  if (onBulkStatusChange)
    more.push({
      id: 'status',
      items: tasks5Statuses.map((status) => ({
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

  if (onBulkAssigneesChange)
    more.push({
      id: 'assignees',
      items: [
        ...people.map((person) => ({
          id: `assignee:${person.id}`,
          label: person.label,
          onSelect: apply(() => onBulkAssigneesChange(ids, [person.id])),
        })),
        {
          id: 'assignee:none',
          label: labels.unassigned,
          onSelect: apply(() => onBulkAssigneesChange(ids, [])),
        },
      ],
      label: labels.columns.assignees,
    })

  const items: ActionBarItem<Tasks5Task>[] = []
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
