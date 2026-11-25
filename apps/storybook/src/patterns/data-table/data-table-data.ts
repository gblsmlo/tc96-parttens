export interface Project {
  hours: number
  id: string
  name: string
  owner: string
  status: string
}

export const projects: readonly Project[] = [
  {
    hours: 120,
    id: 'P-101',
    name: 'Portal do cliente',
    owner: 'Ana Lima',
    status: 'Em andamento',
  },
  {
    hours: 80,
    id: 'P-102',
    name: 'App de vendas',
    owner: 'Bruno Reis',
    status: 'Planejado',
  },
  {
    hours: 210,
    id: 'P-103',
    name: 'Migração do ERP',
    owner: 'Carla Souza',
    status: 'Em andamento',
  },
  {
    hours: 64,
    id: 'P-104',
    name: 'Painel financeiro',
    owner: 'Diego Alves',
    status: 'Concluído',
  },
  {
    hours: 96,
    id: 'P-105',
    name: 'Integração com o banco',
    owner: 'Ana Lima',
    status: 'Em risco',
  },
  {
    hours: 40,
    id: 'P-106',
    name: 'Central de ajuda',
    owner: 'Bruno Reis',
    status: 'Planejado',
  },
  {
    hours: 56,
    id: 'P-107',
    name: 'Auditoria de segurança',
    owner: 'Carla Souza',
    status: 'Em andamento',
  },
  {
    hours: 150,
    id: 'P-108',
    name: 'Novo checkout',
    owner: 'Diego Alves',
    status: 'Concluído',
  },
]

export const PROJECT_PAGE_SIZE = 5
