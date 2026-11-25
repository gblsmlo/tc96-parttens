'use client'

import { DataGridPagination } from '@tc96/ui/patterns/data-grid/components/data-grid-pagination'
import { DataTable } from '@tc96/ui/patterns/data-table/data-table'
import {
  type UseDataTableOptions,
  useDataTable,
} from '@tc96/ui/patterns/data-table/use-data-table'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import {
  createTableFormatter,
  defaultTableCurrency,
  defaultTableLocale,
} from '../../shared/table/format'
import { TableFrame } from '../../shared/table/table-frame'
import { tableLoadState } from '../../shared/table/table-load-state'
import { TableToolbar } from '../../shared/table/table-toolbar'
import {
  applyDraft,
  createPriceFormat,
  draftCount,
  parseStock,
} from './edit-values'
import type { Inventory2Row } from './inventory-2-cells'
import { createInventory2Columns } from './inventory-2-columns'
import { Inventory2Footer } from './inventory-2-footer'
import { Inventory2Skeleton } from './inventory-2-skeleton'
import { Inventory2Toolbar } from './inventory-2-toolbar'
import { resolveInventory2Labels } from './labels'
import type {
  Inventory2Drafts,
  Inventory2EditableField,
  Inventory2Props,
} from './types'

type CellValueChange = Parameters<
  NonNullable<UseDataTableOptions<Inventory2Row>['onCellValueChange']>
>[0]

const noDrafts: Inventory2Drafts = {}

export function Inventory2({
  cellErrors,
  className,
  currency = defaultTableCurrency,
  drafts = noDrafts,
  error,
  labels: labelsProp,
  locale = defaultTableLocale,
  lowStockThreshold = 10,
  onAdd,
  onDiscard,
  onDraftsChange,
  onRetry,
  onRowAction,
  onSave,
  onVisibleChange,
  pageSize = 10,
  pending,
  products,
  rowActions,
  saving = false,
}: Readonly<Inventory2Props>) {
  const labels = useMemo(
    () => resolveInventory2Labels(labelsProp),
    [labelsProp],
  )
  const formatter = useMemo(
    () => createTableFormatter({ currency, locale }),
    [currency, locale],
  )
  const priceFormat = useMemo(() => createPriceFormat(locale), [locale])
  const handlersRef = useRef({ onRowAction, onVisibleChange })
  useLayoutEffect(() => {
    handlersRef.current = { onRowAction, onVisibleChange }
  })
  const handleRowAction = useCallback(
    (actionId: string, productId: string) =>
      handlersRef.current.onRowAction?.(actionId, productId),
    [],
  )
  const handleVisibleChange = useCallback(
    (productId: string, visible: boolean) =>
      handlersRef.current.onVisibleChange?.(productId, visible),
    [],
  )
  const hasRowMenu = Boolean(onRowAction)
  const hasVisibleChange = Boolean(onVisibleChange)
  const editable = Boolean(onDraftsChange)

  const columns = useMemo(
    () =>
      createInventory2Columns({
        cellErrors,
        editable,
        formatter,
        labels,
        lowStockThreshold,
        onRowAction: hasRowMenu ? handleRowAction : undefined,
        onVisibleChange: hasVisibleChange ? handleVisibleChange : undefined,
        priceFormat,
        rowActions,
      }),
    [
      cellErrors,
      editable,
      formatter,
      handleRowAction,
      handleVisibleChange,
      hasRowMenu,
      hasVisibleChange,
      labels,
      lowStockThreshold,
      priceFormat,
      rowActions,
    ],
  )

  const rows = useMemo<Inventory2Row[]>(
    () =>
      products.map((product) => ({
        ...product,
        ...drafts[product.id],
        saved: product,
      })),
    [drafts, products],
  )

  const handleCellValueChange = ({
    columnId,
    rowId,
    value,
  }: CellValueChange) => {
    const product = products.find((item) => item.id === rowId)
    if (!(product && onDraftsChange)) return
    const field = columnId as Inventory2EditableField
    const parsed =
      field === 'price' ? priceFormat.parse(value) : parseStock(value)
    if (parsed === null) return
    onDraftsChange(applyDraft(drafts, product, field, parsed))
  }

  const { table } = useDataTable<Inventory2Row>({
    columns,
    data: rows,
    density: 'tall',
    enablePagination: true,
    getRowId: (product) => product.id,
    onCellValueChange: editable ? handleCellValueChange : undefined,
    pageSize,
    tableOptions: { autoResetPageIndex: false },
  })

  const loadState = tableLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Inventory2Skeleton label={labels.loading} />,
  })

  const count = draftCount(drafts)
  const hasFooter = editable && Boolean(onSave || onDiscard)

  return (
    <TableFrame
      className={className}
      data-block="inventory-2"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar
            aria-label={labels.toolbar}
            left={
              <CollectionToolbarHeading>
                <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
                <CollectionToolbarDescription>
                  {labels.description}
                </CollectionToolbarDescription>
              </CollectionToolbarHeading>
            }
          />
        ) : (
          <Inventory2Toolbar labels={labels} onAdd={onAdd} table={table} />
        )
      }
    >
      {loadState ?? (
        <>
          <DataTable
            aria-label={labels.title}
            emptyMessage={labels.empty}
            table={table}
          />
          <DataGridPagination table={table} />
          {hasFooter ? (
            <Inventory2Footer
              count={count}
              labels={labels}
              onDiscard={onDiscard}
              onSave={onSave ? () => onSave(drafts) : undefined}
              saving={saving}
            />
          ) : null}
        </>
      )}
    </TableFrame>
  )
}
