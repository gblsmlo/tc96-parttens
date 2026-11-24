import { defaultCardLoadLabels } from '../shared/labels'
import type { Card1Labels } from './types'

export const defaultCard1Labels: Card1Labels = {
  ...defaultCardLoadLabels,
  errorTitle: 'Não foi possível carregar os detalhes',
  loading: 'Carregando detalhes',
  title: 'Detalhes',
}
