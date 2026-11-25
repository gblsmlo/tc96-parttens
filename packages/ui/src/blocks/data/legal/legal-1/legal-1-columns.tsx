import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { DataCollectionCaption } from '../../shared/collection/data-collection-record-parts'
import {
  Legal1DeadlineField,
  type Legal1FieldContext,
  Legal1NumberField,
  Legal1OwnerField,
  Legal1QueueField,
  Legal1StatusField,
} from './legal-1-fields'
import type { Legal1Case } from './types'

export function createLegal1Columns(
  context: Legal1FieldContext,
): DataTableColumnDef<Legal1Case>[] {
  const { labels } = context
  const column = (id: keyof typeof labels.columns) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    {
      ...column('title'),
      accessorFn: (item) => item.title,
      cell: ({ row }) => (
        <span className="block truncate font-medium">{row.original.title}</span>
      ),
      size: 300,
    },
    {
      ...column('number'),
      accessorFn: (item) => item.number,
      cell: ({ row }) => (
        <Legal1NumberField context={context} item={row.original} />
      ),
      size: 260,
    },
    {
      ...column('client'),
      accessorFn: (item) => item.client,
      size: 200,
    },
    {
      ...column('area'),
      accessorFn: (item) => labels.areas[item.area],
      size: 120,
    },
    {
      ...column('phase'),
      accessorFn: (item) => labels.phases[item.phase],
      size: 140,
    },
    {
      ...column('court'),
      accessorFn: (item) => `${item.instance ?? ''} ${item.court ?? ''}`,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          <DataCollectionCaption
            parts={
              row.original.instance && row.original.court
                ? [row.original.instance, row.original.court]
                : [labels.noCourt]
            }
          />
        </span>
      ),
      size: 200,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Legal1OwnerField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('deadline'),
      accessorFn: (item) => item.nextDeadline,
      cell: ({ row }) => (
        <Legal1DeadlineField context={context} item={row.original} />
      ),
      size: 150,
    },
    {
      ...column('queue'),
      accessorFn: (item) => item.queue,
      cell: ({ row }) => (
        <Legal1QueueField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('status'),
      accessorFn: (item) => item.status,
      cell: ({ row }) => (
        <Legal1StatusField context={context} item={row.original} />
      ),
      size: 150,
    },
  ]
}
