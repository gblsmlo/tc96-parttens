import type { AgendaEvent, ProjectSubtask } from '@tc96/parttens'

export type ProgressPeriod = 'month' | 'quarter'

export const progressPeriods = [
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
] as const

export const progressSeries: Record<
  ProgressPeriod,
  { label: string; value: number }[]
> = {
  month: [
    { label: 'W1', value: 18 },
    { label: 'W2', value: 26 },
    { label: 'W3', value: 31 },
    { label: 'W4', value: 24 },
  ],
  quarter: [
    { label: 'Jan', value: 64 },
    { label: 'Feb', value: 92 },
    { label: 'Mar', value: 71 },
  ],
}

export const progressChange: Record<ProgressPeriod, number> = {
  month: 0.08,
  quarter: 0.12,
}

export const taskStats = [
  { id: 'progress', label: 'In progress', value: 152 },
  { id: 'todo', label: 'To do', value: 294 },
  { id: 'backlog', label: 'Backlog', value: 187 },
]

export const meetingStart = new Date('2026-10-02T13:30:00Z')
export const meetingEnd = new Date('2026-10-02T15:00:00Z')
export const clockInstant = new Date('2026-10-02T20:11:20Z')

export const clocks = [
  { id: 'paris', label: 'Paris', meta: '22°C', timeZone: 'Europe/Paris' },
  { id: 'london', label: 'London', meta: '20°C', timeZone: 'Europe/London' },
]

export const agendaEvents: AgendaEvent[] = [
  {
    date: '2023-04-19',
    endLabel: '6:30 PM',
    id: 'yoga',
    startLabel: '5:30 PM',
    title: 'Yoga Class',
  },
  {
    color: 'var(--chart-2)',
    date: '2023-04-19',
    endLabel: '10:30 AM',
    id: 'gym',
    startLabel: '9:30 AM',
    title: 'Gym',
  },
  {
    color: 'var(--chart-3)',
    date: '2023-04-21',
    endLabel: '11:00 AM',
    id: 'review',
    startLabel: '10:00 AM',
    title: 'Design review',
  },
]

export const initialSubtasks: ProjectSubtask[] = [
  { done: true, id: 'interview', label: 'Interview with users' },
  { done: true, id: 'brainstorm', label: 'Brain storm' },
  { done: true, id: 'ia', label: 'Information architecture' },
  { done: false, id: 'wireframe', label: 'Wireframe design' },
  { done: false, id: 'visual', label: 'Visual design' },
]

export const projectPeople = [
  { id: 'ana', label: 'Ana Martins' },
  { id: 'gabriel', label: 'Gabriel Melo' },
  { id: 'marina', label: 'Marina Souza' },
  { id: 'joao', label: 'João Lima' },
]

export const projectTags = [
  { id: 'design', label: 'Design' },
  { id: 'ui', label: 'UI/UX' },
  { id: 'web', label: 'Website' },
]
