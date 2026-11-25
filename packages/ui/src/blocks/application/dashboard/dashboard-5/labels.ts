import type { Dashboard5Labels } from './types'

const joinCounts = (items: { count: string; label: string }[]) =>
  items.map((item) => `${item.label}: ${item.count}`).join('; ')

export const defaultDashboard5Labels: Dashboard5Labels = {
  agendaLink: 'Abrir Agenda',
  appointmentWhen: (day, time) => `${day} · ${time}`,
  appointmentsEmpty: 'Nenhum compromisso marcado nos seus processos.',
  appointmentsTitle: 'Compromissos dos meus processos',
  breadcrumb: 'Navegação estrutural',
  captureLabel: 'Captura do DJEN',
  captureStates: {
    running: 'Em dia',
    simulated: 'Simulado',
    stopped: 'Parada',
  },
  decide: 'Decidir',
  deadlinesEmpty: 'Nenhum prazo seu em andamento.',
  deadlinesLink: 'Abrir Prazos',
  deadlinesTitle: 'Meus prazos',
  description:
    'Prazos que vencem, publicações para decidir e a situação da captura.',
  dueDaysLabel: 'Prazos que vencem em cada um dos próximos dias úteis',
  dueDaysSummary: joinCounts,
  dueDaysTitle: 'Prazos por dia',
  dueDaysTooltip: (day, count) => `${day}: ${count}`,
  dueSoonLabel: 'Vencem em até 5 dias úteis',
  emptyDescription:
    'Os prazos, as publicações e os compromissos aparecem aqui assim que chegarem.',
  emptyTitle: 'Nenhuma pendência',
  errorDescription: 'Tente de novo em instantes.',
  errorTitle: 'Não foi possível carregar.',
  export: 'Exportar',
  fatalOn: (lawsuitTitle, date) => `${lawsuitTitle} · fatal ${date}`,
  indicators: 'Indicadores',
  loading: 'Carregando pendências',
  overdueLabel: 'Prazos atrasados',
  period: 'Período',
  publicationsEmpty:
    'Nenhuma publicação para decidir. As novas chegam com a próxima captura.',
  publicationsLabel: 'Publicações para decidir',
  publicationsLink: 'Abrir fila',
  publicationsTitle: 'Publicações para decidir',
  queuesEmpty: 'Nenhuma fila de prazo.',
  queuesLabel: 'Prazos em cada fila',
  queuesSummary: joinCounts,
  queuesTitle: 'Filas de prazo',
  queuesTooltip: (label, count) => `${label}: ${count}`,
  retry: 'Tentar de novo',
  title: 'Pendências',
}
