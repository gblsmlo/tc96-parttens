import { CheckIcon, UserPlusIcon } from '@phosphor-icons/react'
import type {
  ActionBarContext,
  ActionBarGroup,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type {
  Table1Labels,
  Table1Person,
  Table1Status,
  Table1Ticket,
} from './types'

const statuses: readonly Table1Status[] = ['open', 'pending', 'resolved']

const idsOf = ({ selectedRows }: ActionBarContext<Table1Ticket>) =>
  selectedRows.map((ticket) => ticket.id)

export interface Table1SelectionActionsOptions {
  labels: Table1Labels
  onAssignOwner?: (ticketIds: string[], ownerId: string) => void
  onStatusUpdate?: (ticketIds: string[], status: Table1Status) => void
  owners: readonly Table1Person[]
}

export function createTable1SelectionActions({
  labels,
  onAssignOwner,
  onStatusUpdate,
  owners,
}: Table1SelectionActionsOptions): ActionBarGroup<Table1Ticket>[] {
  const items: ActionBarGroup<Table1Ticket>['items'] = []
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
          items: statuses.map((status) => ({
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
