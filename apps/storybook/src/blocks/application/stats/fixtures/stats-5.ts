import type { Stats5Item } from '@tc96/blocks/application/stats/stats-5'

export const salesAndChurn: Stats5Item[] = [
  {
    format: 'currency',
    id: 'revenue',
    label: 'Receita recorrente',
    trend: 0.082,
    value: 184500,
  },
  {
    format: 'number',
    id: 'new-customers',
    label: 'Novos clientes',
    trend: 0.124,
    value: 326,
  },
  {
    format: 'percent',
    id: 'churn',
    label: 'Cancelamentos',
    lowerIsBetter: true,
    trend: -0.031,
    value: 0.024,
  },
]
