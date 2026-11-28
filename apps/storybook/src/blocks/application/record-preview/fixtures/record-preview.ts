import type {
  RecordPreview1CatalogLabels,
  RecordPreview1LabelsOverride,
  RecordPreview1Person,
  RecordPreview1Record,
} from '@tc96/ui/blocks/application/record-preview/record-preview-1'
import { ptBRPropertyLabels } from '../../../../patterns/properties/properties-labels.ts'

export const taskCatalogLabels: RecordPreview1CatalogLabels = {
  priority: { high: 'Alta', low: 'Baixa', medium: 'Média', urgent: 'Urgente' },
  status: {
    backlog: 'Backlog',
    done: 'Concluída',
    'in-progress': 'Em andamento',
    'in-review': 'Em revisão',
    todo: 'A fazer',
  },
  tags: {
    civil: 'Cível',
    deadline: 'Prazo',
    labor: 'Trabalhista',
    urgent: 'Urgente',
  },
  type: {
    filing: 'Protocolo',
    hearing: 'Audiência',
    petition: 'Petição',
    review: 'Análise',
  },
}

export const taskPreviewLabels: RecordPreview1LabelsOverride = {
  close: 'Fechar',
  copyId: 'Copiar ID',
  date: ptBRPropertyLabels.date,
  expand: 'Ampliar',
  fields: {
    assignee: 'Responsável',
    createdAt: 'Criado em',
    createdBy: 'Criado por',
    due: 'Prazo',
    priority: 'Prioridade',
    schedule: 'Data',
    type: 'Tipo',
    updatedAt: 'Atualizado em',
  },
  groups: {
    properties: 'Propriedades',
    record: 'Registro',
    schedule: 'Agenda',
  },
  noAssignee: 'Sem responsável',
  noCreator: 'Sem autor',
  schedule: ptBRPropertyLabels.schedule,
  select: ptBRPropertyLabels.select,
  tagPicker: ptBRPropertyLabels.tags,
  tagsPlaceholder: 'Adicionar uma tag',
}

export const taskPeople: readonly RecordPreview1Person[] = [
  { fallback: 'JA', label: 'Jessica Alencar', value: 'jessica' },
  { fallback: 'G', label: 'Gabriel', value: 'gabriel' },
]

export const taskRecord: RecordPreview1Record = {
  assignee: 'jessica',
  createdAt: '2026-09-27T09:00:00.000Z',
  createdBy: 'gabriel',
  description: 'Recurso ordinário contra a sentença da 2ª Vara do Trabalho.',
  due: '2026-09-19T12:00:00.000Z',
  id: 'seed_tasks_task_01',
  priority: 'urgent',
  schedule: {
    allDay: false,
    endTime: '01:45',
    frequency: null,
    from: new Date(2026, 9, 14),
    reminders: [],
    startTime: '01:30',
    until: null,
  },
  status: 'in-progress',
  tags: ['deadline', 'urgent', 'civil', 'labor'],
  title: 'Protocolar recurso no TRT',
  type: 'filing',
  updatedAt: '2026-10-14T02:34:00.000Z',
}

export const TASK_TIME_ZONE = 'America/Sao_Paulo'

export const taskToday = new Date(2026, 9, 14)
