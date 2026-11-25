import type {
  Navbar6Crumb,
  Navbar6FilterOption,
  Navbar6Person,
  Navbar6SortOption,
} from '@tc96/ui/blocks/application/navbar/navbar-6'

export const breadcrumb: Navbar6Crumb[] = [
  { href: '/projetos', id: 'projects', label: 'Projetos' },
  { href: '/projetos/loja', id: 'store', label: 'Loja online' },
  { id: 'board', label: 'Quadro da equipe' },
]

export const people: Navbar6Person[] = [
  { id: 'ana', name: 'Ana Souza' },
  { id: 'bruno', name: 'Bruno Lima' },
  { id: 'carla', name: 'Carla Prado' },
  { id: 'diego', name: 'Diego Alves' },
  { id: 'elisa', name: 'Elisa Rocha' },
]

export const filterOptions: Navbar6FilterOption[] = [
  { id: 'mine', label: 'Atribuídas a mim' },
  { id: 'open', label: 'Em aberto' },
  { id: 'late', label: 'Atrasadas' },
]

export const sortOptions: Navbar6SortOption[] = [
  { id: 'recent', label: 'Mais recentes' },
  { id: 'name', label: 'Nome' },
  { id: 'deadline', label: 'Prazo' },
]
