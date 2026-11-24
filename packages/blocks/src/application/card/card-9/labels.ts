import { defaultCardLoadLabels } from '../shared/labels'
import type { Card9Labels } from './types'

export const defaultCard9Labels: Card9Labels = {
  ...defaultCardLoadLabels,
  address: 'Endereço',
  duration: 'Tempo de entrega',
  errorTitle: 'Não foi possível carregar a entrega',
  loading: 'Carregando entrega',
  more: 'Mais ações da entrega',
  notes: 'Observações da entrega',
  title: 'Detalhes da entrega',
  tracking: 'Rastreio',
}
