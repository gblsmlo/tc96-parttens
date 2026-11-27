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
import { tasksStatuses } from './options'
import type {
  TasksLabels,
  TasksOption,
  TasksPerson,
  TasksPriority,
  TasksStatus,
  TasksTask,
} from './types'

export interface TasksSelectionActionsOptions {
  labels: TasksLabels
  onBulkAssigneesChange?: (taskIds: string[], assigneeIds: string[]) => void
  onBulkDelete?: (taskIds: string[]) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: TasksPriority | null,
  ) => void
  onBulkKindChange?: (taskIds: string[], kindId: string | null) => void
  onBulkStatusChange?: (taskIds: string[], status: TasksStatus) => void
  onDone: () => void
  people: readonly TasksPerson[]
  kinds: readonly TasksOption[]
  selectedRows: readonly TasksTask[]
}

export function createTasksSelectionActions({
  labels,
  onBulkAssigneesChange,
  onBulkDelete,
  onBulkPriorityChange,
  onBulkKindChange,
  onBulkStatusChange,
  onDone,
  people,
  kinds,
  selectedRows,
}: TasksSelectionActionsOptions): ActionBarGroup<TasksTask>[] {
  const ids = selectedRows.map((task) => task.id)
  const apply =
    (report: () => void): ActionBarItem<TasksTask>['onSelect'] =>
    () => {
      onDone()
      report()
    }

  const more: ActionBarGroup<TasksTask>[] = []
  if (onBulkStatusChange)
    more.push({
      id: 'status',
      items: tasksStatuses.map((status) => ({
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
  if (onBulkKindChange)
    more.push({
      id: 'kind',
      items: [
        ...kinds.map((kind) => ({
          id: `kind:${kind.id}`,
          label: kind.label,
          onSelect: apply(() => onBulkKindChange(ids, kind.id)),
        })),
        {
          id: 'kind:none',
          label: labels.noKind,
          onSelect: apply(() => onBulkKindChange(ids, null)),
        },
      ],
      label: labels.columns.kind,
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

  const items: ActionBarItem<TasksTask>[] = []
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
