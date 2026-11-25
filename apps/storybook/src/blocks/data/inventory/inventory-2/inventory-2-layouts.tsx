import {
  Inventory2,
  type Inventory2Drafts,
  type Inventory2Product,
  type Inventory2Props,
} from '@tc96/ui/blocks/data/inventory/inventory-2'
import { useState } from 'react'
import {
  products as fixtureProducts,
  rowActions,
} from '../fixtures/inventory-2.ts'
import type { Inventory2Controls } from './inventory-2-controls.ts'

interface ComposedInventory2Props extends Inventory2Controls {
  onAdd?: Inventory2Props['onAdd']
  onDiscard?: Inventory2Props['onDiscard']
  onDraftsChange?: Inventory2Props['onDraftsChange']
  onRowAction?: Inventory2Props['onRowAction']
  onSave?: Inventory2Props['onSave']
  onVisibleChange?: Inventory2Props['onVisibleChange']
}

export const applyDrafts = (
  products: Inventory2Product[],
  drafts: Inventory2Drafts,
): Inventory2Product[] =>
  products.map((product) => ({ ...product, ...drafts[product.id] }))

export const ComposedInventory2 = ({
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
}: Readonly<ComposedInventory2Props>) => {
  const [products, setProducts] = useState(fixtureProducts)
  const [drafts, setDrafts] = useState<Inventory2Drafts>({})

  return (
    <Inventory2
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
