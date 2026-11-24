import type {
  Dashboard3ForecastPoint,
  Dashboard3Kpi,
  Dashboard3Member,
  Dashboard3QueueItem,
} from '@tc96/blocks/application/dashboard/dashboard-3'

export const kpis: Dashboard3Kpi[] = [
  {
    delta: 0.04,
    format: 'percent',
    id: 'coverage',
    label: 'Cobertura média',
    trend: 'positive',
    value: 0.73,
  },
  {
    delta: -0.1,
    id: 'scheduled',
    label: 'Pessoas escaladas',
    trend: 'negative',
    value: 42,
  },
  {
    delta: 0.25,
    id: 'gaps',
    label: 'Turnos descobertos',
    trend: 'negative',
    value: 5,
  },
  {
    id: 'overtime',
    label: 'Horas extras previstas',
    trend: 'neutral',
    value: 18,
  },
]

export const crew: Dashboard3Member[] = [
  {
    coverage: 0.92,
    id: 'm1',
    name: 'Marina Costa',
    role: 'Supervisora de turno',
    shift: 'Manhã',
    status: { label: 'Completa', tone: 'success' },
  },
  {
    coverage: 0.64,
    id: 'm2',
    name: 'Rafael Lima',
    role: 'Operador de empilhadeira',
    shift: 'Manhã',
    status: { label: 'Parcial', tone: 'warning' },
  },
  {
    coverage: 0.35,
    id: 'm3',
    name: 'Júlia Andrade',
    role: 'Conferente',
    shift: 'Tarde',
    status: { label: 'Descoberta', tone: 'error' },
  },
  {
    coverage: 1,
    id: 'm4',
    name: 'Bruno Tavares',
    role: 'Separador',
    shift: 'Noite',
    status: { label: 'Completa', tone: 'success' },
  },
]

export const queue: Dashboard3QueueItem[] = [
  {
    description: 'Tarde sem conferente a partir das 14h',
    id: 'q1',
    priority: { label: 'Alta', tone: 'error' },
    title: 'Cobrir turno da tarde',
  },
  {
    actionLabel: 'Aprovar',
    description: 'Duas horas extras para a equipe de expedição',
    id: 'q2',
    priority: { label: 'Média', tone: 'warning' },
    title: 'Aprovar hora extra',
  },
  {
    description: 'Treinamento de segurança vence na sexta',
    id: 'q3',
    title: 'Renovar certificação',
  },
]

export const forecast: Dashboard3ForecastPoint[] = [
  { forecast: 18, label: '06h', supply: 20 },
  { forecast: 26, label: '08h', supply: 24 },
  { forecast: 34, label: '10h', supply: 30 },
  { forecast: 38, label: '12h', supply: 32 },
  { forecast: 33, label: '14h', supply: 28 },
  { forecast: 24, label: '16h', supply: 26 },
  { forecast: 16, label: '18h', supply: 18 },
]
