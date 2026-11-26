import type { RecordDialog7Labels } from './types'

export const defaultRecordDialog7Labels: RecordDialog7Labels = {
  cancel: 'Cancelar',
  createMore: 'Criar mais',
  date: { clear: 'Limpar data', fallback: 'Sem data' },
  description: 'Descrição',
  descriptionPlaceholder: 'Adicionar descrição...',
  lead: 'Responsável',
  moreProperties: 'Mais propriedades',
  openAsPage: 'Abrir como página',
  priority: 'Prioridade',
  priorityHigh: 'Alta',
  priorityLow: 'Baixa',
  priorityMedium: 'Média',
  priorityNone: 'Sem prioridade',
  priorityUrgent: 'Urgente',
  repos: 'Repositórios',
  saveFailed: 'Não foi possível salvar.',
  startDate: 'Data de início',
  status: 'Status',
  statusBacklog: 'Backlog',
  statusCanceled: 'Cancelado',
  statusCompleted: 'Concluído',
  statusInProgress: 'Em andamento',
  statusPlanned: 'Planejado',
  submit: 'Criar projeto',
  submitting: 'Criando',
  targetDate: 'Data alvo',
  title: 'Título',
  titleAncestor: 'Projetos',
  titleLabel: 'Título do projeto',
  titlePlaceholder: 'Título do projeto',
  titleText: 'Novo projeto',
}

export function resolveRecordDialog7Labels(
  labels: Partial<RecordDialog7Labels> | undefined,
): RecordDialog7Labels {
  const base = defaultRecordDialog7Labels
  return { ...base, ...labels, date: { ...base.date, ...labels?.date } }
}
