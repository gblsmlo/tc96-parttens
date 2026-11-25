import type {
  Dashboard5Appointment,
  Dashboard5Deadline,
  Dashboard5DueDay,
  Dashboard5Links,
  Dashboard5Metrics,
  Dashboard5Publication,
  Dashboard5Queue,
} from '@tc96/ui/blocks/application/dashboard/dashboard-5'

export const dashboard5TimeZone = 'America/Sao_Paulo'

export const metrics: Dashboard5Metrics = {
  capture: {
    detail: 'última varredura às 07:30',
    href: '/juridico/monitoramento',
    state: 'running',
  },
  dueSoon: {
    count: 7,
    detail: 'o primeiro em 26/11',
    href: '/juridico/prazos?view=week',
  },
  overdue: {
    count: 2,
    detail: 'resolva antes dos outros',
    href: '/juridico/prazos?view=overdue',
  },
  publications: {
    count: 4,
    detail: 'a mais antiga de 18/11',
    href: '/juridico/publicacoes',
  },
}

export const links: Dashboard5Links = {
  agenda: '/agenda',
  deadlines: '/juridico/prazos',
  publications: '/juridico/publicacoes',
}

export const deadlines: Dashboard5Deadline[] = [
  {
    daysLeft: 'Venceu há 1 dia útil',
    fatalDate: '2026-11-24',
    href: '/juridico/processos/lw-3',
    id: 'dl-1',
    lawsuitTitle: 'Ação de indenização',
    title: 'Réplica',
    urgency: 'overdue',
  },
  {
    daysLeft: 'Vence hoje',
    fatalDate: '2026-11-25',
    href: '/juridico/processos/lw-1',
    id: 'dl-2',
    lawsuitTitle: 'Ação de cobrança',
    title: 'Contestação',
    urgency: 'today',
  },
  {
    daysLeft: '4 dias úteis',
    fatalDate: '2026-12-01',
    href: '/juridico/processos/lw-2',
    id: 'dl-3',
    lawsuitTitle: 'Reclamação trabalhista',
    title: 'Manifestação sobre documentos',
    urgency: 'soon',
  },
  {
    daysLeft: '9 dias úteis',
    fatalDate: '2026-12-08',
    href: '/juridico/processos/lw-4',
    id: 'dl-4',
    lawsuitTitle: 'Silva x Banco',
    title: 'Recurso inominado',
    urgency: 'later',
  },
]

export const publications: Dashboard5Publication[] = [
  {
    availableOn: '2026-11-18',
    description: 'Ação de cobrança · 18/11/2026',
    href: '/juridico/publicacoes?publicacao=pub-1',
    id: 'pub-1',
    title: 'Intimação · TJSP',
  },
  {
    availableOn: '2026-11-20',
    description: 'Não cadastrado · 0001234-55.2026.5.02.0001',
    href: '/juridico/publicacoes?publicacao=pub-2',
    id: 'pub-2',
    title: 'Citação · TRT2',
  },
]

export const appointments: Dashboard5Appointment[] = [
  {
    href: '/juridico/processos/lw-4',
    id: 'ap-1',
    recordTitle: 'Silva x Banco',
    startsAt: '2026-11-27T17:00:00.000Z',
    title: 'Audiência de conciliação',
  },
  {
    href: '/juridico/casos/mt-1',
    id: 'ap-2',
    recordTitle: 'Consulta trabalhista',
    startsAt: '2026-11-30T13:30:00.000Z',
    title: 'Reunião com o cliente',
  },
]

export const queues: Dashboard5Queue[] = [
  {
    count: 7,
    href: '/juridico/prazos?view=week',
    id: 'week',
    label: 'Até 5 dias úteis',
  },
  {
    count: 3,
    href: '/juridico/prazos?view=unassigned',
    id: 'unassigned',
    label: 'Sem responsável',
  },
  { count: 18, href: '/juridico/prazos?view=all', id: 'all', label: 'Todos' },
]

export const dueDays: Dashboard5DueDay[] = [
  { count: 2, date: '2026-11-25' },
  { count: 1, date: '2026-11-26' },
  { count: 0, date: '2026-11-27' },
  { count: 3, date: '2026-11-30' },
  { count: 1, date: '2026-12-01' },
]
