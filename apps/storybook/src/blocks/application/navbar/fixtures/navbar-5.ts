import type {
  Navbar5Action,
  Navbar5Crumb,
  Navbar5Person,
} from '@tc96/blocks/application/navbar/navbar-5'

export const breadcrumb: Navbar5Crumb[] = [
  { href: '/projetos', id: 'projects', label: 'Projetos' },
  { href: '/projetos/loja', id: 'store', label: 'Loja online' },
  { id: 'page', label: 'Página inicial' },
]

export const people: Navbar5Person[] = [
  { id: 'ana', name: 'Ana Souza' },
  { id: 'bruno', name: 'Bruno Lima' },
  { id: 'carla', name: 'Carla Prado' },
  { id: 'diego', name: 'Diego Alves' },
  { id: 'elisa', name: 'Elisa Rocha' },
]

export const actions: Navbar5Action[] = [
  { id: 'schedule', label: 'Agendar publicação' },
  { id: 'preview', label: 'Pré-visualizar' },
  { destructive: true, id: 'unpublish', label: 'Despublicar' },
]
