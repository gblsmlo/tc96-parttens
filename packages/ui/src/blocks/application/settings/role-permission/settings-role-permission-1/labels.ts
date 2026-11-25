import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsRolePermission1Labels } from './types'

export const defaultSettingsRolePermission1Labels: SettingsRolePermission1Labels =
  {
    ...defaultSettingsLoadLabels,
    errorTitle: 'Não foi possível carregar as permissões',
    loading: 'Carregando permissões',
    description: 'Escolha o que cada função pode fazer no workspace.',
    emptyDescription: 'Esta função ainda não tem capacidades configuráveis.',
    emptyTitle: 'Nenhuma capacidade',
    role: 'Função',
    title: 'Permissões',
  }
