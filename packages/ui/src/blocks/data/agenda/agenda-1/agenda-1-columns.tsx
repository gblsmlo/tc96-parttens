import type { DataTableColumnDef } from '@tc96/ui/patterns/data-table/data-table-features'
import {
  DataCollectionCaption,
  DataCollectionTitleCell,
} from '../../shared/collection/data-collection-record-parts'
import {
  Agenda1CancelButton,
  type Agenda1FieldContext,
  Agenda1KindField,
  Agenda1ModalityField,
  Agenda1OwnerField,
  agenda1WhenOf,
} from './agenda-1-fields'
import type { Agenda1ColumnId, Agenda1Entry } from './types'

export function createAgenda1Columns(
  context: Agenda1FieldContext,
): DataTableColumnDef<Agenda1Entry>[] {
  const { labels, onCancel, owners } = context
  const column = (id: Agenda1ColumnId) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  const columns: DataTableColumnDef<Agenda1Entry>[] = [
    {
      ...column('title'),
      accessorFn: (entry) => entry.title,
      cell: ({ row }) => (
        <DataCollectionTitleCell
          caption={[
            ...(row.original.caption ? [row.original.caption] : []),
            ...(row.original.completed ? [labels.completed] : []),
          ]}
          title={row.original.title}
        />
      ),
      size: 320,
    },
    {
      ...column('kind'),
      accessorFn: (entry) => entry.kind,
      cell: ({ row }) => (
        <Agenda1KindField context={context} entry={row.original} />
      ),
      size: 160,
    },
    {
      ...column('when'),
      accessorFn: (entry) => entry.start,
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums">
          <DataCollectionCaption
            parts={agenda1WhenOf({ context, entry: row.original })}
          />
        </span>
      ),
      size: 260,
    },
    {
      ...column('modality'),
      accessorFn: (entry) => entry.modality ?? null,
      cell: ({ row }) => (
        <Agenda1ModalityField context={context} entry={row.original} />
      ),
      size: 170,
    },
    {
      ...column('location'),
      accessorFn: (entry) => entry.location ?? null,
      cell: ({ row }) => (
        <span className="block max-w-56 truncate">{row.original.location}</span>
      ),
      size: 220,
    },
  ]
  if (owners.length > 0)
    columns.push({
      ...column('owner'),
      accessorFn: (entry) => entry.ownerId ?? null,
      cell: ({ row }) => (
        <Agenda1OwnerField context={context} entry={row.original} />
      ),
      size: 190,
    })
  if (onCancel)
    columns.push({
      ...column('actions'),
      cell: ({ row }) => (
        <Agenda1CancelButton context={context} entry={row.original} />
      ),
      meta: { align: 'end', label: labels.columns.actions },
      size: 120,
    })
  return columns
}
