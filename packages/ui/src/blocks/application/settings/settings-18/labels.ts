import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings18Labels } from './types'

export const defaultSettings18Labels: Settings18Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as permissões',
  loading: 'Carregando permissões',
  description: 'Escolha o que cada função pode fazer no workspace.',
  emptyDescription: 'Esta função ainda não tem capacidades configuráveis.',
  emptyTitle: 'Nenhuma capacidade',
  role: 'Função',
  title: 'Permissões',
}
