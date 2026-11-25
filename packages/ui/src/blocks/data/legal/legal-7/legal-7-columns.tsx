import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-select-column'
import { Legal7AvailableField, type Legal7FieldContext } from './legal-7-fields'
import type { Legal7Publication } from './types'

export function createLegal7Columns(
  context: Legal7FieldContext,
): DataTableColumnDef<Legal7Publication>[] {
  const { formatDate, labels } = context
  const column = (id: keyof typeof labels.columns) => ({
    header: labels.columns[id],
    id,
    meta: { label: labels.columns[id] },
  })

  return [
    createDataTableSelectColumn<Legal7Publication>({
      getRowLabel: (item) =>
        labels.selectPublication(formatDate(item.availableOn), item.tribunal),
      selectAllLabel: labels.selectAll,
    }),
    {
      ...column('availableOn'),
      accessorFn: (item) => item.availableOn,
      cell: ({ row }) => (
        <Legal7AvailableField context={context} item={row.original} />
      ),
      size: 200,
    },
    {
      ...column('tribunal'),
      accessorFn: (item) => item.tribunal,
      size: 100,
    },
    {
      ...column('kind'),
      accessorFn: (item) => item.kind,
      size: 140,
    },
    {
      ...column('number'),
      accessorFn: (item) => item.number ?? labels.noNumber,
      cell: ({ row }) => (
        <span className="tabular-nums">
          {row.original.number ?? labels.noNumber}
        </span>
      ),
      size: 220,
    },
    {
      ...column('lawsuit'),
      accessorFn: (item) => item.lawsuitTitle ?? labels.noLawsuit,
      cell: ({ row }) => (
        <span className="block max-w-60 truncate">
          {row.original.lawsuitTitle ?? labels.noLawsuit}
        </span>
      ),
      size: 240,
    },
    {
      ...column('lawyers'),
      accessorFn: (item) => labels.lawyers(item.lawyers),
      cell: ({ row }) => (
        <span className="block max-w-56 truncate">
          {labels.lawyers(row.original.lawyers)}
        </span>
      ),
      size: 220,
    },
    {
      ...column('excerpt'),
      accessorFn: (item) => item.excerpt,
      cell: ({ row }) => (
        <span className="block max-w-80 truncate text-muted-foreground">
          {row.original.excerpt}
        </span>
      ),
      size: 320,
    },
  ]
}
