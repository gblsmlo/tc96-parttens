import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import {
  Documents3AccessField,
  Documents3CreatedAtField,
  Documents3CreatedByField,
  type Documents3FieldContext,
  Documents3LinkedToField,
  Documents3NameField,
  Documents3SizeField,
  Documents3TypeField,
  documents3SizeOf,
} from './documents-3-fields'
import { documents3TypeOf } from './documents-3-options'
import {
  Documents3RowActions,
  hasDocuments3RowActions,
} from './documents-3-row-actions'
import type { Documents3Record } from './types'

export function createDocuments3Columns(
  context: Documents3FieldContext,
): DataTableColumnDef<Documents3Record>[] {
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
        <Documents3NameField context={context} item={row.original} />
      ),
      size: 340,
    },
    {
      ...column('type'),
      accessorFn: (item) => documents3TypeOf(item),
      cell: ({ row }) => (
        <Documents3TypeField context={context} item={row.original} />
      ),
      size: 150,
    },
    {
      ...column('linkedTo'),
      accessorFn: (item) => item.linkedTo,
      cell: ({ row }) => (
        <Documents3LinkedToField context={context} item={row.original} />
      ),
      size: 220,
    },
    {
      ...column('access'),
      accessorFn: (item) => item.access,
      cell: ({ row }) => (
        <Documents3AccessField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('createdBy'),
      accessorFn: (item) => item.createdById,
      cell: ({ row }) => (
        <Documents3CreatedByField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('createdAt'),
      accessorFn: (item) => item.createdAt,
      cell: ({ row }) => (
        <Documents3CreatedAtField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('size'),
      accessorFn: (item) => documents3SizeOf(item),
      cell: ({ row }) => (
        <Documents3SizeField context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.size },
      size: 110,
    },
    ...(hasDocuments3RowActions(context)
      ? [
          {
            cell: ({ row }) => (
              <Documents3RowActions context={context} item={row.original} />
            ),
            enableSorting: false,
            header: () => (
              <span className="sr-only">{labels.columns.actions}</span>
            ),
            id: 'actions',
            meta: { align: 'end', label: labels.columns.actions },
            size: 56,
          } satisfies DataTableColumnDef<Documents3Record>,
        ]
      : []),
  ]
}
