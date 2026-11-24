import { defaultListLoadLabels } from '../shared/labels'
import type { List6Labels } from './types'

export const defaultList6Labels: List6Labels = {
  ...defaultListLoadLabels,
  errorTitle: 'Não foi possível carregar os ativos',
  loading: 'Carregando ativos',
  columnChange: 'Variação',
  columnName: 'Ativo',
  columnPrice: 'Preço',
  columnStatus: 'Status',
  emptyDescription: 'Nenhum ativo para mostrar agora.',
  emptyTitle: 'Sem ativos',
  noResultDescription: 'Tente buscar por outro nome.',
  noResultTitle: 'Nenhum ativo encontrado',
  search: 'Buscar ativos',
  searchPlaceholder: 'Buscar ativos',
  statuses: {
    delayed: 'Atrasado',
    halted: 'Suspenso',
    live: 'Ao vivo',
  },
  title: 'Maiores variações',
}
