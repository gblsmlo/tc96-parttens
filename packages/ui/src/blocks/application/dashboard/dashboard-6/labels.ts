import type { Dashboard6Labels } from './types'

const joinCounts = (items: { count: string; label: string }[]) =>
  items.map((item) => `${item.label}: ${item.count}`).join('; ')

export const defaultDashboard6Labels: Dashboard6Labels = {
  breadcrumb: 'Navegação estrutural',
  columnLeads: 'Leads',
  columnStage: 'Etapa',
  columnValue: 'Valor',
  conversionDetail: 'ganhos entre os encerrados',
  conversionLabel: 'Conversão',
  description: 'Leads em aberto, ganhos, perdas e motivos do período.',
  emptyDescription: 'O resumo aparece aqui assim que houver leads no funil.',
  emptyTitle: 'Nenhum lead no funil',
  errorDescription: 'Tente de novo em instantes.',
  errorTitle: 'Não foi possível carregar o resumo do funil',
  export: 'Exportar',
  funnelLabel: 'Leads em aberto por etapa',
  funnelSummary: joinCounts,
  funnelTitle: 'Funil',
  funnelTotal: 'Em aberto no funil',
  indicators: 'Indicadores',
  leadCount: (count, formatted) =>
    count === 1 ? `${formatted} lead` : `${formatted} leads`,
  loading: 'Carregando o resumo do funil',
  lossesEmpty: 'Nenhuma perda no período.',
  lossesLabel: 'Leads perdidos por motivo',
  lossesSummary: joinCounts,
  lossesTitle: 'Perdas por motivo',
  lostLabel: 'Perdidos no período',
  noConversion: '—',
  openLabel: 'Em aberto',
  period: 'Período do resumo',
  retry: 'Tentar de novo',
  title: 'Analítico',
  tooltip: (label, count) => `${label}: ${count}`,
  wonLabel: 'Ganhos no período',
}
