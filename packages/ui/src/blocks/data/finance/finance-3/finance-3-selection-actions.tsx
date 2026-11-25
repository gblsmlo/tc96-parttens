import { CheckCircleIcon, UserIcon } from '@phosphor-icons/react'
import type {
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type {
  Finance3Entry,
  Finance3Labels,
  Finance3Option,
  Finance3Person,
  Finance3Receivable,
} from './types'

export interface Finance3EntriesSelectionOptions {
  accounts: readonly Finance3Option[]
  labels: Finance3Labels
  members: readonly Finance3Person[]
  onBulkResponsibleChange?: (entryIds: string[], memberId: string) => void
  onBulkSettle?: (entryIds: string[], accountId: string) => void
  onDone: () => void
  selectedRows: readonly Finance3Entry[]
}

export function createFinance3EntriesSelectionActions({
  accounts,
  labels,
  members,
  onBulkResponsibleChange,
  onBulkSettle,
  onDone,
  selectedRows,
}: Finance3EntriesSelectionOptions): ActionBarGroup<Finance3Entry>[] {
  const settleIds = selectedRows
    .filter((item) => item.canSettle)
    .map((item) => item.id)
  const editIds = selectedRows
    .filter((item) => item.canEdit)
    .map((item) => item.id)
  const choices = (
    options: readonly Finance3Option[],
    ids: string[],
    apply: (recordIds: string[], value: string) => void,
  ): ActionBarItem<Finance3Entry>[] =>
    options.map((option) => ({
      id: option.id,
      label: option.label,
      onSelect: () => {
        apply(ids, option.id)
        onDone()
      },
    }))

  const items: ActionBarItem<Finance3Entry>[] = []
  if (onBulkSettle)
    items.push({
      disabled: settleIds.length === 0 || accounts.length === 0,
      icon: <CheckCircleIcon aria-hidden="true" />,
      id: 'settle',
      label: labels.entries.settle,
      submenu: [
        {
          id: 'settle-account',
          items: choices(accounts, settleIds, onBulkSettle),
          label: labels.entries.settleIn,
        },
      ],
    })
  if (onBulkResponsibleChange)
    items.push({
      disabled: editIds.length === 0 || members.length === 0,
      icon: <UserIcon aria-hidden="true" />,
      id: 'responsible',
      label: labels.entries.columns.responsible,
      submenu: [
        {
          id: 'responsible-member',
          items: choices(members, editIds, onBulkResponsibleChange),
          label: labels.entries.assignTo,
        },
      ],
    })

  return items.length ? [{ id: 'bulk', items }] : []
}

export function createFinance3ReceivablesSelectionActions({
  labels,
  onDone,
  onMarkCollected,
  selectedRows,
}: {
  labels: Finance3Labels
  onDone: () => void
  onMarkCollected?: (receivableIds: string[]) => void
  selectedRows: readonly Finance3Receivable[]
}): ActionBarGroup<Finance3Receivable>[] {
  if (!onMarkCollected) return []
  return [
    {
      id: 'bulk',
      items: [
        {
          icon: <CheckCircleIcon aria-hidden="true" />,
          id: 'collected',
          label: labels.receivables.markCollected,
          onSelect: () => {
            onMarkCollected(selectedRows.map((item) => item.id))
            onDone()
          },
        },
      ],
    },
  ]
}
