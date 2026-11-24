import { defaultCardLoadLabels } from '../shared/labels'
import type { Card2Labels } from './types'

export const defaultCard2Labels: Card2Labels = {
  ...defaultCardLoadLabels,
  errorTitle: 'Não foi possível carregar as integrações',
  loading: 'Carregando integrações',
  connect: 'Conectar',
  connectTo: (name) => `Conectar ${name}`,
  connected: 'Conectado',
  title: 'Integrações',
}
