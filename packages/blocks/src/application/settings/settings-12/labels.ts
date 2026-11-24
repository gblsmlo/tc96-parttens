import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings12ActionType, Settings12Labels } from './types'

const actionTypeLabels: Record<Settings12ActionType, string> = {
  call: 'Ligação',
  email: 'E-mail',
  'follow-up': 'Acompanhamento',
  meeting: 'Reunião',
  proposal: 'Proposta',
}

export const defaultSettings12Labels: Settings12Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as próximas ações',
  loading: 'Carregando próximas ações',
  actionType: (type) => actionTypeLabels[type],
  actions: (title) => `Ações de ${title}`,
  blockStageChanges: 'Bloquear mudança de etapa',
  blockStageChangesDescription:
    'Leads só avançam para a próxima etapa quando todas as ações obrigatórias estiverem concluídas. Desativado, apenas avisa.',
  delete: 'Excluir',
  description:
    'Ações que um lead precisa cumprir antes de sair de cada etapa aberta.',
  edit: 'Editar',
  emptyDescription: 'Adicione ações às etapas pelas quais os leads passam.',
  emptyStage: 'Leads avançam sem ações obrigatórias',
  emptyTitle: 'Nenhuma próxima ação ainda',
  gatesTitle: 'Bloqueio de etapas',
  leaving: (stage) => `Saindo de ${stage}`,
  newAction: 'Nova ação',
  required: (title) => `Obrigatória: ${title}`,
  title: 'Próximas ações',
}
