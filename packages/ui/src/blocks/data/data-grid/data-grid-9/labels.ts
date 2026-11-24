import {
  defaultGridLoadLabels,
  defaultGridSettingsLabels,
  defaultGridViewLabels,
} from '../shared/labels'
import type { DataGrid9Labels, DataGrid9LabelsOverride } from './types'

export const defaultDataGrid9Labels: DataGrid9Labels = {
  ...defaultGridLoadLabels,
  ...defaultGridSettingsLabels,
  ...defaultGridViewLabels,
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

export function resolveDataGrid9Labels(
  labels: DataGrid9LabelsOverride | undefined,
): DataGrid9Labels {
  return {
    ...defaultDataGrid9Labels,
    ...labels,
    channels: { ...defaultDataGrid9Labels.channels, ...labels?.channels },
    columns: { ...defaultDataGrid9Labels.columns, ...labels?.columns },
    densities: { ...defaultDataGrid9Labels.densities, ...labels?.densities },
    statuses: { ...defaultDataGrid9Labels.statuses, ...labels?.statuses },
  }
}
