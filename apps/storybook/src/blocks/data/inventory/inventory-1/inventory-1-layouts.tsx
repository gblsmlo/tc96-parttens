import {
  Inventory1,
  type Inventory1Drafts,
  type Inventory1Product,
  type Inventory1Props,
} from '@tc96/ui/blocks/data/inventory/inventory-1'
import { useState } from 'react'
import {
  products as fixtureProducts,
  rowActions,
} from '../fixtures/inventory-1.ts'
import type { Inventory1Controls } from './inventory-1-controls.ts'

interface ComposedInventory1Props extends Inventory1Controls {
  onAdd?: Inventory1Props['onAdd']
  onDiscard?: Inventory1Props['onDiscard']
  onDraftsChange?: Inventory1Props['onDraftsChange']
  onRowAction?: Inventory1Props['onRowAction']
  onSave?: Inventory1Props['onSave']
  onVisibleChange?: Inventory1Props['onVisibleChange']
}

export const applyDrafts = (
  products: Inventory1Product[],
  drafts: Inventory1Drafts,
): Inventory1Product[] =>
  products.map((product) => ({ ...product, ...drafts[product.id] }))

export const ComposedInventory1 = ({
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
}: Readonly<ComposedInventory1Props>) => {
  const [products, setProducts] = useState(fixtureProducts)
  const [drafts, setDrafts] = useState<Inventory1Drafts>({})

  return (
    <Inventory1
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
