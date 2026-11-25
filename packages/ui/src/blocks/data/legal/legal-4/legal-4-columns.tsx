import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { DataCollectionTitleCell } from '../../shared/collection/data-collection-record-parts'
import {
  type Legal4FieldContext,
  Legal4OwnerField,
  Legal4QueueField,
  Legal4SinceField,
  Legal4StatusField,
} from './legal-4-fields'
import type { Legal4Client } from './types'

export function createLegal4Columns(
  context: Legal4FieldContext,
): DataTableColumnDef<Legal4Client>[] {
  const { labels } = context
  const column = (id: keyof typeof labels.columns) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    {
      ...column('client'),
      accessorFn: (item) => item.name,
      cell: ({ row }) => (
        <DataCollectionTitleCell
          caption={[labels.kinds[row.original.kind]]}
          title={row.original.name}
        />
      ),
      size: 260,
    },
    {
      ...column('contact'),
      accessorFn: (item) => item.contact?.name ?? '',
      cell: ({ row }) =>
        row.original.contact ? (
          <DataCollectionTitleCell
            caption={[row.original.contact.email]}
            title={row.original.contact.name}
          />
        ) : (
          <span className="text-muted-foreground">{labels.noContact}</span>
        ),
      size: 240,
    },
    {
      ...column('cases'),
      accessorFn: (item) => item.activeCases,
      meta: { align: 'end', label: labels.columns.cases },
      size: 140,
    },
    {
      ...column('contracts'),
      accessorFn: (item) => item.contracts,
      meta: { align: 'end', label: labels.columns.contracts },
      size: 110,
    },
    {
      ...column('since'),
      accessorFn: (item) => item.clientSince,
      cell: ({ row }) => (
        <Legal4SinceField context={context} item={row.original} />
      ),
      size: 150,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Legal4OwnerField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('queue'),
      accessorFn: (item) => item.queue,
      cell: ({ row }) => (
        <Legal4QueueField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('status'),
      accessorFn: (item) => item.status,
      cell: ({ row }) => (
        <Legal4StatusField context={context} item={row.original} />
      ),
      size: 160,
    },
  ]
}
