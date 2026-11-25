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
import { tasks2Statuses } from './tasks-2-options'
import type {
  Tasks2Labels,
  Tasks2Option,
  Tasks2Person,
  Tasks2Priority,
  Tasks2Status,
  Tasks2Task,
} from './types'

export interface Tasks2SelectionActionsOptions {
  labels: Tasks2Labels
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Tasks2Priority | null,
  ) => void
  onBulkProjectChange?: (taskIds: string[], projectId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: Tasks2Status) => void
  onDone: () => void
  people: readonly Tasks2Person[]
  projects: readonly Tasks2Option[]
  selectedRows: readonly Tasks2Task[]
}

export function createTasks2SelectionActions({
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
}: Tasks2SelectionActionsOptions): ActionBarGroup<Tasks2Task>[] {
  const ids = selectedRows.map((task) => task.id)
  const apply =
    (report: () => void): ActionBarItem<Tasks2Task>['onSelect'] =>
    () => {
      onDone()
      report()
    }

  const more: ActionBarGroup<Tasks2Task>[] = []
  if (onBulkStatusChange)
    more.push({
      id: 'status',
      items: tasks2Statuses.map((status) => ({
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

  const items: ActionBarItem<Tasks2Task>[] = []
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
