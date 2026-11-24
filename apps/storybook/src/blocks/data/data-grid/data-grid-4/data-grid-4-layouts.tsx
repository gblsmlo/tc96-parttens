import {
  DataGrid4,
  type DataGrid4Drafts,
  type DataGrid4Product,
  type DataGrid4Props,
} from '@tc96/ui/blocks/data/data-grid/data-grid-4'
import { useState } from 'react'
import {
  products as fixtureProducts,
  rowActions,
} from '../fixtures/data-grid-4.ts'
import type { DataGrid4Controls } from './data-grid-4-controls.ts'

interface ComposedDataGrid4Props extends DataGrid4Controls {
  onAdd?: DataGrid4Props['onAdd']
  onDiscard?: DataGrid4Props['onDiscard']
  onDraftsChange?: DataGrid4Props['onDraftsChange']
  onRowAction?: DataGrid4Props['onRowAction']
  onSave?: DataGrid4Props['onSave']
  onVisibleChange?: DataGrid4Props['onVisibleChange']
}

export const applyDrafts = (
  products: DataGrid4Product[],
  drafts: DataGrid4Drafts,
): DataGrid4Product[] =>
  products.map((product) => ({ ...product, ...drafts[product.id] }))

export const ComposedDataGrid4 = ({
  addButton,
  empty,
  locale,
  lowStockThreshold,
  onAdd,
  onDiscard,
  onDraftsChange,
  onRowAction,
  onSave,
  onVisibleChange,
  rowMenu,
  saving,
  title,
}: Readonly<ComposedDataGrid4Props>) => {
  const [products, setProducts] = useState(fixtureProducts)
  const [drafts, setDrafts] = useState<DataGrid4Drafts>({})

  return (
    <DataGrid4
      currency={locale === 'en-US' ? 'USD' : 'BRL'}
      drafts={drafts}
      labels={{ title }}
      locale={locale}
      lowStockThreshold={lowStockThreshold}
      onAdd={addButton ? onAdd : undefined}
      onDiscard={() => {
        setDrafts({})
        onDiscard?.()
      }}
      onDraftsChange={(next) => {
        setDrafts(next)
        onDraftsChange?.(next)
      }}
      onRowAction={rowMenu ? onRowAction : undefined}
      onSave={(next) => {
        setProducts((current) => applyDrafts(current, next))
        setDrafts({})
        onSave?.(next)
      }}
      onVisibleChange={(id, visible) => {
        setProducts((current) =>
          current.map((product) =>
            product.id === id ? { ...product, visible } : product,
          ),
        )
        onVisibleChange?.(id, visible)
      }}
      products={empty ? [] : products}
      rowActions={rowMenu ? rowActions : undefined}
      saving={saving}
    />
  )
}
