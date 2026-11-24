import {
  Table4,
  type Table4Drafts,
  type Table4Product,
  type Table4Props,
} from '@tc96/ui/blocks/data/table/table-4'
import { useState } from 'react'
import { products as fixtureProducts, rowActions } from '../fixtures/table-4.ts'
import type { Table4Controls } from './table-4-controls.ts'

interface ComposedTable4Props extends Table4Controls {
  onAdd?: Table4Props['onAdd']
  onDiscard?: Table4Props['onDiscard']
  onDraftsChange?: Table4Props['onDraftsChange']
  onRowAction?: Table4Props['onRowAction']
  onSave?: Table4Props['onSave']
  onVisibleChange?: Table4Props['onVisibleChange']
}

export const applyDrafts = (
  products: Table4Product[],
  drafts: Table4Drafts,
): Table4Product[] =>
  products.map((product) => ({ ...product, ...drafts[product.id] }))

export const ComposedTable4 = ({
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
}: Readonly<ComposedTable4Props>) => {
  const [products, setProducts] = useState(fixtureProducts)
  const [drafts, setDrafts] = useState<Table4Drafts>({})

  return (
    <Table4
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
