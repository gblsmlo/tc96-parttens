import type { Card2Labels } from './types'

export const defaultCard2Labels: Card2Labels = {
  connect: 'Conectar',
  connectTo: (name) => `Conectar ${name}`,
  connected: 'Conectado',
  title: 'Integrações',
}
