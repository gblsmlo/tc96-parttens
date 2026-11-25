import type {
  Inventory1Product,
  Inventory1RowAction,
} from '@tc96/ui/blocks/data/inventory/inventory-1'

export const products: Inventory1Product[] = [
  {
    category: 'Vestuário',
    id: 'prd-1042',
    name: 'Camiseta de algodão',
    price: 89.9,
    sku: 'VES-1042',
    status: 'active',
    stock: 320,
    visible: true,
  },
  {
    category: 'Calçados',
    id: 'prd-3502',
    name: 'Bota Chelsea de camurça',
    price: 489,
    sku: 'CAL-3502',
    status: 'draft',
    stock: 14,
    visible: false,
  },
  {
    category: 'Acessórios',
    id: 'prd-5260',
    name: 'Óculos aviador',
    price: 320,
    sku: 'ACE-5260',
    status: 'active',
    stock: 64,
    visible: true,
  },
  {
    category: 'Calçados',
    id: 'prd-3381',
    name: 'Tênis de trilha',
    price: 599.9,
    sku: 'CAL-3381',
    status: 'active',
    stock: 7,
    visible: true,
  },
  {
    category: 'Vestuário',
    id: 'prd-2380',
    name: 'Camisa de linho',
    price: 219,
    sku: 'VES-2380',
    status: 'archived',
    stock: 0,
    visible: false,
  },
  {
    category: 'Acessórios',
    id: 'prd-5311',
    name: 'Mochila de lona',
    price: 279.5,
    sku: 'ACE-5311',
    status: 'active',
    stock: 41,
    visible: true,
  },
]

export const rowActions: Inventory1RowAction[] = [
  { id: 'edit', label: 'Editar detalhes' },
  { id: 'duplicate', label: 'Duplicar' },
  { destructive: true, id: 'archive', label: 'Arquivar' },
]
