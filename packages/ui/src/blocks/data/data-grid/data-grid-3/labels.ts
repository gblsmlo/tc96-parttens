import { defaultGridLoadLabels, defaultGridViewLabels } from '../shared/labels'
import type { DataGrid3Labels, DataGrid3LabelsOverride } from './types'

export const defaultDataGrid3Labels: DataGrid3Labels = {
  ...defaultGridLoadLabels,
  ...defaultGridViewLabels,
  assignOwner: 'Atribuir responsável',
  clearSelection: 'Limpar seleção',
  columns: {
    account: 'Conta',
    actions: 'Ações',
    arr: 'ARR',
    health: 'Saúde',
    renewal: 'Renovação',
    risk: 'Risco',
    stage: 'Etapa',
  },
  columnsMenu: 'Colunas',
  conditions: {
    addFilter: 'Filtros',
    clearFilters: 'Limpar filtros',
    condition: (field) => `Filtro de ${field}`,
    conditionActions: (field) => `Ações do filtro de ${field}`,
    editValue: (field) => `Valor de ${field}`,
    noFields: 'Nenhum campo encontrado',
    noValue: 'Buscar...',
    rangeFrom: 'De',
    rangeSeparator: 'e',
    rangeTo: 'Até',
    removeCondition: 'Remover filtro',
    searchFields: 'Buscar campos',
    valuePlaceholder: 'Digite um valor',
  },
  create: 'Nova transação',
  clearSort: 'Limpar ordenação',
  densities: {
    'extra-tall': 'Extra alta',
    medium: 'Média',
    short: 'Compacta',
    tall: 'Alta',
  },
  density: 'Altura das linhas',
  filterCount: (label, count) => `${label} (${count})`,
  sortOption: (column, direction) =>
    `${column}: ${direction === 'asc' ? 'crescente' : 'decrescente'}`,
  due: (urgency, days) => {
    if (urgency === 'overdue') return `Venceu há ${Math.abs(days)} d`
    if (urgency === 'soon') return `Vence em ${days} d`
    return `Em ${days} d`
  },
  empty: 'Nenhuma renovação para exibir.',
  errorTitle: 'Não foi possível carregar as renovações',
  fields: {
    account: 'Conta',
    arr: 'ARR',
    health: 'Saúde (%)',
    owner: 'Responsável',
    renewal: 'Data de renovação',
    risk: 'Risco',
    segment: 'Segmento',
    stage: 'Etapa',
  },
  health: {
    'at-risk': 'Em risco',
    healthy: 'Saudável',
    watchlist: 'Em observação',
  },
  healthScore: (percent, level) => `Saúde ${percent}, ${level}`,
  loading: 'Carregando renovações',
  moveStage: 'Mover etapa',
  newStage: 'Nova etapa',
  operators: {
    after: 'depois de',
    before: 'antes de',
    between: 'entre',
    contains: 'contém',
    eq: 'igual a',
    gt: 'maior que',
    is: 'é',
    'is-any-of': 'é um de',
    'is-not': 'não é',
    lt: 'menor que',
  },
  owner: 'Responsável',
  risks: {
    critical: 'Crítico',
    high: 'Alto',
    low: 'Baixo',
    medium: 'Médio',
  },
  rowActionsFor: (account) => `Ações de ${account}`,
  saveView: 'Salvar view',
  segments: {
    enterprise: 'Enterprise',
    'mid-market': 'Mid-market',
    scale: 'Scale',
  },
  selectAccount: (account) => `Selecionar ${account}`,
  selectAll: 'Selecionar todas as renovações da página',
  selectedCount: (count) =>
    count === 1
      ? '1 renovação selecionada'
      : `${count} renovações selecionadas`,
  selectionActions: 'Ações das renovações selecionadas',
  settings: 'Configurações',
  sortBy: 'Ordenar por',
  stages: {
    'commercial-review': 'Revisão comercial',
    'legal-review': 'Revisão jurídica',
    preparing: 'Preparação',
    signed: 'Assinada',
  },
  summary: (dueSoon, atRisk, arrAtRisk) =>
    `${dueSoon} vencem em 30 dias · ${atRisk} em risco · ${arrAtRisk} de ARR em risco`,
  title: 'Revisão de renovações',
  toolbar: 'Controles das renovações',
  upside: (amount) => `+${amount} de potencial`,
}

export function resolveDataGrid3Labels(
  labels: DataGrid3LabelsOverride | undefined,
): DataGrid3Labels {
  return {
    ...defaultDataGrid3Labels,
    ...labels,
    columns: { ...defaultDataGrid3Labels.columns, ...labels?.columns },
    densities: { ...defaultDataGrid3Labels.densities, ...labels?.densities },
    conditions: { ...defaultDataGrid3Labels.conditions, ...labels?.conditions },
    fields: { ...defaultDataGrid3Labels.fields, ...labels?.fields },
    health: { ...defaultDataGrid3Labels.health, ...labels?.health },
    operators: { ...defaultDataGrid3Labels.operators, ...labels?.operators },
    risks: { ...defaultDataGrid3Labels.risks, ...labels?.risks },
    segments: { ...defaultDataGrid3Labels.segments, ...labels?.segments },
    stages: { ...defaultDataGrid3Labels.stages, ...labels?.stages },
  }
}
