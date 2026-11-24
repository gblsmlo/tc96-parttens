import type {
  Navbar2Environment,
  Navbar2Option,
} from '@tc96/blocks/application/navbar/navbar-2'

export const organizations: Navbar2Option[] = [
  { id: 'acme', name: 'Acme Logística' },
  { id: 'nuvem', name: 'Nuvem Digital' },
  { id: 'verde', name: 'Verde Energia' },
]

export const projects: Navbar2Option[] = [
  { id: 'checkout', name: 'Checkout' },
  { id: 'rastreio', name: 'Rastreio de pedidos' },
  { id: 'portal', name: 'Portal do cliente' },
]

export const environments: Navbar2Environment[] = [
  { id: 'production', name: 'Produção', tone: 'success' },
  { id: 'staging', name: 'Homologação', tone: 'warning' },
  { id: 'development', name: 'Desenvolvimento', tone: 'info' },
]
