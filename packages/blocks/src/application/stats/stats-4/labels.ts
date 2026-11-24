import type { Stats4Labels } from './types'

export const defaultStats4Labels: Stats4Labels = {
  goal: (goal) => `Meta de ${goal} leads`,
  goalProgress: (total, goal, percent) =>
    `${total} de ${goal} leads, ${percent} da meta`,
  range: 'Período',
  ranges: { '30d': '30 dias', '7d': '7 dias', '90d': '90 dias' },
  sources: 'Leads por origem',
  sourcesBar: 'Distribuição dos leads por origem',
  title: 'Visão geral de leads',
  total: (range) => `Leads nos últimos ${range}`,
}
