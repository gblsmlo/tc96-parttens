import type { List1Metric } from '@tc96/blocks/application/list/list-1'

export const metrics: List1Metric[] = [
  {
    change: 0.084,
    description: 'Receita recorrente do mês',
    id: 'revenue',
    kind: 'currency',
    name: 'Receita',
    value: 482300,
  },
  {
    change: 0.032,
    description: 'Contas com atividade nos últimos 30 dias',
    id: 'customers',
    name: 'Clientes ativos',
    value: 1284,
  },
  {
    change: -0.006,
    description: 'Contas encerradas no mês',
    id: 'churn',
    kind: 'percent',
    name: 'Cancelamentos',
    value: 0.021,
  },
  {
    change: 0,
    description: 'Aguardando resposta da equipe',
    id: 'tickets',
    name: 'Tickets abertos',
    value: 37,
  },
]
