import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { createSelectColumn } from '@tc96/ui/patterns/collection/layouts/data-grid/lib/create-select-column'
import {
  dataPriorities,
  dataPriorityAppearance,
  dataPriorityRank,
} from '../../shared/properties/data-priority'
import {
  DataSelect,
  dataSelectOptions,
} from '../../shared/properties/data-properties'
import { RequesterCell, SlaCell, TicketCell } from './support-1-cells'
import {
  support1QueueAppearance,
  support1Queues,
  support1StatusAppearance,
  support1Statuses,
} from './support-1-options'
import type {
  Support1ColumnId,
  Support1Labels,
  Support1RowAction,
  Support1Ticket,
} from './types'

export interface Support1ColumnsInput {
  labels: Support1Labels
  onRowAction?: (actionId: string, ticketId: string) => void
  rowActions?: Support1RowAction[]
}

const noSlaRank = Number.MAX_SAFE_INTEGER

export function createSupport1Columns({
  labels,
  onRowAction,
  rowActions,
}: Readonly<Support1ColumnsInput>): UseDataGridOptions<Support1Ticket>['columns'] {
  const title = (id: Support1ColumnId) => labels.columns[id]
  const queueOptions = dataSelectOptions(
    support1Queues,
    labels.queues,
    support1QueueAppearance,
  )
  const priorityOptions = dataSelectOptions(
    dataPriorities,
    labels.priorities,
    dataPriorityAppearance,
  )
  const statusOptions = dataSelectOptions(
    support1Statuses,
    labels.statuses,
    support1StatusAppearance,
  )

  const columns: UseDataGridOptions<Support1Ticket>['columns'] = [
    createSelectColumn({
      getRowLabel: (ticket) => labels.selectTicket(ticket.code),
      selectAllLabel: labels.selectAll,
      showRowNumbers: false,
    }),
    {
      accessorFn: (ticket) => `${ticket.title} ${ticket.code}`,
      cell: ({ row }) => <TicketCell ticket={row.original} />,
      enableColumnFilter: false,
      enableHiding: false,
      header: title('ticket'),
      id: 'ticket',
      meta: { label: title('ticket') },
      size: 380,
    },
    {
      accessorFn: (ticket) =>
        `${ticket.requester.name} ${ticket.requester.company}`,
      cell: ({ row }) => <RequesterCell ticket={row.original} />,
      enableColumnFilter: false,
      header: title('requester'),
      id: 'requester',
      meta: { label: title('requester') },
      size: 210,
    },
    {
      accessorFn: (ticket) => ticket.queue,
      cell: ({ row }) => (
        <DataSelect
          ariaLabel={title('queue')}
          options={queueOptions}
          value={row.original.queue}
        />
      ),
      enableGlobalFilter: false,
      filterFn: 'equals',
      header: title('queue'),
      id: 'queue',
      meta: { label: title('queue') },
      size: 170,
    },
    {
      accessorFn: (ticket) => dataPriorityRank[ticket.priority],
      cell: ({ row }) => (
        <DataSelect
          ariaLabel={title('priority')}
          options={priorityOptions}
          value={row.original.priority}
        />
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      header: title('priority'),
      id: 'priority',
      meta: { label: title('priority') },
      size: 130,
    },
    {
      accessorFn: (ticket) => ticket.sla.dueInMinutes ?? noSlaRank,
      cell: ({ row }) => <SlaCell sla={row.original.sla} />,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      header: title('sla'),
      id: 'sla',
      meta: { label: title('sla') },
      size: 200,
    },
    {
      accessorFn: (ticket) => ticket.status,
      cell: ({ row }) => (
        <DataSelect
          ariaLabel={title('status')}
          options={statusOptions}
          value={row.original.status}
        />
      ),
      enableGlobalFilter: false,
      filterFn: 'equals',
      header: title('status'),
      id: 'status',
      meta: { label: title('status') },
      size: 140,
    },
  ]

  if (onRowAction && rowActions?.length) {
    columns.push({
      cell: ({ row }) => (
        <Menu>
          <MenuTrigger
            aria-label={labels.rowActionsFor(row.original.code)}
            render={<Button size="icon-sm" variant="ghost" />}
          >
            <DotsThreeIcon aria-hidden="true" />
          </MenuTrigger>
          <MenuPopup align="end">
            {rowActions.map((action) => (
              <MenuItem
                key={action.id}
                onClick={() => onRowAction(action.id, row.original.id)}
                variant={action.destructive ? 'destructive' : undefined}
              >
                {action.label}
              </MenuItem>
            ))}
          </MenuPopup>
        </Menu>
      ),
      enableColumnFilter: false,
      enableHiding: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
      header: () => <span className="sr-only">{title('actions')}</span>,
      id: 'actions',
      meta: { align: 'end', label: title('actions') },
      size: 56,
    })
  }

  return columns
}
