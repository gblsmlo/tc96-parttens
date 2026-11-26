import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import {
  Crm3ContactField,
  Crm3DeadlineField,
  type Crm3FieldContext,
  Crm3NextActionField,
  Crm3OriginField,
  Crm3OwnerField,
  Crm3StageField,
  Crm3TagsField,
  Crm3ValueField,
} from './crm-3-fields'
import type { Crm3ColumnId, Crm3Lead } from './types'

export function createCrm3Columns(
  context: Crm3FieldContext,
  selectable: boolean,
): DataTableColumnDef<Crm3Lead>[] {
  const { labels } = context
  const column = (id: Crm3ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Crm3Lead>({
            getRowLabel: (item) => labels.selectRecord(item.title),
            selectAllLabel: labels.selectAll,
          }),
        ]
      : []),
    {
      ...column('title'),
      accessorFn: (item) => item.title,
      cell: ({ row }) => (
        <span className="block min-w-40 max-w-72 truncate font-medium">
          {row.original.title}
        </span>
      ),
      size: 280,
    },
    {
      ...column('contact'),
      accessorFn: (item) => item.contact,
      cell: ({ row }) => (
        <Crm3ContactField context={context} item={row.original} />
      ),
      size: 220,
    },
    {
      ...column('stage'),
      accessorFn: (item) => item.stageId,
      cell: ({ row }) => (
        <Crm3StageField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('origin'),
      accessorFn: (item) => item.origin,
      cell: ({ row }) => (
        <Crm3OriginField context={context} item={row.original} />
      ),
      size: 160,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Crm3OwnerField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('value'),
      accessorFn: (item) => item.valueCents,
      cell: ({ row }) => (
        <Crm3ValueField context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.value },
      size: 140,
    },
    {
      ...column('nextAction'),
      accessorFn: (item) => item.nextAction,
      cell: ({ row }) => (
        <Crm3NextActionField context={context} item={row.original} />
      ),
      size: 220,
    },
    {
      ...column('nextActionAt'),
      accessorFn: (item) => item.nextActionAt,
      cell: ({ row }) => (
        <Crm3DeadlineField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('tags'),
      accessorFn: (item) => item.tagIds,
      cell: ({ row }) => (
        <Crm3TagsField context={context} item={row.original} />
      ),
      size: 200,
    },
  ]
}
