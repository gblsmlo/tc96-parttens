import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-select-column'
import {
  Inbox1DueField,
  Inbox1EntryField,
  type Inbox1FieldContext,
  Inbox1ReadField,
  Inbox1ReceivedField,
} from './inbox-1-fields'
import type { Inbox1Entry } from './types'

export function createInbox1Columns(
  context: Inbox1FieldContext,
): DataTableColumnDef<Inbox1Entry>[] {
  const { labels } = context
  const column = (id: keyof typeof labels.columns) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    createDataTableSelectColumn<Inbox1Entry>({
      getRowLabel: (entry) => labels.selectEntry(entry.title),
      selectAllLabel: labels.selectAll,
    }),
    {
      ...column('read'),
      cell: ({ row }) => (
        <Inbox1ReadField context={context} entry={row.original} />
      ),
      enableSorting: false,
      header: () => <span className="sr-only">{labels.columns.read}</span>,
      size: 40,
    },
    {
      ...column('entry'),
      accessorFn: (entry) => entry.title,
      cell: ({ row }) => (
        <Inbox1EntryField context={context} entry={row.original} />
      ),
      size: 360,
    },
    {
      ...column('origin'),
      accessorFn: (entry) => labels.origins[entry.origin],
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {labels.origins[row.original.origin]}
        </span>
      ),
      size: 140,
    },
    {
      ...column('reason'),
      accessorFn: (entry) => entry.reason,
      cell: ({ row }) => (
        <span className="block max-w-80 truncate text-muted-foreground">
          {row.original.reason}
        </span>
      ),
      size: 220,
    },
    {
      ...column('due'),
      accessorFn: (entry) => entry.due?.label ?? null,
      cell: ({ row }) => (
        <Inbox1DueField context={context} entry={row.original} />
      ),
      size: 180,
    },
    {
      ...column('received'),
      accessorFn: (entry) => entry.received,
      cell: ({ row }) => (
        <Inbox1ReceivedField context={context} entry={row.original} />
      ),
      size: 120,
    },
  ]
}
