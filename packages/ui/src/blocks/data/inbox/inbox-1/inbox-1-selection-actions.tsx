import { ArrowSquareOutIcon, EnvelopeOpenIcon } from '@phosphor-icons/react'
import type { ActionBarGroup } from '@tc96/ui/patterns/action-bar/components/action-bar'
import { opensEntry } from './inbox-1-fields'
import type { Inbox1Entry, Inbox1Labels } from './types'

export interface Inbox1SelectionActionsOptions {
  clearSelection: () => void
  labels: Inbox1Labels
  onMarkRead?: (entryIds: string[]) => void
  onOpen?: (entryId: string) => void
  selectedRows: readonly Inbox1Entry[]
}

export function createInbox1SelectionActions({
  clearSelection,
  labels,
  onMarkRead,
  onOpen,
  selectedRows,
}: Inbox1SelectionActionsOptions): ActionBarGroup<Inbox1Entry>[] {
  const [only] = selectedRows.length === 1 ? selectedRows : []
  const unreadIds = selectedRows
    .filter((entry) => !entry.read)
    .map((entry) => entry.id)

  const items: ActionBarGroup<Inbox1Entry>['items'] = [
    ...(onOpen
      ? [
          {
            disabled: !only || !opensEntry(only),
            icon: <ArrowSquareOutIcon aria-hidden="true" />,
            id: 'open',
            label: labels.actions.open,
            onSelect: () => {
              if (!only || !opensEntry(only)) return
              clearSelection()
              onOpen(only.id)
            },
          },
        ]
      : []),
    ...(onMarkRead
      ? [
          {
            disabled: unreadIds.length === 0,
            icon: <EnvelopeOpenIcon aria-hidden="true" />,
            id: 'markRead',
            label: labels.actions.markRead,
            onSelect: () => {
              if (unreadIds.length === 0) return
              clearSelection()
              onMarkRead(unreadIds)
            },
          },
        ]
      : []),
  ]

  return items.length > 0 ? [{ id: 'entries', items }] : []
}
