import { defaultListLoadLabels } from '../shared/labels'
import type { List2Labels } from './types'

export const defaultList2Labels: List2Labels = {
  ...defaultListLoadLabels,
  errorTitle: 'Não foi possível carregar o ranking',
  loading: 'Carregando ranking',
  emptyDescription: 'O ranking aparece aqui quando houver vendas no período.',
  emptyTitle: 'Nenhum resultado no período',
  range: 'Período',
  ranges: {
    '7d': 'Últimos 7 dias',
    '12m': 'Últimos 12 meses',
    '30d': 'Últimos 30 dias',
  },
  rank: (position) => `Posição ${position}`,
  title: 'Ranking de vendedores',
}
