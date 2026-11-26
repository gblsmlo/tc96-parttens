import type { RecordDialog5Labels } from './types'

export const defaultRecordDialog5Labels: RecordDialog5Labels = {
  bodyLabel: 'Conteúdo da nota',
  bodyPlaceholder: 'Comece a escrever sua nota',
  copyLink: 'Copiar link',
  create: 'Criar nota',
  creating: 'Salvando',
  editTitle: 'Editar nota',
  newTitle: 'Nova nota',
  priority: 'Prioridade',
  priorityHigh: 'Alta',
  priorityLow: 'Baixa',
  priorityMedium: 'Média',
  priorityNone: 'Sem prioridade',
  priorityUrgent: 'Urgente',
  responsible: 'Responsável',
  save: 'Salvar nota',
  saveFailed: 'Não foi possível salvar.',
  saving: 'Salvando',
  status: 'Status',
  statusBacklog: 'Backlog',
  statusCanceled: 'Cancelada',
  statusCompleted: 'Concluída',
  statusInProgress: 'Em andamento',
  statusPlanned: 'Planejada',
  titleLabel: 'Título da nota',
  titlePlaceholder: 'Nota sem título',
}

export function resolveRecordDialog5Labels(
  labels: Partial<RecordDialog5Labels> | undefined,
): RecordDialog5Labels {
  return { ...defaultRecordDialog5Labels, ...labels }
}
