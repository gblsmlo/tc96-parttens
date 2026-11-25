import type { DataTableColumnDef } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-features'
import { createDataTableSelectColumn } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-select-column'
import {
  Crm1DocumentField,
  Crm1EmailField,
  type Crm1FieldContext,
  Crm1NameCell,
  Crm1PhoneField,
  type Crm1Row,
  Crm1SectorField,
  Crm1TagsField,
} from './crm-1-fields'

type Column = DataTableColumnDef<Crm1Row>

export function createCrm1Columns(
  context: Crm1FieldContext,
  selectable: boolean,
): Column[] {
  const { labels, variant } = context
  const variantLabels = labels[variant]
  const header = (label: string, id: string) => ({
    header: label,
    id,
    meta: { label },
  })

  const name: Column = {
    ...header(variantLabels.columns.name, 'name'),
    accessorFn: (item) => item.name,
    cell: ({ row }) => <Crm1NameCell context={context} item={row.original} />,
    size: 280,
  }
  const phone: Column = {
    ...header(variantLabels.columns.phone, 'phone'),
    accessorFn: (item) => item.phone,
    cell: ({ row }) => <Crm1PhoneField context={context} item={row.original} />,
    size: 200,
  }
  const document: Column = {
    ...header(variantLabels.columns.document, 'document'),
    accessorFn: (item) => item.document,
    cell: ({ row }) => (
      <Crm1DocumentField context={context} item={row.original} />
    ),
    size: 220,
  }
  const tags: Column = {
    ...header(variantLabels.columns.tags, 'tags'),
    accessorFn: (item) => item.tagIds,
    cell: ({ row }) => <Crm1TagsField context={context} item={row.original} />,
    size: 220,
  }
  const select = selectable
    ? [
        createDataTableSelectColumn<Crm1Row>({
          getRowLabel: (item) => labels.selectRecord(item.name),
          selectAllLabel: variantLabels.selectAll,
        }),
      ]
    : []

  if (variant === 'people')
    return [
      ...select,
      name,
      {
        ...header(labels.people.columns.email, 'email'),
        accessorFn: (item) => item.email ?? null,
        cell: ({ row }) => (
          <Crm1EmailField context={context} item={row.original} />
        ),
        size: 260,
      },
      phone,
      document,
      tags,
    ]

  return [
    ...select,
    name,
    phone,
    document,
    {
      ...header(labels.companies.columns.sector, 'sector'),
      accessorFn: (item) => item.sectorId ?? null,
      cell: ({ row }) => (
        <Crm1SectorField context={context} item={row.original} />
      ),
      size: 180,
    },
    tags,
  ]
}
