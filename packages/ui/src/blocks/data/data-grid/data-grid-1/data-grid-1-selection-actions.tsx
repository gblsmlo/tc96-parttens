import { CheckIcon, UserPlusIcon } from '@phosphor-icons/react'
import type {
  ActionBarContext,
  ActionBarGroup,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type {
  DataGrid1Labels,
  DataGrid1Person,
  DataGrid1Status,
  DataGrid1Ticket,
} from './types'

const statuses: readonly DataGrid1Status[] = ['open', 'pending', 'resolved']

const idsOf = ({ selectedRows }: ActionBarContext<DataGrid1Ticket>) =>
  selectedRows.map((ticket) => ticket.id)

export interface DataGrid1SelectionActionsOptions {
  labels: DataGrid1Labels
  onAssignOwner?: (ticketIds: string[], ownerId: string) => void
  onStatusUpdate?: (ticketIds: string[], status: DataGrid1Status) => void
  owners: readonly DataGrid1Person[]
}

export function createDataGrid1SelectionActions({
  labels,
  onAssignOwner,
  onStatusUpdate,
  owners,
}: DataGrid1SelectionActionsOptions): ActionBarGroup<DataGrid1Ticket>[] {
  const items: ActionBarGroup<DataGrid1Ticket>['items'] = []
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
