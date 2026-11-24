import type {
  Card9Action,
  Card9Delivery,
} from '@tc96/ui/blocks/application/card/card-9'

export const delivery: Card9Delivery = {
  address: 'Av. Paulista, 1578 - São Paulo, SP',
  addressTag: { label: 'Casa', tone: 'info' },
  duration: '37 min 23 s',
  notes:
    'O entregador confirmou a entrega na portaria principal; a foto foi anexada ao pedido.',
  tracking: '#BR-54321-SP',
  trackingStatus: 'Rastreio ao vivo',
  updatedAt: 'há 24 min',
}

export const deliveryActions: Card9Action[] = [
  { id: 'copy', label: 'Copiar rastreio' },
  { id: 'support', label: 'Falar com o suporte' },
]
