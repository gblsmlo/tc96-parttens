import { DotsThreeIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { createSelectColumn } from '@tc96/ui/patterns/collection/layouts/data-grid/lib/create-select-column'
import {
  dataGrid1PriorityRank,
  PriorityCell,
  QueueCell,
  RequesterCell,
  SlaCell,
  StatusCell,
  TicketCell,
} from './data-grid-1-cells'
import type {
  DataGrid1ColumnId,
  DataGrid1Labels,
  DataGrid1RowAction,
  DataGrid1Ticket,
} from './types'

export interface DataGrid1ColumnsInput {
  labels: DataGrid1Labels
  onRowAction?: (actionId: string, ticketId: string) => void
  rowActions?: DataGrid1RowAction[]
}

const noSlaRank = Number.MAX_SAFE_INTEGER

export function createDataGrid1Columns({
  labels,
  onRowAction,
  rowActions,
}: Readonly<DataGrid1ColumnsInput>): UseDataGridOptions<DataGrid1Ticket>['columns'] {
  const title = (id: DataGrid1ColumnId) => labels.columns[id]

  const columns: UseDataGridOptions<DataGrid1Ticket>['columns'] = [
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
        <QueueCell labels={labels} queue={row.original.queue} />
      ),
      enableGlobalFilter: false,
      filterFn: 'equals',
      header: title('queue'),
      id: 'queue',
      meta: { label: title('queue') },
      size: 170,
    },
    {
      accessorFn: (ticket) => dataGrid1PriorityRank[ticket.priority],
      cell: ({ row }) => (
        <PriorityCell labels={labels} priority={row.original.priority} />
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
        <StatusCell labels={labels} status={row.original.status} />
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
