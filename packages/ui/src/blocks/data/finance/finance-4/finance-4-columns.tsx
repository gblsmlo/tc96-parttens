import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/data-table/data-table-select-column'
import { DataCollectionTitleCell } from '../../shared/collection/data-collection-record-parts'
import {
  Finance4AmountField,
  Finance4CaseField,
  Finance4ClientField,
  Finance4DueField,
  type Finance4FieldContext,
  Finance4KindField,
  Finance4ResponsibleField,
  Finance4SituationField,
} from './finance-4-fields'
import type { Finance4ColumnId, Finance4Entry } from './types'

export function createFinance4Columns(
  context: Finance4FieldContext,
  selectable: boolean,
): DataTableColumnDef<Finance4Entry>[] {
  const { caseById, labels } = context
  const column = (id: Finance4ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    ...(selectable
      ? [
          createDataTableSelectColumn<Finance4Entry>({
            getRowLabel: (entry) => labels.selectEntry(entry.description),
            selectAllLabel: labels.selectAll,
          }),
        ]
      : []),
    {
      ...column('description'),
      accessorFn: (entry) => entry.description,
      cell: ({ row }) => {
        const number = row.original.caseId
          ? caseById.get(row.original.caseId)?.number
          : null
        return (
          <DataCollectionTitleCell
            caption={number ? [number] : []}
            title={row.original.description}
          />
        )
      },
      enableHiding: false,
      size: 300,
    },
    {
      ...column('kind'),
      accessorFn: (entry) => entry.kind,
      cell: ({ row }) => (
        <Finance4KindField context={context} item={row.original} />
      ),
      size: 200,
    },
    {
      ...column('client'),
      accessorFn: (entry) => entry.clientId,
      cell: ({ row }) => (
        <Finance4ClientField context={context} item={row.original} />
      ),
      size: 200,
    },
    {
      ...column('case'),
      accessorFn: (entry) => entry.caseId,
      cell: ({ row }) => (
        <Finance4CaseField context={context} item={row.original} />
      ),
      size: 220,
    },
    {
      ...column('responsible'),
      accessorFn: (entry) => entry.responsibleId,
      cell: ({ row }) => (
        <Finance4ResponsibleField context={context} item={row.original} />
      ),
      size: 190,
    },
    {
      ...column('due'),
      accessorFn: (entry) => entry.dueOn,
      cell: ({ row }) => (
        <Finance4DueField context={context} item={row.original} />
      ),
      size: 140,
    },
    {
      ...column('amount'),
      accessorFn: (entry) => entry.amount,
      cell: ({ row }) => (
        <Finance4AmountField context={context} item={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.amount },
      size: 150,
    },
    {
      ...column('situation'),
      accessorFn: (entry) => entry.situation,
      cell: ({ row }) => (
        <Finance4SituationField context={context} item={row.original} />
      ),
      size: 160,
    },
  ]
}
