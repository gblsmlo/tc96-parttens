import { defaultCardLoadLabels } from '../shared/labels'
import type { Card5Labels } from './types'

export const defaultCard5Labels: Card5Labels = {
  ...defaultCardLoadLabels,
  errorTitle: 'Não foi possível carregar os atalhos',
  loading: 'Carregando atalhos',
  emptyDescription: 'Os atalhos disponíveis para você aparecem aqui.',
  emptyTitle: 'Nenhum atalho disponível',
  title: 'Atalhos rápidos',
}
