import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import {
  type Documents2FieldContext,
  Documents2OwnerField,
  Documents2PinnedMark,
  Documents2SizeField,
  Documents2TypeField,
  Documents2TypeIcon,
  Documents2UpdatedField,
} from './documents-2-fields'
import {
  Documents2RowActions,
  hasDocuments2RowActions,
} from './documents-2-row-actions'
import type { Documents2ColumnId, Documents2Record } from './types'

export function createDocuments2Columns(
  context: Documents2FieldContext,
  selectable: boolean,
): DataTableColumnDef<Documents2Record>[] {
  const { labels } = context
  const column = (id: Documents2ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Documents2Record>({
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
          <Documents2TypeIcon context={context} item={row.original} size="sm" />
          <span className="min-w-0 truncate font-medium">
            {row.original.name}
          </span>
          <Documents2PinnedMark context={context} item={row.original} />
        </span>
      ),
      size: 360,
    },
    {
      ...column('type'),
      accessorFn: (item) => item.type,
      cell: ({ row }) => (
        <Documents2TypeField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Documents2OwnerField context={context} item={row.original} />
      ),
      size: 200,
    },
    {
      ...column('updated'),
      accessorFn: (item) => item.updatedAt,
      cell: ({ row }) => (
        <Documents2UpdatedField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('size'),
      accessorFn: (item) => item.size ?? null,
      cell: ({ row }) => (
        <Documents2SizeField context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.size },
      size: 100,
    },
    ...(hasDocuments2RowActions(context)
      ? [
          {
            cell: ({ row }) => (
              <Documents2RowActions context={context} item={row.original} />
            ),
            enableSorting: false,
            header: () => (
              <span className="sr-only">{labels.columns.actions}</span>
            ),
            id: 'actions',
            meta: { align: 'end', label: labels.columns.actions },
            size: 56,
          } satisfies DataTableColumnDef<Documents2Record>,
        ]
      : []),
  ]
}
