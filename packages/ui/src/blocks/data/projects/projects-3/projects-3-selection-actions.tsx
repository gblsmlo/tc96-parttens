import {
  ArchiveIcon,
  CheckCircleIcon,
  DotsThreeIcon,
} from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import { dataPriorities } from '../../shared/properties/data-priority'
import type {
  Projects3Labels,
  Projects3Option,
  Projects3Person,
  Projects3Priority,
  Projects3Status,
  Projects3Task,
} from './types'

export interface Projects3SelectionActionsOptions {
  assignees: readonly Projects3Person[]
  labels: Projects3Labels
  onBulkArchive?: (taskIds: string[]) => void
  onBulkAssigneeChange?: (taskIds: string[], assigneeId: string | null) => void
  onBulkPriorityChange?: (
    taskIds: string[],
    priority: Projects3Priority | null,
  ) => void
  onBulkStatusChange?: (taskIds: string[], status: Projects3Status) => void
  onBulkTypeChange?: (taskIds: string[], type: string) => void
  onDone: () => void
  selectedRows: readonly Projects3Task[]
  types: readonly Projects3Option[]
}

export function createProjects3SelectionActions({
  assignees,
  labels,
  onBulkArchive,
  onBulkAssigneeChange,
  onBulkPriorityChange,
  onBulkStatusChange,
  onBulkTypeChange,
  onDone,
  selectedRows,
  types,
}: Projects3SelectionActionsOptions): ActionBarGroup<Projects3Task>[] {
  const ids = selectedRows.map((task) => task.id)
  const apply =
    (report: () => void): ActionBarItem<Projects3Task>['onSelect'] =>
    () => {
      onDone()
      report()
    }

  const more: ActionBarGroup<Projects3Task>[] = []
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
  if (onBulkTypeChange && types.length)
    more.push({
      id: 'type',
      items: types.map((type) => ({
        id: `type:${type.id}`,
        label: type.label,
        onSelect: apply(() => onBulkTypeChange(ids, type.id)),
      })),
      label: labels.columns.type,
    })
  if (onBulkAssigneeChange)
    more.push({
      id: 'assignee',
      items: [
        ...assignees.map((assignee) => ({
          id: `assignee:${assignee.id}`,
          label: assignee.label,
          onSelect: apply(() => onBulkAssigneeChange(ids, assignee.id)),
        })),
        {
          id: 'assignee:none',
          label: labels.unassigned,
          onSelect: apply(() => onBulkAssigneeChange(ids, null)),
        },
      ],
      label: labels.columns.assignee,
    })

  const items: ActionBarItem<Projects3Task>[] = []
  if (onBulkStatusChange)
    items.push({
      icon: <CheckCircleIcon aria-hidden="true" />,
      id: 'complete',
      label: labels.complete,
      onSelect: apply(() => onBulkStatusChange(ids, 'completed')),
    })
  if (more.length)
    items.push({
      icon: <DotsThreeIcon aria-hidden="true" />,
      id: 'more',
      label: labels.moreOptions,
      submenu: more,
    })
  if (onBulkArchive)
    items.push({
      icon: <ArchiveIcon aria-hidden="true" />,
      id: 'archive',
      label: labels.archive,
      onSelect: apply(() => onBulkArchive(ids)),
    })

  return items.length ? [{ id: 'bulk', items }] : []
}
