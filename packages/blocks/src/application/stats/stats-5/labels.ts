import { defaultStatsLoadLabels } from '../shared/labels'
import type { Stats5Labels } from './types'

export const defaultStats5Labels: Stats5Labels = {
  ...defaultStatsLoadLabels,
  errorTitle: 'Não foi possível carregar as vendas',
  loading: 'Carregando vendas',
  down: 'Queda de',
  flat: 'Sem variação',
  title: 'Vendas e cancelamentos',
  up: 'Alta de',
}
