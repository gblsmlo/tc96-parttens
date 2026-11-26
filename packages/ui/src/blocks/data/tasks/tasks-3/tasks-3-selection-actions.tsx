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
import { tasks3Statuses } from './tasks-3-options'
import type {
  Tasks3Labels,
  Tasks3Option,
  Tasks3Person,
  Tasks3Priority,
  Tasks3Status,
  Tasks3Task,
} from './types'

export interface Tasks3SelectionActionsOptions {
  labels: Tasks3Labels
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks3Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks3Status) => void
  onDone: () => void
  people: readonly Tasks3Person[]
  projects: readonly Tasks3Option[]
  selectedRows: readonly Tasks3Task[]
}

export function createTasks3SelectionActions({
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
}: Tasks3SelectionActionsOptions): ActionBarGroup<Tasks3Task>[] {
  const ids = selectedRows.map((task) => task.id)
  const apply =
    (report: () => void): ActionBarItem<Tasks3Task>['onSelect'] =>
    () => {
      onDone()
      report()
    }

  const more: ActionBarGroup<Tasks3Task>[] = []
  if (onBulkStatusChange)
    more.push({
      id: 'status',
      items: tasks3Statuses.map((status) => ({
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

  const items: ActionBarItem<Tasks3Task>[] = []
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
