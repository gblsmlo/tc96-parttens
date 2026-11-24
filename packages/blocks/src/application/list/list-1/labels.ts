import { defaultListLoadLabels } from '../shared/labels'
import type { List1Labels } from './types'

export const defaultList1Labels: List1Labels = {
  ...defaultListLoadLabels,
  errorTitle: 'Não foi possível carregar as métricas',
  loading: 'Carregando métricas',
  emptyDescription: 'As métricas aparecem aqui quando houver dados.',
  emptyTitle: 'Nenhuma métrica ainda',
  title: 'Métricas',
  trend: { down: 'Queda de', flat: 'Sem variação', up: 'Alta de' },
}
