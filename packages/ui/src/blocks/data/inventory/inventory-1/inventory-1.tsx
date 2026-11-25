'use client'

import { DataGrid } from '@tc96/ui/patterns/collection/layouts/data-grid/components/data-grid'
import {
  type UseDataGridOptions,
  useDataGrid,
} from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import {
  createTableFormatter,
  defaultGridCurrency,
  defaultGridLocale,
} from '../../shared/grid/format'
import { GridFrame } from '../../shared/grid/grid-frame'
import { gridLoadState } from '../../shared/grid/grid-load-state'
import { GridToolbar } from '../../shared/grid/grid-toolbar'
import {
  applyDraft,
  createPriceFormat,
  draftCount,
  parseStock,
} from './edit-values'
import type { Inventory1Row } from './inventory-1-cells'
import { createInventory1Columns } from './inventory-1-columns'
import { Inventory1Footer } from './inventory-1-footer'
import { Inventory1Skeleton } from './inventory-1-skeleton'
import { Inventory1Toolbar } from './inventory-1-toolbar'
import { resolveInventory1Labels } from './labels'
import type {
  Inventory1Drafts,
  Inventory1EditableField,
  Inventory1Props,
} from './types'

type CellValueChange = Parameters<
  NonNullable<UseDataGridOptions<Inventory1Row>['onCellValueChange']>
>[0]

const noDrafts: Inventory1Drafts = {}

export function Inventory1({
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
}: Readonly<Inventory1Props>) {
  const labels = useMemo(
    () => resolveInventory1Labels(labelsProp),
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
      createInventory1Columns({
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

  const rows = useMemo<Inventory1Row[]>(
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
    const field = columnId as Inventory1EditableField
    const parsed =
      field === 'price' ? priceFormat.parse(value) : parseStock(value)
    if (parsed === null) return
    onDraftsChange(applyDraft(drafts, product, field, parsed))
  }

  const { table } = useDataGrid<Inventory1Row>({
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
    skeleton: <Inventory1Skeleton label={labels.loading} />,
  })

  const count = draftCount(drafts)
  const hasFooter = editable && Boolean(onSave || onDiscard)

  return (
    <GridFrame
      className={className}
      data-block="inventory-1"
      title={labels.title}
      toolbar={
        loadState ? (
          <GridToolbar
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
          <Inventory1Toolbar labels={labels} onAdd={onAdd} table={table} />
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
            <Inventory1Footer
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
