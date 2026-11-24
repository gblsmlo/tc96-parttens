import { defaultListLoadLabels } from '../shared/labels'
import type { List4Labels } from './types'

export const defaultList4Labels: List4Labels = {
  ...defaultListLoadLabels,
  errorTitle: 'Não foi possível carregar as integrações',
  loading: 'Carregando integrações',
  connect: 'Conectar',
  connectTo: (name) => `Conectar ${name}`,
  connected: 'Conectado',
  emptyDescription: 'Nenhuma integração disponível no momento.',
  emptyTitle: 'Sem integrações',
  title: 'Integrações',
}
