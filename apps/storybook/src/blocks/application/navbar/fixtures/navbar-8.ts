import type {
  Navbar8Category,
  Navbar8Notification,
  Navbar8User,
} from '@tc96/ui/blocks/application/navbar/navbar-8'

export const categories: Navbar8Category[] = [
  { id: 'all', label: 'Todos' },
  { id: 'code', label: 'Código' },
  { id: 'research', label: 'Pesquisa' },
  { id: 'data', label: 'Dados' },
]

export const notifications: Navbar8Notification[] = [
  {
    description: 'O agente Revisor de PRs terminou a implantação.',
    id: 'n1',
    time: 'há 3 min',
    title: 'Implantação concluída',
  },
  {
    description: 'Marina Duarte avaliou o agente Analista de Dados.',
    id: 'n2',
    time: 'há 40 min',
    title: 'Nova avaliação',
  },
  {
    description: 'O agente Pesquisador de Mercado ganhou uma nova versão.',
    id: 'n3',
    time: 'há 2 h',
    title: 'Atualização disponível',
  },
  {
    id: 'n4',
    time: 'ontem',
    title: 'Fatura de novembro disponível',
  },
]

export const user: Navbar8User = {
  email: 'gabriel@orbit.com.br',
  name: 'Gabriel Melo',
}

export const agents = [
  { category: 'code', id: 'reviewer', name: 'Revisor de PRs' },
  { category: 'code', id: 'tests', name: 'Gerador de testes' },
  { category: 'research', id: 'market', name: 'Pesquisador de mercado' },
  { category: 'data', id: 'analyst', name: 'Analista de dados' },
  { category: 'data', id: 'cleaner', name: 'Limpeza de planilhas' },
]
