import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsIntegration6Labels } from './types'

export const defaultSettingsIntegration6Labels: SettingsIntegration6Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as integrações',
  loading: 'Carregando integrações',
  connect: 'Conectar',
  connectAction: (name) => `Conectar ${name}`,
  description: 'Conecte ferramentas e pause cada integração quando precisar.',
  disconnect: 'Desconectar',
  disconnectAction: (name) => `Desconectar ${name}`,
  emptyDescription: 'As integrações disponíveis aparecem aqui.',
  emptyTitle: 'Nenhuma integração disponível',
  enableAction: (name) => `Ativar ${name}`,
  title: 'Galeria de integrações',
}
