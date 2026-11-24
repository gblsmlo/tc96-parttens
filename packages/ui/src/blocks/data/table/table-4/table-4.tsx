'use client'

import { DataGridPagination } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid-pagination'
import { DataTable } from '@tc96/ui/patterns/collection/layouts/data-table/data-table'
import {
  type UseDataTableOptions,
  useDataTable,
} from '@tc96/ui/patterns/collection/layouts/data-table/use-data-table'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import {
  createTableFormatter,
  defaultTableCurrency,
  defaultTableLocale,
} from '../shared/format'
import { TableFrame } from '../shared/table-frame'
import { tableLoadState } from '../shared/table-load-state'
import { TableToolbar } from '../shared/table-toolbar'
import {
  applyDraft,
  createPriceFormat,
  draftCount,
  parseStock,
} from './edit-values'
import { resolveTable4Labels } from './labels'
import type { Table4Row } from './table-4-cells'
import { createTable4Columns } from './table-4-columns'
import { Table4Footer } from './table-4-footer'
import { Table4Skeleton } from './table-4-skeleton'
import { Table4Toolbar } from './table-4-toolbar'
import type { Table4Drafts, Table4EditableField, Table4Props } from './types'

type CellValueChange = Parameters<
  NonNullable<UseDataTableOptions<Table4Row>['onCellValueChange']>
>[0]

const noDrafts: Table4Drafts = {}

export function Table4({
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
}: Readonly<Table4Props>) {
  const labels = useMemo(() => resolveTable4Labels(labelsProp), [labelsProp])
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
      createTable4Columns({
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

  const rows = useMemo<Table4Row[]>(
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
    const field = columnId as Table4EditableField
    const parsed =
      field === 'price' ? priceFormat.parse(value) : parseStock(value)
    if (parsed === null) return
    onDraftsChange(applyDraft(drafts, product, field, parsed))
  }

  const { table } = useDataTable<Table4Row>({
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
    skeleton: <Table4Skeleton label={labels.loading} />,
  })

  const count = draftCount(drafts)
  const hasFooter = editable && Boolean(onSave || onDiscard)

  return (
    <TableFrame
      className={className}
      data-block="table-4"
      title={labels.title}
      toolbar={
        loadState ? (
          <TableToolbar
            aria-label={labels.toolbar}
            description={labels.description}
            title={labels.title}
          />
        ) : (
          <Table4Toolbar labels={labels} onAdd={onAdd} table={table} />
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
            <Table4Footer
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
