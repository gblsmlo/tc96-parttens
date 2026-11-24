import type { Navbar1Tab } from '@tc96/blocks/application/navbar/navbar-1'

export const breadcrumbs = [
  { href: '/projetos', label: 'Projetos' },
  { href: '/projetos/lancamento', label: 'Lançamento do app' },
  { label: 'Visão geral' },
]

export const tabs: Navbar1Tab[] = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'tasks', label: 'Tarefas' },
  { id: 'files', label: 'Arquivos' },
  { id: 'activity', label: 'Atividade' },
]

export const collaborators = [
  { id: 'ana', name: 'Ana Prado' },
  { id: 'bruno', name: 'Bruno Lima' },
  { id: 'carla', name: 'Carla Souza' },
  { id: 'diego', name: 'Diego Alves' },
  { id: 'elisa', name: 'Elisa Ramos' },
  { id: 'fabio', name: 'Fábio Costa' },
]
