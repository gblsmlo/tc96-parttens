import type {
  Navbar3Notification,
  Navbar3RouteGroup,
  Navbar3User,
  Navbar3UserAction,
} from '@tc96/ui/blocks/application/navbar/navbar-3'

export const routes: Navbar3RouteGroup[] = [
  {
    label: 'Páginas',
    routes: [
      { href: '/painel', label: 'Painel' },
      { href: '/pedidos', label: 'Pedidos' },
      { href: '/clientes', label: 'Clientes' },
    ],
  },
  {
    label: 'Configurações',
    routes: [
      { href: '/configuracoes/equipe', label: 'Equipe' },
      { href: '/configuracoes/cobranca', label: 'Cobrança' },
    ],
  },
]

export const notifications: Navbar3Notification[] = [
  {
    description: 'O pedido 4821 saiu para entrega.',
    id: 'n1',
    time: 'há 5 min',
    title: 'Pedido enviado',
    unread: true,
  },
  {
    description: 'Marina Duarte pediu revisão do orçamento.',
    id: 'n2',
    time: 'há 1 h',
    title: 'Nova menção',
    unread: true,
  },
  {
    id: 'n3',
    time: 'ontem',
    title: 'Fatura de novembro disponível',
  },
]

export const user: Navbar3User = {
  email: 'gabriel@acme.com.br',
  name: 'Gabriel Melo',
}

export const userActions: Navbar3UserAction[] = [
  { id: 'profile', label: 'Meu perfil' },
  { id: 'settings', label: 'Configurações' },
  { id: 'sign-out', label: 'Sair', variant: 'destructive' },
]
