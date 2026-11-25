import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
  defaultDataCollectionSavedViewLabels,
} from '../../shared/collection/labels'
import type { Legal9Labels, Legal9LabelsOverride } from './types'

export const defaultLegal9Labels: Legal9Labels = {
  ...defaultDataCollectionLoadLabels,
  allBillingModels: 'Todos os modelos',
  allOwners: 'Todos os responsáveis',
  allStatuses: 'Todos os status',
  billingModels: {
    contingency: 'Êxito',
    fixed: 'Valor fixo',
    hourly: 'Por hora',
    other: 'Outro',
    subscription: 'Mensalidade',
  },
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  columns: {
    amount: 'Valor',
    billingModel: 'Modelo',
    holder: 'Titular',
    owner: 'Responsável',
    status: 'Status',
    title: 'Nome',
  },
  create: 'Novo contrato',
  defaultView: 'Padrão',
  display: 'Exibição',
  empty: 'Nenhum contrato ainda.',
  emptyGroup: 'Nenhum contrato neste grupo.',
  errorDescription: 'Confira os filtros.',
  errorTitle: 'Não foi possível listar os contratos',
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  group: 'Agrupar',
  groupBy: 'Agrupar por',
  groupings: {
    billingModel: 'Modelo',
    owner: 'Responsável',
    status: 'Status',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expandir ${group}` : `Recolher ${group}`,
  loading: 'Carregando contratos',
  modes: defaultDataCollectionModeLabels,
  noAmount: 'Sem valor',
  noBillingModel: 'Sem modelo',
  noGrouping: 'Sem agrupamento',
  noHolder: 'Sem titular',
  noResult: 'Nenhum contrato com esses filtros.',
  openRecord: (title) => `Abrir ${title}`,
  pageRange: (first, last, total) =>
    total === 0 ? '0 de 0' : `${first}–${last} de ${total}`,
  pagination: 'Paginação de contratos',
  paginationButtons: {
    first: 'Primeira página',
    last: 'Última página',
    next: 'Próxima página',
    previous: 'Página anterior',
  },
  savedViews: defaultDataCollectionSavedViewLabels,
  savePreference: 'Salvar preferência',
  search: 'Buscar contratos',
  selectAll: 'Selecionar todos os contratos',
  selectRecord: (title) => `Selecionar ${title}`,
  selectedCount: (count) =>
    `${count} ${count === 1 ? 'selecionado' : 'selecionados'}`,
  selectionActions: 'Ações dos contratos selecionados',
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sorts: {
    amount: 'Valor',
    title: 'Nome',
    updated: 'Atualização',
  },
  statuses: {
    active: 'Ativo',
    closed: 'Encerrado',
  },
  title: 'Contratos',
  toolbar: 'Controles de contratos',
  unassigned: 'Sem responsável',
  viewCountName: (label, count) =>
    `${label}, ${count} ${count === 1 ? 'contrato' : 'contratos'}`,
  viewList: 'Visualizações',
}

export function resolveLegal9Labels(
  labels: Legal9LabelsOverride | undefined,
): Legal9Labels {
  const base = defaultLegal9Labels
  return {
    ...base,
    ...labels,
    billingModels: { ...base.billingModels, ...labels?.billingModels },
    columns: { ...base.columns, ...labels?.columns },
    groupings: { ...base.groupings, ...labels?.groupings },
    modes: { ...base.modes, ...labels?.modes },
    paginationButtons: {
      ...base.paginationButtons,
      ...labels?.paginationButtons,
    },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    sorts: { ...base.sorts, ...labels?.sorts },
    statuses: { ...base.statuses, ...labels?.statuses },
  }
}
