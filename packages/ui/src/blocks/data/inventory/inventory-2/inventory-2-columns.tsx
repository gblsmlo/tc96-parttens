import type { DataTableColumnMeta } from '@tc96/ui/patterns/collection/layouts/data-table/data-table-aggregation'
import type { UseDataTableOptions } from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { dataSelectOptions } from '../../shared/properties/data-properties'
import type { TableFormatter } from '../../shared/table/format'
import { type Inventory2PriceFormat, parseStock } from './edit-values'
import {
  EditableNumberCell,
  type Inventory2Row,
  LowStockIcon,
  ProductCell,
  RowActionsCell,
  StatusCell,
  VisibleCell,
} from './inventory-2-cells'
import {
  inventory2StatusAppearance,
  inventory2Statuses,
} from './inventory-2-options'
import type {
  Inventory2CellErrors,
  Inventory2ColumnId,
  Inventory2EditableField,
  Inventory2Labels,
  Inventory2RowAction,
} from './types'

export interface Inventory2ColumnsInput {
  cellErrors?: Inventory2CellErrors
  editable: boolean
  formatter: TableFormatter
  labels: Inventory2Labels
  lowStockThreshold: number
  onRowAction?: (actionId: string, productId: string) => void
  onVisibleChange?: (productId: string, visible: boolean) => void
  priceFormat: Inventory2PriceFormat
  rowActions?: Inventory2RowAction[]
}

const isChanged = (row: Inventory2Row, field: Inventory2EditableField) =>
  row[field] !== row.saved[field]

export function createInventory2Columns({
  cellErrors,
  editable,
  formatter,
  labels,
  lowStockThreshold,
  onRowAction,
  onVisibleChange,
  priceFormat,
  rowActions,
}: Readonly<Inventory2ColumnsInput>): UseDataTableOptions<Inventory2Row>['columns'] {
  const statusOptions = dataSelectOptions(
    inventory2Statuses,
    labels.statuses,
    inventory2StatusAppearance,
  )
  const title = (id: Inventory2ColumnId) => labels.columns[id]
  const getCellError = (row: { id: string }, columnId: string) =>
    cellErrors?.[row.id]?.[columnId as Inventory2EditableField]

  const columns: UseDataTableOptions<Inventory2Row>['columns'] = [
    {
      accessorFn: (product) => `${product.name} ${product.sku}`,
      cell: ({ row }) => <ProductCell product={row.original} />,
      enableHiding: false,
      header: title('product'),
      id: 'product',
      meta: { label: title('product') },
      size: 260,
    },
    {
      accessorFn: (product) => product.category,
      cell: ({ row }) => (
        <span className="truncate">{row.original.category}</span>
      ),
      header: title('category'),
      id: 'category',
      meta: { label: title('category') },
      size: 160,
    },
    {
      accessorFn: (product) => priceFormat.format(product.price),
      cell: (context) => (
        <EditableNumberCell
          changed={isChanged(context.row.original, 'price')}
          context={context}
          editable={editable}
          labels={labels}
          text={formatter.money(context.row.original.price, 2)}
        />
      ),
      enableGlobalFilter: false,
      header: title('price'),
      id: 'price',
      meta: {
        align: 'end',
        editable,
        emptyLabel: labels.emptyValue,
        formatValue: (value) => {
          const price = priceFormat.parse(value)
          return price === null ? value : formatter.money(price, 2)
        },
        getCellError,
        getCellLabel: labels.cellLabel,
        label: title('price'),
        validate: (value) => {
          const price = priceFormat.parse(value)
          if (price === null) return labels.priceInvalid
          if (price < 0) return labels.priceNegative
          return undefined
        },
        variant: 'number',
      } satisfies DataTableColumnMeta<Inventory2Row>,
      sortFn: (a, b) => a.original.price - b.original.price,
      size: 150,
    },
    {
      accessorFn: (product) => String(product.stock),
      cell: (context) => {
        const stock = context.row.original.stock
        return (
          <EditableNumberCell
            changed={isChanged(context.row.original, 'stock')}
            context={context}
            editable={editable}
            labels={labels}
            text={formatter.number(stock)}
            adornment={
              stock < lowStockThreshold ? (
                <LowStockIcon labels={labels} />
              ) : undefined
            }
          />
        )
      },
      enableGlobalFilter: false,
      header: title('stock'),
      id: 'stock',
      meta: {
        align: 'end',
        editable,
        emptyLabel: labels.emptyValue,
        formatValue: (value) => {
          const stock = parseStock(value)
          return stock === null ? value : formatter.number(stock)
        },
        getCellError,
        getCellLabel: labels.cellLabel,
        label: title('stock'),
        validate: (value) => {
          const stock = parseStock(value)
          if (stock === null) return labels.stockNotInteger
          if (stock < 0) return labels.stockNegative
          return undefined
        },
        variant: 'number',
      } satisfies DataTableColumnMeta<Inventory2Row>,
      sortFn: (a, b) => a.original.stock - b.original.stock,
      size: 130,
    },
    {
      accessorFn: (product) => product.status,
      cell: ({ row }) => (
        <StatusCell
          labels={labels}
          options={statusOptions}
          status={row.original.status}
        />
      ),
      enableGlobalFilter: false,
      filterFn: 'equals',
      header: title('status'),
      id: 'status',
      meta: { label: title('status') },
      size: 130,
    },
    {
      accessorFn: (product) => product.visible,
      cell: ({ row }) => (
        <VisibleCell
          labels={labels}
          onVisibleChange={onVisibleChange}
          product={row.original}
        />
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableSorting: false,
      header: title('visible'),
      id: 'visible',
      meta: { label: title('visible') },
      size: 110,
    },
  ]

  if (onRowAction && rowActions?.length) {
    columns.push({
      cell: ({ row }) => (
        <RowActionsCell
          actions={rowActions}
          labels={labels}
          onRowAction={onRowAction}
          product={row.original}
        />
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableHiding: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
      header: () => <span className="sr-only">{title('actions')}</span>,
      id: 'actions',
      meta: { align: 'end', label: title('actions') },
      size: 56,
    })
  }

  return columns
}
