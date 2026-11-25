import { CheckIcon, UserPlusIcon } from '@phosphor-icons/react'
import type {
  ActionBarContext,
  ActionBarGroup,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import { support1Statuses } from './support-1-options'
import type {
  Support1Labels,
  Support1Person,
  Support1Status,
  Support1Ticket,
} from './types'

const idsOf = ({ selectedRows }: ActionBarContext<Support1Ticket>) =>
  selectedRows.map((ticket) => ticket.id)

export interface Support1SelectionActionsOptions {
  labels: Support1Labels
  onAssignOwner?: (ticketIds: string[], ownerId: string) => void
  onStatusUpdate?: (ticketIds: string[], status: Support1Status) => void
  owners: readonly Support1Person[]
}

export function createSupport1SelectionActions({
  labels,
  onAssignOwner,
  onStatusUpdate,
  owners,
}: Support1SelectionActionsOptions): ActionBarGroup<Support1Ticket>[] {
  const items: ActionBarGroup<Support1Ticket>['items'] = []
  if (onAssignOwner && owners.length)
    items.push({
      icon: <UserPlusIcon aria-hidden="true" />,
      id: 'assign-owner',
      label: labels.assignOwner,
      submenu: [
        {
          items: owners.map((owner) => ({
            id: owner.id,
            label: owner.label,
            onSelect: (context) => onAssignOwner(idsOf(context), owner.id),
          })),
          label: labels.owner,
        },
      ],
    })
  if (onStatusUpdate)
    items.push({
      icon: <CheckIcon aria-hidden="true" />,
      id: 'update-status',
      label: labels.updateStatus,
      submenu: [
        {
          items: support1Statuses.map((status) => ({
            id: status,
            label: labels.statuses[status],
            onSelect: (context) => onStatusUpdate(idsOf(context), status),
          })),
          label: labels.newStatus,
        },
      ],
    })
  return items.length ? [{ id: 'bulk', items }] : []
}
