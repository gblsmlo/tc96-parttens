import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import {
  Documents1AccessField,
  Documents1CreatedAtField,
  Documents1CreatedByField,
  type Documents1FieldContext,
  Documents1LinkedToField,
  Documents1NameField,
  Documents1SizeField,
  Documents1TypeField,
  documents1SizeOf,
} from './documents-1-fields'
import { documents1TypeOf } from './documents-1-options'
import {
  Documents1RowActions,
  hasDocuments1RowActions,
} from './documents-1-row-actions'
import type { Documents1Record } from './types'

export function createDocuments1Columns(
  context: Documents1FieldContext,
): DataTableColumnDef<Documents1Record>[] {
  const { labels } = context
  const column = (id: keyof typeof labels.columns) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    {
      ...column('name'),
      accessorFn: (item) => item.name,
      cell: ({ row }) => (
        <Documents1NameField context={context} item={row.original} />
      ),
      size: 340,
    },
    {
      ...column('type'),
      accessorFn: (item) => documents1TypeOf(item),
      cell: ({ row }) => (
        <Documents1TypeField context={context} item={row.original} />
      ),
      size: 150,
    },
    {
      ...column('linkedTo'),
      accessorFn: (item) => item.linkedTo,
      cell: ({ row }) => (
        <Documents1LinkedToField context={context} item={row.original} />
      ),
      size: 220,
    },
    {
      ...column('access'),
      accessorFn: (item) => item.access,
      cell: ({ row }) => (
        <Documents1AccessField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('createdBy'),
      accessorFn: (item) => item.createdById,
      cell: ({ row }) => (
        <Documents1CreatedByField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('createdAt'),
      accessorFn: (item) => item.createdAt,
      cell: ({ row }) => (
        <Documents1CreatedAtField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('size'),
      accessorFn: (item) => documents1SizeOf(item),
      cell: ({ row }) => (
        <Documents1SizeField context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.size },
      size: 110,
    },
    ...(hasDocuments1RowActions(context)
      ? [
          {
            cell: ({ row }) => (
              <Documents1RowActions context={context} item={row.original} />
            ),
            enableSorting: false,
            header: () => (
              <span className="sr-only">{labels.columns.actions}</span>
            ),
            id: 'actions',
            meta: { align: 'end', label: labels.columns.actions },
            size: 56,
          } satisfies DataTableColumnDef<Documents1Record>,
        ]
      : []),
  ]
}
