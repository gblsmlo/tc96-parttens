import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import {
  type Documents5FieldContext,
  Documents5OwnerField,
  Documents5PinnedMark,
  Documents5SizeField,
  Documents5TypeField,
  Documents5TypeIcon,
  Documents5UpdatedField,
} from './documents-5-fields'
import {
  Documents5RowActions,
  hasDocuments5RowActions,
} from './documents-5-row-actions'
import type { Documents5ColumnId, Documents5Record } from './types'

export function createDocuments5Columns(
  context: Documents5FieldContext,
  selectable: boolean,
): DataTableColumnDef<Documents5Record>[] {
  const { labels } = context
  const column = (id: Documents5ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Documents5Record>({
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
          <Documents5TypeIcon context={context} item={row.original} size="sm" />
          <span className="min-w-0 truncate font-medium">
            {row.original.name}
          </span>
          <Documents5PinnedMark context={context} item={row.original} />
        </span>
      ),
      size: 360,
    },
    {
      ...column('type'),
      accessorFn: (item) => item.type,
      cell: ({ row }) => (
        <Documents5TypeField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Documents5OwnerField context={context} item={row.original} />
      ),
      size: 200,
    },
    {
      ...column('updated'),
      accessorFn: (item) => item.updatedAt,
      cell: ({ row }) => (
        <Documents5UpdatedField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('size'),
      accessorFn: (item) => item.size ?? null,
      cell: ({ row }) => (
        <Documents5SizeField context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.size },
      size: 100,
    },
    ...(hasDocuments5RowActions(context)
      ? [
          {
            cell: ({ row }) => (
              <Documents5RowActions context={context} item={row.original} />
            ),
            enableSorting: false,
            header: () => (
              <span className="sr-only">{labels.columns.actions}</span>
            ),
            id: 'actions',
            meta: { align: 'end', label: labels.columns.actions },
            size: 56,
          } satisfies DataTableColumnDef<Documents5Record>,
        ]
      : []),
  ]
}
