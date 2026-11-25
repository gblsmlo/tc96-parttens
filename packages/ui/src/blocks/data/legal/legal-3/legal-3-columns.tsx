import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { DataCollectionTitleCell } from '../../shared/collection/data-collection-record-parts'
import {
  Legal3DueField,
  type Legal3FieldContext,
  Legal3OwnerField,
  Legal3QueueField,
  Legal3StatusField,
} from './legal-3-fields'
import type { Legal3Deadline } from './types'

export function createLegal3Columns(
  context: Legal3FieldContext,
): DataTableColumnDef<Legal3Deadline>[] {
  const { labels } = context
  const column = (id: keyof typeof labels.columns) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    {
      ...column('deadline'),
      accessorFn: (item) => item.title,
      cell: ({ row }) => (
        <DataCollectionTitleCell
          caption={[labels.kinds[row.original.kind]]}
          title={row.original.title}
        />
      ),
      size: 280,
    },
    {
      ...column('case'),
      accessorFn: (item) => `${item.caseTitle} ${item.caseNumber}`,
      cell: ({ row }) => (
        <DataCollectionTitleCell
          caption={[row.original.caseNumber]}
          title={row.original.caseTitle}
        />
      ),
      size: 280,
    },
    {
      ...column('due'),
      accessorFn: (item) => item.dueAt,
      cell: ({ row }) => (
        <Legal3DueField context={context} item={row.original} />
      ),
      size: 150,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Legal3OwnerField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('queue'),
      accessorFn: (item) => item.queue,
      cell: ({ row }) => (
        <Legal3QueueField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('status'),
      accessorFn: (item) => item.status,
      cell: ({ row }) => (
        <Legal3StatusField context={context} item={row.original} />
      ),
      size: 150,
    },
  ]
}
