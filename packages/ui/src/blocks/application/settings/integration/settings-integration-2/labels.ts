import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsIntegration2Labels } from './types'

export const defaultSettingsIntegration2Labels: SettingsIntegration2Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar os aplicativos',
  loading: 'Carregando aplicativos',
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
