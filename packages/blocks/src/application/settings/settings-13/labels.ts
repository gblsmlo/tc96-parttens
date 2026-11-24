import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings13Labels } from './types'

export const defaultSettings13Labels: Settings13Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar os motivos',
  loading: 'Carregando motivos',
  actions: (name) => `Ações de ${name}`,
  allowCustomReason: 'Permitir motivo personalizado',
  allowCustomReasonDescription:
    'Vendedores podem escrever o próprio motivo quando nenhuma opção serve',
  archive: 'Arquivar',
  archived: 'Arquivados',
  delete: 'Excluir',
  description:
    'Os motivos que o vendedor pode escolher quando um lead é perdido.',
  edit: 'Editar',
  emptyDescription:
    'Crie um motivo para que os vendedores digam por que um lead foi perdido.',
  emptyTitle: 'Nenhum motivo de perda ainda',
  leadsLost: (leads) =>
    `${leads} ${leads === 1 ? 'lead perdido' : 'leads perdidos'}`,
  lostLeadsDescription:
    'Escolha o que os vendedores devem informar ao marcar um lead como perdido.',
  lostLeadsTitle: 'Leads perdidos',
  newReason: 'Novo motivo',
  requireReason: 'Exigir motivo de perda',
  requireReasonDescription:
    'O vendedor escolhe um motivo antes de marcar um lead como perdido',
  restore: 'Restaurar',
  title: 'Motivos de perda',
}
