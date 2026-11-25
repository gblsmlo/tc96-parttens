import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsIntegration4Labels } from './types'

export const defaultSettingsIntegration4Labels: SettingsIntegration4Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as conexões',
  loading: 'Carregando conexões',
  actions: (name) => `Ações de ${name}`,
  connected: 'Conectado',
  description: 'Aplicativos conectados ao seu espaço, agrupados por tipo.',
  disconnect: 'Desconectar',
  emptyDescription: 'As conexões criadas aparecem aqui.',
  emptyTitle: 'Nenhuma conexão',
  manage: 'Gerenciar',
  newConnection: 'Nova conexão',
  review: 'Requer revisão',
  sync: 'Sincronizar',
  title: 'Conexões',
}
