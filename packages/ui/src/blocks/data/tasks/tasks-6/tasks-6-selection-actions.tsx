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
import type {
  Tasks6Labels,
  Tasks6Option,
  Tasks6Person,
  Tasks6Priority,
  Tasks6Status,
  Tasks6StatusOption,
  Tasks6Task,
} from './types'

export interface Tasks6SelectionActionsOptions {
  labels: Tasks6Labels
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks6Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks6Status) => void
  onDone: () => void
  people: readonly Tasks6Person[]
  projects: readonly Tasks6Option[]
  selectedRows: readonly Tasks6Task[]
  statuses: readonly Tasks6StatusOption[]
}

export function createTasks6SelectionActions({
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
  statuses,
}: Tasks6SelectionActionsOptions): ActionBarGroup<Tasks6Task>[] {
  const ids = selectedRows.map((task) => task.id)
  const apply =
    (report: () => void): ActionBarItem<Tasks6Task>['onSelect'] =>
    () => {
      onDone()
      report()
    }

  const more: ActionBarGroup<Tasks6Task>[] = []
  if (onBulkStatusChange)
    more.push({
      id: 'status',
      items: statuses.map((status) => ({
        id: `status:${status.id}`,
        label: status.label,
        onSelect: apply(() => onBulkStatusChange(ids, status.id)),
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

  const items: ActionBarItem<Tasks6Task>[] = []
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
