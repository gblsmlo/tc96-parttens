'use client'

import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import {
  type UseDataGridOptions,
  useDataGrid,
} from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import {
  createTableFormatter,
  defaultGridCurrency,
  defaultGridLocale,
} from '../shared/format'
import { GridFrame } from '../shared/grid-frame'
import { gridLoadState } from '../shared/grid-load-state'
import { GridToolbar } from '../shared/grid-toolbar'
import type { DataGrid4Row } from './data-grid-4-cells'
import { createDataGrid4Columns } from './data-grid-4-columns'
import { DataGrid4Footer } from './data-grid-4-footer'
import { DataGrid4Skeleton } from './data-grid-4-skeleton'
import { DataGrid4Toolbar } from './data-grid-4-toolbar'
import {
  applyDraft,
  createPriceFormat,
  draftCount,
  parseStock,
} from './edit-values'
import { resolveDataGrid4Labels } from './labels'
import type {
  DataGrid4Drafts,
  DataGrid4EditableField,
  DataGrid4Props,
} from './types'

type CellValueChange = Parameters<
  NonNullable<UseDataGridOptions<DataGrid4Row>['onCellValueChange']>
>[0]

const noDrafts: DataGrid4Drafts = {}

export function DataGrid4({
  cellErrors,
  className,
  currency = defaultGridCurrency,
  drafts = noDrafts,
  error,
  labels: labelsProp,
  locale = defaultGridLocale,
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
}: Readonly<DataGrid4Props>) {
  const labels = useMemo(() => resolveDataGrid4Labels(labelsProp), [labelsProp])
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
      createDataGrid4Columns({
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

  const rows = useMemo<DataGrid4Row[]>(
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
    const field = columnId as DataGrid4EditableField
    const parsed =
      field === 'price' ? priceFormat.parse(value) : parseStock(value)
    if (parsed === null) return
    onDraftsChange(applyDraft(drafts, product, field, parsed))
  }

  const { table } = useDataGrid<DataGrid4Row>({
    columns,
    data: rows,
    density: 'tall',
    enablePagination: true,
    getRowId: (product) => product.id,
    onCellValueChange: editable ? handleCellValueChange : undefined,
    pageSize,
    tableOptions: { autoResetPageIndex: false },
  })

  const loadState = gridLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <DataGrid4Skeleton label={labels.loading} />,
  })

  const count = draftCount(drafts)
  const hasFooter = editable && Boolean(onSave || onDiscard)

  return (
    <GridFrame
      className={className}
      data-block="data-grid-4"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar
            aria-label={labels.toolbar}
            description={labels.description}
            title={labels.title}
          />
        ) : (
          <DataGrid4Toolbar labels={labels} onAdd={onAdd} table={table} />
        )
      }
    >
      {loadState ?? (
        <>
          <DataGrid
            aria-label={labels.title}
            emptyMessage={labels.empty}
            table={table}
          />
          {hasFooter ? (
            <DataGrid4Footer
              count={count}
              labels={labels}
              onDiscard={onDiscard}
              onSave={onSave ? () => onSave(drafts) : undefined}
              saving={saving}
            />
          ) : null}
        </>
      )}
    </GridFrame>
  )
}
