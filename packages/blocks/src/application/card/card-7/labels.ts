import { defaultCardLoadLabels } from '../shared/labels'
import type { Card7Labels } from './types'

export const defaultCard7Labels: Card7Labels = {
  ...defaultCardLoadLabels,
  action: 'Enviar proposta',
  errorTitle: 'Não foi possível carregar o contato',
  items: 'Negócios',
  loading: 'Carregando contato',
  stats: 'Resumo',
}
