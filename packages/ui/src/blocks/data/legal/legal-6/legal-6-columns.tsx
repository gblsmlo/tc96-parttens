import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import {
  Legal6DateField,
  Legal6DaysLeftField,
  Legal6DeadlineField,
  Legal6DecisionField,
  type Legal6FieldContext,
  Legal6OwnerField,
} from './legal-6-fields'
import type { Legal6Deadline } from './types'

export function createLegal6Columns(
  context: Legal6FieldContext,
  decides: boolean,
): DataTableColumnDef<Legal6Deadline>[] {
  const { labels } = context
  const column = (id: keyof typeof labels.columns) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  const columns: DataTableColumnDef<Legal6Deadline>[] = [
    {
      ...column('deadline'),
      accessorFn: (item) => item.label,
      cell: ({ row }) => <Legal6DeadlineField item={row.original} />,
      size: 260,
    },
    {
      ...column('lawsuit'),
      accessorFn: (item) => item.lawsuitTitle,
      cell: ({ row }) => (
        <span className="block max-w-80 truncate">
          {row.original.lawsuitTitle}
        </span>
      ),
      size: 280,
    },
    {
      ...column('client'),
      accessorFn: (item) => labels.clientList(item.clients),
      cell: ({ row }) => (
        <span className="block max-w-64 truncate">
          {labels.clientList(row.original.clients)}
        </span>
      ),
      size: 200,
    },
    {
      ...column('internalDate'),
      accessorFn: (item) => item.internalDate,
      cell: ({ row }) => (
        <Legal6DateField
          context={context}
          field="internalDate"
          item={row.original}
        />
      ),
      size: 140,
    },
    {
      ...column('fatalDate'),
      accessorFn: (item) => item.fatalDate,
      cell: ({ row }) => (
        <Legal6DateField
          context={context}
          field="fatalDate"
          item={row.original}
        />
      ),
      size: 140,
    },
    {
      ...column('daysLeft'),
      accessorFn: (item) => item.daysLeft.label,
      cell: ({ row }) => <Legal6DaysLeftField item={row.original} />,
      size: 160,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Legal6OwnerField context={context} item={row.original} />
      ),
      size: 190,
    },
  ]

  if (decides)
    columns.push({
      ...column('decision'),
      cell: ({ row }) => (
        <Legal6DecisionField context={context} item={row.original} />
      ),
      size: 200,
    })

  return columns
}
