import type {
  Settings20Category,
  Settings20Channel,
  Settings20Matrix,
} from '@tc96/ui/blocks/application/settings/settings-20'

export const settings20Channels: Settings20Channel[] = [
  { id: 'email', name: 'E-mail' },
  { id: 'push', name: 'Push' },
  { id: 'app', name: 'No app' },
]

export const settings20Categories: Settings20Category[] = [
  {
    events: [
      {
        description: 'Quando um lead é atribuído a você.',
        id: 'lead-assigned',
        name: 'Novo lead atribuído',
      },
      { id: 'lead-stage', name: 'Lead mudou de etapa' },
    ],
    id: 'leads',
    name: 'Leads',
  },
  {
    events: [
      { id: 'task-due', name: 'Tarefa vence hoje' },
      { id: 'task-mention', name: 'Você foi mencionado' },
    ],
    id: 'tasks',
    name: 'Tarefas',
  },
  {
    events: [
      { id: 'invoice-paid', name: 'Fatura paga' },
      { id: 'invoice-overdue', name: 'Fatura em atraso' },
    ],
    id: 'finance',
    name: 'Financeiro',
  },
]

export const settings20Matrix: Settings20Matrix = {
  'invoice-overdue': { app: true, email: true, push: true },
  'invoice-paid': { app: true, email: false, push: false },
  'lead-assigned': { app: true, email: true, push: true },
  'lead-stage': { app: true, email: false, push: false },
  'task-due': { app: true, email: true, push: false },
  'task-mention': { app: true, email: false, push: true },
}
