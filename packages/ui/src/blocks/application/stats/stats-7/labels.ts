import { defaultStatsLoadLabels } from '../shared/labels'
import type { Stats7Labels } from './types'

export const defaultStats7Labels: Stats7Labels = {
  ...defaultStatsLoadLabels,
  emptyDescription: 'As métricas aparecem aqui quando houver dados.',
  emptyTitle: 'Nenhuma métrica ainda',
  errorTitle: 'Não foi possível carregar as métricas',
  loading: 'Carregando métricas',
  title: 'Métricas',
}
