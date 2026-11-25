import {
  defaultGridLoadLabels,
  defaultGridSettingsLabels,
} from '../../shared/grid/labels'
import type { Marketing1Labels, Marketing1LabelsOverride } from './types'

export const defaultMarketing1Labels: Marketing1Labels = {
  ...defaultGridLoadLabels,
  ...defaultGridSettingsLabels,
  channels: {
    display: 'Display',
    email: 'E-mail',
    search: 'Busca',
    social: 'Social',
    video: 'Vídeo',
  },
  clearFilters: 'Limpar filtros',
  columns: {
    actions: 'Ações',
    campaign: 'Campanha',
    conversions: 'Conversões',
    cpa: 'CPA',
    newBuyers: 'Novos compradores',
    roas: 'ROAS',
    spend: 'Investimento',
    status: 'Status',
    trend: 'Tendência',
  },
  columnsMenu: 'Colunas',
  create: 'Nova campanha',
  ctr: (percent) => `CTR ${percent}`,
  delta: (direction, favorable) =>
    direction === 'flat'
      ? 'Sem variação'
      : `${direction === 'up' ? 'Alta' : 'Queda'} ${favorable ? 'favorável' : 'desfavorável'} de`,
  density: 'Altura das linhas',
  display: 'Exibição',
  empty: 'Nenhuma campanha para exibir.',
  errorTitle: 'Não foi possível carregar as campanhas',
  export: 'Exportar',
  filterAll: 'Todos',
  filters: 'Filtros',
  kpiBelowTarget: 'Abaixo da meta',
  kpiConversions: 'Conversões',
  kpiCpa: 'CPA médio',
  kpiImpressions: 'Impressões',
  kpiRoas: 'ROAS médio',
  kpiSpend: 'Investimento',
  kpis: 'Indicadores da campanha',
  loading: 'Carregando campanhas',
  newBuyersShare: (percent) => `${percent} de novos compradores`,
  ofBudget: (percent) => `${percent} do orçamento`,
  ofCampaigns: (total) => `de ${total} campanhas`,
  pageSize: 'Linhas por página',
  period: (from, to) => `${from} a ${to}`,
  roasOfTarget: (value, target) => `ROAS ${value}, meta ${target}`,
  roasTarget: (target) => `meta ${target}`,
  rowActionsFor: (campaign) => `Ações de ${campaign}`,
  search: 'Buscar campanhas',
  settings: 'Configurações',
  sortBy: 'Ordenar por',
  statuses: {
    active: 'Ativa',
    ended: 'Encerrada',
    learning: 'Em aprendizado',
    paused: 'Pausada',
  },
  subtitle: (total, active, period) =>
    `${total} campanhas · ${active} ativas na visão · ${period}`,
  title: 'Desempenho de campanhas',
  toolbar: 'Controles das campanhas',
  trendSummary: (from, to) => `Tendência de ${from} para ${to} no período`,
}

export function resolveMarketing1Labels(
  labels: Marketing1LabelsOverride | undefined,
): Marketing1Labels {
  return {
    ...defaultMarketing1Labels,
    ...labels,
    channels: { ...defaultMarketing1Labels.channels, ...labels?.channels },
    columns: { ...defaultMarketing1Labels.columns, ...labels?.columns },
    densities: { ...defaultMarketing1Labels.densities, ...labels?.densities },
    statuses: { ...defaultMarketing1Labels.statuses, ...labels?.statuses },
  }
}
