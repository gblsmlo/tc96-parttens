import { defaultStatsLoadLabels } from '../shared/labels'
import type { Stats3Labels } from './types'

export const defaultStats3Labels: Stats3Labels = {
  ...defaultStatsLoadLabels,
  errorTitle: 'Não foi possível carregar a capacidade',
  loading: 'Carregando capacidade',
  ratio: (value, total) => `${value} / ${total}`,
  title: 'Capacidade',
}
