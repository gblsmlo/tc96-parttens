import type { Stats1Stat } from '@tc96/blocks/application/stats/stats-1'

export const stats: Stats1Stat[] = [
  {
    change: 0.124,
    id: 'revenue',
    kind: 'currency',
    label: 'Receita do mês',
    value: 128450.9,
  },
  { change: 0.082, id: 'leads', label: 'Novos leads', value: 1284 },
  {
    change: -0.013,
    id: 'conversion',
    kind: 'percent',
    label: 'Taxa de conversão',
    value: 0.241,
  },
  { change: 0, id: 'tickets', label: 'Tickets abertos', value: 37 },
]
