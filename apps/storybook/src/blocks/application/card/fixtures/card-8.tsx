import type {
  Card8Action,
  Card8Meeting,
} from '@tc96/ui/blocks/application/card/card-8'
import { avatarUrl } from './avatar.ts'

const people = [
  { id: 'ana', imageUrl: avatarUrl('Ana Souza'), label: 'Ana Souza' },
  { id: 'bruno', imageUrl: avatarUrl('Bruno Lima'), label: 'Bruno Lima' },
  { id: 'carla', imageUrl: avatarUrl('Carla Dias'), label: 'Carla Dias' },
  { id: 'diego', imageUrl: avatarUrl('Diego Reis'), label: 'Diego Reis' },
  { id: 'elisa', imageUrl: avatarUrl('Elisa Prado'), label: 'Elisa Prado' },
  { id: 'fabio', imageUrl: avatarUrl('Fábio Nunes'), label: 'Fábio Nunes' },
]

export const meetings: Card8Meeting[] = [
  {
    description:
      'Planejamento da sprint para destravar pendências, distribuir tarefas e refinar as entregas da próxima fase.',
    duration: '30 min',
    id: 'sprint',
    people,
    tag: { label: 'Cliente', tone: 'secondary' },
    time: '09:00',
    title: 'Apollo CRM - Planejamento da sprint',
  },
  {
    description:
      'Revisão dos gastos do trimestre, ajuste de previsões e alinhamento de orçamento entre as áreas.',
    duration: '90 min',
    id: 'budget',
    people: people.slice(0, 4),
    tag: { label: 'Interna', tone: 'secondary' },
    time: '11:30',
    title: 'Delta Finanças - Alinhamento de orçamento',
  },
]

export const meetingActions: Card8Action[] = [
  { id: 'reschedule', label: 'Remarcar' },
  { id: 'cancel', label: 'Cancelar' },
]
