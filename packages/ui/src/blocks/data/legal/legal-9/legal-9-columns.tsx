import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import {
  Legal9AmountField,
  Legal9BillingModelField,
  type Legal9FieldContext,
  Legal9HolderField,
  Legal9OwnerField,
  Legal9StatusField,
} from './legal-9-fields'
import type { Legal9ColumnId, Legal9Record } from './types'

export function createLegal9Columns(
  context: Legal9FieldContext,
  selectable: boolean,
): DataTableColumnDef<Legal9Record>[] {
  const { labels } = context
  const column = (id: Legal9ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Legal9Record>({
            getRowLabel: (item) => labels.selectRecord(item.title),
            selectAllLabel: labels.selectAll,
          }),
        ]
      : []),
    {
      ...column('title'),
      accessorFn: (item) => item.title,
      cell: ({ row }) => (
        <span className="block min-w-40 max-w-80 truncate font-medium">
          {row.original.title}
        </span>
      ),
      size: 280,
    },
    {
      ...column('holder'),
      accessorFn: (item) => item.holder,
      cell: ({ row }) => (
        <Legal9HolderField context={context} item={row.original} />
      ),
      size: 220,
    },
    {
      ...column('billingModel'),
      accessorFn: (item) => item.billingModel,
      cell: ({ row }) => (
        <Legal9BillingModelField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('status'),
      accessorFn: (item) => item.status,
      cell: ({ row }) => (
        <Legal9StatusField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('amount'),
      accessorFn: (item) => item.amountCents,
      cell: ({ row }) => (
        <Legal9AmountField context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.amount },
      size: 150,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Legal9OwnerField context={context} item={row.original} />
      ),
      size: 190,
    },
  ]
}
