import type {
  Navbar9Branch,
  Navbar9PathItem,
} from '@tc96/ui/blocks/application/navbar/navbar-9'

export const path: Navbar9PathItem[] = [
  { href: '/organizacoes/oficina-aberta', id: 'org', label: 'oficina-aberta' },
  { id: 'repo', label: 'painel-de-entregas' },
]

export const branches: Navbar9Branch[] = [
  { default: true, id: 'main', label: 'main' },
  { id: 'feat-filtros', label: 'feat/filtros-salvos' },
  { id: 'fix-paginacao', label: 'fix/paginacao' },
  { id: 'v1-4-0', kind: 'tag', label: 'v1.4.0' },
  { id: 'v1-3-2', kind: 'tag', label: 'v1.3.2' },
  { id: 'producao', kind: 'deploy', label: 'producao' },
]
