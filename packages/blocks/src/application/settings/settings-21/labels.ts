import type { Settings21Labels } from './types'

export const defaultSettings21Labels: Settings21Labels = {
  connect: 'Conectar',
  connectAction: (name) => `Conectar ${name}`,
  connected: 'Conectado',
  description: 'Gerencie os aplicativos conectados ao seu espaço de trabalho.',
  disconnect: 'Desconectar',
  disconnectAction: (name) => `Desconectar ${name}`,
  disconnected: 'Desconectado',
  emptyDescription: 'Os aplicativos disponíveis para conexão aparecem aqui.',
  emptyTitle: 'Nenhum aplicativo disponível',
  error: 'Erro',
  reconnect: 'Reconectar',
  reconnectAction: (name) => `Reconectar ${name}`,
  title: 'Aplicativos conectados',
}
