import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import {
  type Documents4FieldContext,
  Documents4OwnerField,
  Documents4PinnedMark,
  Documents4SizeField,
  Documents4TypeField,
  Documents4TypeIcon,
  Documents4UpdatedField,
} from './documents-4-fields'
import {
  Documents4RowActions,
  hasDocuments4RowActions,
} from './documents-4-row-actions'
import type { Documents4ColumnId, Documents4Record } from './types'

export function createDocuments4Columns(
  context: Documents4FieldContext,
  selectable: boolean,
): DataTableColumnDef<Documents4Record>[] {
  const { labels } = context
  const column = (id: Documents4ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Documents4Record>({
            getRowLabel: (item) => labels.selectRecord(item.name),
            selectAllLabel: labels.selectAll,
          }),
        ]
      : []),
    {
      ...column('name'),
      accessorFn: (item) => item.name,
      cell: ({ row }) => (
        <span className="flex min-w-56 max-w-96 items-center gap-2">
          <Documents4TypeIcon context={context} item={row.original} size="sm" />
          <span className="min-w-0 truncate font-medium">
            {row.original.name}
          </span>
          <Documents4PinnedMark context={context} item={row.original} />
        </span>
      ),
      size: 360,
    },
    {
      ...column('type'),
      accessorFn: (item) => item.type,
      cell: ({ row }) => (
        <Documents4TypeField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Documents4OwnerField context={context} item={row.original} />
      ),
      size: 200,
    },
    {
      ...column('updated'),
      accessorFn: (item) => item.updatedAt,
      cell: ({ row }) => (
        <Documents4UpdatedField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('size'),
      accessorFn: (item) => item.size ?? null,
      cell: ({ row }) => (
        <Documents4SizeField context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.size },
      size: 100,
    },
    ...(hasDocuments4RowActions(context)
      ? [
          {
            cell: ({ row }) => (
              <Documents4RowActions context={context} item={row.original} />
            ),
            enableSorting: false,
            header: () => (
              <span className="sr-only">{labels.columns.actions}</span>
            ),
            id: 'actions',
            meta: { align: 'end', label: labels.columns.actions },
            size: 56,
          } satisfies DataTableColumnDef<Documents4Record>,
        ]
      : []),
  ]
}
