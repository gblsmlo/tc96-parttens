import type { RecordDialog3Labels } from './types'

export const defaultRecordDialog3Labels: RecordDialog3Labels = {
  addNextAction: 'Adicionar próxima ação',
  addSource: 'Adicionar origem',
  cancel: 'Cancelar',
  createMore: 'Criar mais',
  description: 'Descrição',
  descriptionPlaceholder: 'Adicionar descrição...',
  nextAction: 'Próxima ação',
  nextActionCall: 'Ligar',
  nextActionEmail: 'Enviar e-mail',
  nextActionFollowUp: 'Fazer follow-up',
  nextActionMeeting: 'Agendar reunião',
  nextActionProposal: 'Enviar proposta',
  noOwner: 'Sem responsável',
  owner: 'Responsável',
  saveFailed: 'Não foi possível salvar.',
  source: 'Origem',
  sourceAds: 'Anúncio',
  sourceEvent: 'Evento',
  sourceOutbound: 'Prospecção ativa',
  sourceReferral: 'Indicação',
  sourceWebsite: 'Site',
  stage: 'Etapa',
  stageContacted: 'Contatado',
  stageNew: 'Novo',
  stageQualified: 'Qualificado',
  submit: 'Criar lead',
  submitting: 'Criando',
  title: 'Título',
  titleAncestor: 'Leads',
  titlePlaceholder: 'Título do lead',
  titleText: 'Novo lead',
}

export function resolveRecordDialog3Labels(
  labels: Partial<RecordDialog3Labels> | undefined,
): RecordDialog3Labels {
  return { ...defaultRecordDialog3Labels, ...labels }
}
