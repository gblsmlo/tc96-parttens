import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsIntegration3Labels } from './types'

export const defaultSettingsIntegration3Labels: SettingsIntegration3Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as chaves',
  loading: 'Carregando chaves',
  actions: (name) => `Ações de ${name}`,
  columnActions: 'Ações',
  columnCreated: 'Criada em',
  columnLastUsed: 'Último uso',
  columnName: 'Nome',
  columnStatus: 'Ativa',
  columnToken: 'Token',
  copy: (name) => `Copiar token de ${name}`,
  description: 'Chaves para acessar a API da sua conta.',
  emptyDescription: 'Crie uma chave para acessar a API.',
  emptyTitle: 'Nenhuma chave ainda',
  neverUsed: 'Nunca usada',
  newKey: 'Nova chave',
  revoke: 'Revogar',
  rotate: 'Rotacionar',
  status: (name) => `Ativar ${name}`,
  title: 'Chaves de API',
}
