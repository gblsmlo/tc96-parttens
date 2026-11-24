import { defaultStatsLoadLabels } from '../shared/labels'
import type { Stats6Labels } from './types'

export const defaultStats6Labels: Stats6Labels = {
  ...defaultStatsLoadLabels,
  errorTitle: 'Não foi possível carregar a carteira',
  loading: 'Carregando carteira',
  period: 'Período',
  periods: { day: 'Dia', month: 'Mês', week: 'Semana', year: 'Ano' },
  share: 'Participação',
  title: 'Alocação da carteira',
}
