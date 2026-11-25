import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsIntegration5Labels } from './types'

export const defaultSettingsIntegration5Labels: SettingsIntegration5Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as integrações',
  loading: 'Carregando integrações',
  channelAction: (appName, channelLabel) => `${channelLabel} em ${appName}`,
  connect: 'Conectar',
  connectAction: (name) => `Conectar ${name}`,
  description: 'Conecte aplicativos e escolha quais eventos eles recebem.',
  disconnect: 'Desconectar',
  disconnectAction: (name) => `Desconectar ${name}`,
  emptyDescription: 'Os aplicativos disponíveis para conexão aparecem aqui.',
  emptyTitle: 'Nenhuma integração disponível',
  title: 'Eventos por integração',
}
