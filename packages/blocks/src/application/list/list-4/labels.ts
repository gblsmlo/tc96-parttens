import type { List4Labels } from './types'

export const defaultList4Labels: List4Labels = {
  connect: 'Conectar',
  connectTo: (name) => `Conectar ${name}`,
  connected: 'Conectado',
  emptyDescription: 'Nenhuma integração disponível no momento.',
  emptyTitle: 'Sem integrações',
  title: 'Integrações',
}
