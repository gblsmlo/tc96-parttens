import { defaultListLoadLabels } from '../shared/labels'
import type { List3Labels } from './types'

export const defaultList3Labels: List3Labels = {
  ...defaultListLoadLabels,
  errorTitle: 'Não foi possível carregar as transações',
  loading: 'Carregando transações',
  credit: 'Entrada',
  debit: 'Saída',
  emptyDescription: 'As transações aparecem aqui quando houver movimentações.',
  emptyTitle: 'Nenhuma transação no período',
  period: 'Período',
  periods: { month: 'Mês', week: 'Semana', year: 'Ano' },
  title: 'Transações',
}
