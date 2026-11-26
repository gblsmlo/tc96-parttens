import { CheckCircleIcon, TrashIcon, UserIcon } from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { Finance4Entry, Finance4Labels, Finance4Person } from './types'

export interface Finance4SelectionActionsOptions {
  labels: Finance4Labels
  lawyers: readonly Finance4Person[]
  onBulkDelete?: (entryIds: string[]) => void
  onBulkResponsibleChange?: (entryIds: string[], lawyerId: string) => void
  onBulkSettle?: (entryIds: string[]) => void
  onDone: () => void
  selectedRows: readonly Finance4Entry[]
}

export function createFinance4SelectionActions({
  labels,
  lawyers,
  onBulkDelete,
  onBulkResponsibleChange,
  onBulkSettle,
  onDone,
  selectedRows,
}: Finance4SelectionActionsOptions): ActionBarGroup<Finance4Entry>[] {
  const ids = selectedRows.map((entry) => entry.id)
  const settleIds = selectedRows
    .filter((entry) => entry.canSettle)
    .map((entry) => entry.id)
  const apply =
    (report: () => void): ActionBarItem<Finance4Entry>['onSelect'] =>
    () => {
      onDone()
      report()
    }

  const items: ActionBarItem<Finance4Entry>[] = []
  if (onBulkSettle)
    items.push({
      disabled: settleIds.length === 0,
      icon: <CheckCircleIcon aria-hidden="true" />,
      id: 'settle',
      label: labels.settle,
      onSelect: apply(() => onBulkSettle(settleIds)),
    })
  if (onBulkResponsibleChange)
    items.push({
      disabled: lawyers.length === 0,
      icon: <UserIcon aria-hidden="true" />,
      id: 'responsible',
      label: labels.changeResponsible,
      submenu: [
        {
          id: 'responsible-lawyer',
          items: lawyers.map((lawyer) => ({
            id: `responsible:${lawyer.id}`,
            label: lawyer.label,
            onSelect: apply(() => onBulkResponsibleChange(ids, lawyer.id)),
          })),
          label: labels.assignTo,
        },
      ],
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
