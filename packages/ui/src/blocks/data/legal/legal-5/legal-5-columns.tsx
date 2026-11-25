import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import {
  Legal5ClientsField,
  Legal5DeadlineField,
  type Legal5FieldContext,
  Legal5KindMark,
  Legal5NumberField,
  Legal5OwnerField,
  Legal5PhaseField,
  Legal5TagsField,
  Legal5UnarchiveButton,
} from './legal-5-fields'
import type { Legal5Record } from './types'

export function createLegal5Columns(
  context: Legal5FieldContext,
  selectable: boolean,
): DataTableColumnDef<Legal5Record>[] {
  const { labels } = context
  const column = (id: keyof typeof labels.columns) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Legal5Record>({
            getRowLabel: (item) => labels.selectRecord(item.title),
            selectAllLabel: labels.selectAll,
          }),
        ]
      : []),
    {
      ...column('title'),
      accessorFn: (item) => item.title,
      cell: ({ row }) => (
        <span className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate font-medium">
            {row.original.title}
          </span>
          <Legal5KindMark context={context} item={row.original} />
          <Legal5UnarchiveButton context={context} item={row.original} />
        </span>
      ),
      size: 320,
    },
    {
      ...column('number'),
      accessorFn: (item) => item.number,
      cell: ({ row }) => (
        <Legal5NumberField context={context} item={row.original} />
      ),
      size: 260,
    },
    {
      ...column('phase'),
      accessorFn: (item) => item.phaseId,
      cell: ({ row }) => (
        <Legal5PhaseField context={context} item={row.original} />
      ),
      size: 180,
    },
    {
      ...column('deadline'),
      accessorFn: (item) => item.nextDeadline?.label ?? null,
      cell: ({ row }) => <Legal5DeadlineField item={row.original} />,
      size: 170,
    },
    {
      ...column('clients'),
      accessorFn: (item) => item.clients,
      cell: ({ row }) => (
        <Legal5ClientsField context={context} item={row.original} />
      ),
      size: 220,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Legal5OwnerField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('tags'),
      accessorFn: (item) => item.tagIds,
      cell: ({ row }) => (
        <Legal5TagsField context={context} item={row.original} />
      ),
      size: 200,
    },
  ]
}
