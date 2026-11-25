import type {
  Navbar10Service,
  Navbar10User,
} from '@tc96/ui/blocks/application/navbar/navbar-10'

export const services: Navbar10Service[] = [
  { id: 'models', label: 'Modelos' },
  { id: 'payments', label: 'Pagamentos' },
  { id: 'webhooks', label: 'Webhooks' },
]

export const user: Navbar10User = {
  email: 'gabriel@acme.com.br',
  name: 'Gabriel Melo',
}

export const menuActions = [
  { id: 'keys', label: 'Chaves de API' },
  { id: 'docs', label: 'Documentação' },
  { destructive: true, id: 'sign-out', label: 'Sair' },
]
