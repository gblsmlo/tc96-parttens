import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import {
  Crm2ContactField,
  Crm2DeadlineField,
  type Crm2FieldContext,
  Crm2NextActionField,
  Crm2OriginField,
  Crm2OwnerField,
  Crm2StageField,
  Crm2TagsField,
  Crm2ValueField,
} from './crm-2-fields'
import type { Crm2ColumnId, Crm2Lead } from './types'

export function createCrm2Columns(
  context: Crm2FieldContext,
  selectable: boolean,
): DataTableColumnDef<Crm2Lead>[] {
  const { labels } = context
  const column = (id: Crm2ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Crm2Lead>({
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
        <Crm2ContactField context={context} item={row.original} />
      ),
      size: 220,
    },
    {
      ...column('stage'),
      accessorFn: (item) => item.stageId,
      cell: ({ row }) => (
        <Crm2StageField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('origin'),
      accessorFn: (item) => item.origin,
      cell: ({ row }) => (
        <Crm2OriginField context={context} item={row.original} />
      ),
      size: 160,
    },
    {
      ...column('owner'),
      accessorFn: (item) => item.ownerId,
      cell: ({ row }) => (
        <Crm2OwnerField context={context} item={row.original} />
      ),
      size: 170,
    },
    {
      ...column('value'),
      accessorFn: (item) => item.valueCents,
      cell: ({ row }) => (
        <Crm2ValueField context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.value },
      size: 140,
    },
    {
      ...column('nextAction'),
      accessorFn: (item) => item.nextAction,
      cell: ({ row }) => (
        <Crm2NextActionField context={context} item={row.original} />
      ),
      size: 220,
    },
    {
      ...column('nextActionAt'),
      accessorFn: (item) => item.nextActionAt,
      cell: ({ row }) => (
        <Crm2DeadlineField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('tags'),
      accessorFn: (item) => item.tagIds,
      cell: ({ row }) => (
        <Crm2TagsField context={context} item={row.original} />
      ),
      size: 200,
    },
  ]
}
