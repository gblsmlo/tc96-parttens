import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { LegalTitleCell } from '../shared/legal-record-parts'
import {
  type Legal2FieldContext,
  Legal2OwnerField,
  Legal2QueueField,
  Legal2StatusField,
  Legal2TermField,
  Legal2ValueText,
} from './legal-2-fields'
import type { Legal2Contract } from './types'

export function createLegal2Columns(
  context: Legal2FieldContext,
): DataTableColumnDef<Legal2Contract>[] {
  const { labels } = context
  const column = (id: keyof typeof labels.columns) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    {
      ...column('contract'),
      accessorFn: (item) => `${item.title} ${item.code}`,
      cell: ({ row }) => (
        <LegalTitleCell
          caption={[row.original.code]}
          title={row.original.title}
        />
      ),
      size: 300,
    },
    {
      ...column('type'),
      accessorFn: (item) => labels.types[item.type],
      size: 170,
    },
    {
      ...column('parties'),
      accessorFn: (item) => `${item.client} ${item.counterparty}`,
      cell: ({ row }) => (
        <span className="grid min-w-0 gap-0.5">
          <span className="truncate">{row.original.client}</span>
          <span className="truncate text-muted-foreground text-xs">
            {row.original.counterparty}
          </span>
        </span>
      ),
      size: 220,
    },
    {
      ...column('value'),
      accessorFn: (item) => item.value,
      cell: ({ row }) => (
        <Legal2ValueText context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.value },
      size: 140,
    },
    {
      ...column('term'),
      accessorFn: (item) => item.endsOn,
      cell: ({ row }) => (
        <Legal2TermField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Legal2OwnerField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('queue'),
      accessorFn: (item) => item.queue,
      cell: ({ row }) => (
        <Legal2QueueField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('status'),
      accessorFn: (item) => item.status,
      cell: ({ row }) => (
        <Legal2StatusField context={context} item={row.original} />
      ),
      size: 150,
    },
  ]
}
