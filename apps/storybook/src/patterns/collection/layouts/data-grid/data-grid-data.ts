import type { DataGridSelectOption } from '@tc96/parttens'

export interface GridProject {
  billable: boolean
  due: string
  hours: number
  id: string
  name: string
  owner: string
  priority: 'high' | 'low' | 'medium'
  status: string
}

export const projectStatusOptions: DataGridSelectOption[] = [
  { label: 'Planejado', value: 'planned' },
  { label: 'Em andamento', value: 'active' },
  { label: 'Em risco', value: 'risk' },
  { label: 'Concluído', value: 'done' },
]

export const projectPriorityOptions: DataGridSelectOption[] = [
  { label: 'Alta', value: 'high' },
  { label: 'Média', value: 'medium' },
  { label: 'Baixa', value: 'low' },
]

export const gridProjects: readonly GridProject[] = [
  {
    billable: true,
    due: '2026-09-30',
    hours: 120,
    id: 'P-101',
    name: 'Portal do cliente',
    owner: 'Ana Lima',
    priority: 'high',
    status: 'active',
  },
  {
    billable: true,
    due: '2026-10-15',
    hours: 80,
    id: 'P-102',
    name: 'App de vendas',
    owner: 'Ana Lima',
    priority: 'medium',
    status: 'planned',
  },
  {
    billable: false,
    due: '2026-11-20',
    hours: 210,
    id: 'P-103',
    name: 'Migração do ERP',
    owner: 'Bruno Reis',
    priority: 'high',
    status: 'active',
  },
  {
    billable: true,
    due: '2026-08-28',
    hours: 64,
    id: 'P-104',
    name: 'Painel financeiro',
    owner: 'Bruno Reis',
    priority: 'low',
    status: 'done',
  },
  {
    billable: true,
    due: '2026-09-12',
    hours: 96,
    id: 'P-105',
    name: 'Integração com o banco',
    owner: 'Bruno Reis',
    priority: 'high',
    status: 'risk',
  },
  {
    billable: false,
    due: '2026-12-01',
    hours: 40,
    id: 'P-106',
    name: 'Central de ajuda',
    owner: 'Carla Souza',
    priority: 'low',
    status: 'planned',
  },
  {
    billable: false,
    due: '2026-10-05',
    hours: 56,
    id: 'P-107',
    name: 'Auditoria de segurança',
    owner: 'Carla Souza',
    priority: 'medium',
    status: 'active',
  },
  {
    billable: true,
    due: '2026-09-01',
    hours: 150,
    id: 'P-108',
    name: 'Novo checkout',
    owner: 'Diego Alves',
    priority: 'medium',
    status: 'done',
  },
]

export const GRID_PAGE_SIZE = 5
