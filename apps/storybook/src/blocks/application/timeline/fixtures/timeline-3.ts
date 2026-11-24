import type { Timeline3Step } from '@tc96/blocks/application/timeline/timeline-3'

export const approvalSteps: Timeline3Step[] = [
  {
    date: '12 nov 2026, 09:30',
    id: 'request',
    name: 'Solicitação',
    owner: { name: 'Ana Costa' },
    status: 'approved',
  },
  {
    date: '13 nov 2026, 14:10',
    id: 'manager',
    name: 'Gestor da área',
    owner: { name: 'Carlos Lima' },
    status: 'approved',
  },
  {
    date: 'Aguardando desde 16 nov 2026',
    id: 'finance',
    name: 'Financeiro',
    owner: { name: 'Marina Souza' },
    status: 'pending',
  },
  {
    date: 'Prazo em 20 nov 2026',
    id: 'board',
    name: 'Diretoria',
    owner: { name: 'Paulo Reis' },
    status: 'pending',
  },
]

export const currentStepId = 'finance'
