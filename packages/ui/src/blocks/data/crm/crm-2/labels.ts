import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
  defaultDataCollectionSavedViewLabels,
} from '../../shared/collection/labels'
import type { Crm2Labels, Crm2LabelsOverride } from './types'

export const defaultCrm2Labels: Crm2Labels = {
  ...defaultDataCollectionLoadLabels,
  allOrigins: 'Todas as origens',
  allOwners: 'Todos os responsáveis',
  allStages: 'Todas as etapas',
  archive: 'Arquivar',
  archivedFilter: 'Arquivados',
  archivedOptions: {
    exclude: 'Sem arquivados',
    include: 'Com arquivados',
    only: 'Só arquivados',
  },
  boardHasMore:
    'Algumas etapas mostram só os primeiros leads. Filtre ou use a tabela para ver o resto.',
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  columns: {
    contact: 'Contato',
    nextAction: 'Próxima ação',
    nextActionAt: 'Prazo',
    origin: 'Origem',
    owner: 'Responsável',
    stage: 'Etapa',
    tags: 'Tags',
    title: 'Lead',
    value: 'Valor',
  },
  create: 'Novo lead',
  createInStage: (stage) => `Novo lead em ${stage}`,
  display: 'Exibição',
  empty: 'Nenhum lead ainda.',
  emptyColumn: 'Nenhum lead nesta etapa.',
  errorTitle: 'Não foi possível listar os leads',
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  groupBy: 'Agrupar por',
  grouping: 'Agrupar',
  groupings: {
    origin: 'Origem',
    owner: 'Responsável',
    stage: 'Etapa',
  },
  loading: 'Carregando leads',
  modes: { ...defaultDataCollectionModeLabels, kanban: 'Quadro' },
  moveToStage: 'Mover para etapa',
  noContact: '—',
  noDeadline: '—',
  noNextAction: 'Sem próxima ação',
  noResult: 'Nenhum lead com esses filtros.',
  noValue: 'Sem valor',
  openRecord: (title) => `Abrir ${title}`,
  origins: {
    event: 'Evento',
    'existing-client': 'Cliente atual',
    other: 'Outro',
    'paid-ads': 'Anúncios pagos',
    referral: 'Indicação',
    'social-media': 'Redes sociais',
    website: 'Site',
  },
  pageRange: (first, last, total) =>
    total === 0 ? '0 de 0' : `${first}–${last} de ${total}`,
  pagination: 'Paginação de leads',
  paginationButtons: {
    first: 'Primeira página',
    last: 'Última página',
    next: 'Próxima página',
    previous: 'Página anterior',
  },
  savedViews: defaultDataCollectionSavedViewLabels,
  savePreference: 'Salvar preferência',
  search: 'Buscar leads',
  selectAll: 'Selecionar todos os leads',
  selectRecord: (title) => `Selecionar ${title}`,
  selectedCount: (count) =>
    `${count} ${count === 1 ? 'selecionado' : 'selecionados'}`,
  selectionActions: 'Ações dos leads selecionados',
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sorts: {
    created: 'Mais recentes',
    'next-action': 'Próxima ação mais próxima',
    updated: 'Atualizados há pouco',
    value: 'Maior valor',
  },
  title: 'Leads',
  toolbar: 'Controles de leads',
  unassigned: 'Sem responsável',
  viewCountName: (label, count) =>
    `${label}, ${count} ${count === 1 ? 'lead' : 'leads'}`,
  viewList: 'Visões',
  views: { all: 'Todos os leads' },
}

export function resolveCrm2Labels(
  labels: Crm2LabelsOverride | undefined,
): Crm2Labels {
  const base = defaultCrm2Labels
  return {
    ...base,
    ...labels,
    archivedOptions: { ...base.archivedOptions, ...labels?.archivedOptions },
    columns: { ...base.columns, ...labels?.columns },
    groupings: { ...base.groupings, ...labels?.groupings },
    modes: { ...base.modes, ...labels?.modes },
    origins: { ...base.origins, ...labels?.origins },
    paginationButtons: {
      ...base.paginationButtons,
      ...labels?.paginationButtons,
    },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    sorts: { ...base.sorts, ...labels?.sorts },
    views: { ...base.views, ...labels?.views },
  }
}
