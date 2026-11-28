import type {
  RecordPreview3CatalogLabels,
  RecordPreview3LabelsOverride,
  RecordPreview3Person,
  RecordPreview3Record,
} from '@tc96/ui/blocks/application/record-preview/record-preview-3'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import { ptBRPropertyLabels } from '../../../../patterns/properties/properties-labels.ts'

export const tasksCatalogLabels: RecordPreview3CatalogLabels = {
  priority: { high: 'Alta', low: 'Baixa', medium: 'Média', urgent: 'Urgente' },
  status: {
    canceled: 'Cancelada',
    done: 'Concluída',
    'in-progress': 'Em andamento',
    todo: 'A fazer',
  },
}

export const tasksPreviewLabels: RecordPreview3LabelsOverride = {
  close: 'Fechar',
  copyId: 'Copiar ID',
  date: ptBRPropertyLabels.date,
  expand: 'Ampliar',
  fields: {
    assignees: 'Responsáveis',
    creator: 'Criado por',
    due: 'Prazo',
    kind: 'Projeto',
    priority: 'Prioridade',
    updated: 'Atualizado em',
  },
  groups: { properties: 'Propriedades', record: 'Registro' },
  noCreator: 'Sem autor',
  noKind: 'Sem projeto',
  noPriority: 'Sem prioridade',
  peoplePicker: {
    ...ptBRPropertyLabels.people,
    add: 'Adicionar responsável',
    count: (count) => (count === 1 ? '1 responsável' : `${count} responsáveis`),
  },
  select: ptBRPropertyLabels.select,
  tagPicker: ptBRPropertyLabels.tags,
  tagsPlaceholder: 'Adicionar uma tag',
  unassigned: 'Sem responsável',
}

export const tasksKinds: readonly PropertyOption[] = [
  { label: 'Contratos', value: 'contracts' },
  { label: 'Contencioso', value: 'litigation' },
  { label: 'Societário', value: 'corporate' },
]

export const tasksTags: readonly PropertyOption[] = [
  { label: 'Cliente', tone: 'info', value: 'client' },
  { label: 'Interno', tone: 'neutral', value: 'internal' },
  { label: 'Urgente', tone: 'danger', value: 'urgent' },
  { label: 'Revisão', tone: 'warning', value: 'review' },
]

export const tasksPeople: readonly RecordPreview3Person[] = [
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'BL', label: 'Bruno Lima', value: 'bruno' },
  { fallback: 'CM', label: 'Carla Mendes', value: 'carla' },
]

export const tasksRecord: RecordPreview3Record = {
  assigneeIds: ['ana', 'bruno'],
  creatorId: 'carla',
  description:
    'Conferir as cláusulas de administração e de quotas antes da assinatura.',
  dueAt: '2026-11-25T12:00:00.000Z',
  id: 'task_2026_0142',
  kindId: 'corporate',
  overdue: true,
  priority: 'high',
  status: 'in-progress',
  tagIds: ['client', 'urgent', 'review'],
  title: 'Revisar minuta do contrato social da Padaria Trigo Bom',
  updatedAt: '2026-11-27T18:05:00.000Z',
}

export const TASKS_TIME_ZONE = 'America/Sao_Paulo'
