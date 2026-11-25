import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsIntegration8Labels } from './types'

export const defaultSettingsIntegration8Labels: SettingsIntegration8Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as integrações de API',
  loading: 'Carregando integrações de API',
  callsColumn: 'Chamadas por dia',
  copyAction: (name) => `Copiar chave de ${name}`,
  description: 'Acompanhe as chaves e o uso de cada integração de API.',
  emptyDescription: 'As integrações de API aparecem aqui.',
  emptyTitle: 'Nenhuma integração de API',
  enableAction: (name) => `Ativar ${name}`,
  enabledColumn: 'Ativa',
  integrationColumn: 'Integração',
  keyColumn: 'Chave de API',
  pauseAll: 'Pausar tudo',
  rowsPerPage: 'Linhas por página',
  title: 'Integrações de API',
}
