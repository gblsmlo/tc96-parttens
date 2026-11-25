import { CheckIcon, UserPlusIcon } from '@phosphor-icons/react'
import type {
  ActionBarContext,
  ActionBarGroup,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import { support2Statuses } from './support-2-options'
import type {
  Support2Labels,
  Support2Person,
  Support2Status,
  Support2Ticket,
} from './types'

const idsOf = ({ selectedRows }: ActionBarContext<Support2Ticket>) =>
  selectedRows.map((ticket) => ticket.id)

export interface Support2SelectionActionsOptions {
  labels: Support2Labels
  onAssignOwner?: (ticketIds: string[], ownerId: string) => void
  onStatusUpdate?: (ticketIds: string[], status: Support2Status) => void
  owners: readonly Support2Person[]
}

export function createSupport2SelectionActions({
  labels,
  onAssignOwner,
  onStatusUpdate,
  owners,
}: Support2SelectionActionsOptions): ActionBarGroup<Support2Ticket>[] {
  const items: ActionBarGroup<Support2Ticket>['items'] = []
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
          items: support2Statuses.map((status) => ({
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
