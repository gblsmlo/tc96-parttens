import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
  defaultDataCollectionSavedViewLabels,
} from '../../shared/collection/labels'
import type { Legal5Labels, Legal5LabelsOverride } from './types'

export const defaultLegal5Labels: Legal5Labels = {
  ...defaultDataCollectionLoadLabels,
  allClients: 'Todos os clientes',
  allOwners: 'Todos os responsáveis',
  allPhases: 'Todas as fases',
  allPoles: 'Todos os polos',
  archive: 'Arquivar',
  archived: 'Arquivado',
  archivedFilter: 'Arquivados',
  archivedOptions: {
    exclude: 'Ocultar arquivados',
    include: 'Incluir arquivados',
    only: 'Somente arquivados',
  },
  caseTag: 'Caso',
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  client: 'Cliente',
  columns: {
    clients: 'Cliente',
    deadline: 'Próximo prazo',
    number: 'Número',
    owner: 'Responsável',
    phase: 'Fase',
    tags: 'Tags',
    title: 'Processo',
  },
  copyNumber: 'Copiar número do processo',
  create: 'Novo processo',
  defaultSort: 'Mais recentes',
  display: 'Exibição',
  empty: {
    all: 'Nenhum processo ainda.',
    lawsuit: 'Nenhum processo ainda.',
    matter: 'Nenhum caso ainda.',
  },
  emptyGroup: 'Nenhum processo neste grupo.',
  errorTitle: 'Não foi possível carregar os processos',
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  group: 'Agrupar',
  groupBy: 'Agrupar por',
  groupings: {
    owner: 'Responsável',
    phase: 'Fase',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expandir ${group}` : `Recolher ${group}`,
  loading: 'Carregando processos',
  modes: defaultDataCollectionModeLabels,
  noGrouping: 'Sem agrupamento',
  noNumber: '—',
  noResult: {
    all: 'Nenhum processo com esses filtros.',
    lawsuit: 'Nenhum processo com esses filtros.',
    matter: 'Nenhum caso com esses filtros.',
  },
  noTags: 'Nenhuma tag.',
  openRecord: (title) => `Abrir ${title}`,
  pageRange: (first, last, total) =>
    total === 0 ? '0 de 0' : `${first}–${last} de ${total}`,
  pagination: 'Paginação de processos',
  paginationButtons: {
    first: 'Primeira página',
    last: 'Última página',
    next: 'Próxima página',
    previous: 'Página anterior',
  },
  pole: 'Polo',
  poles: {
    defendant: 'Polo passivo',
    plaintiff: 'Polo ativo',
    third_party: 'Terceiro',
  },
  savedViews: {
    ...defaultDataCollectionSavedViewLabels,
    create: 'Salvar visão atual…',
    savedViews: 'Minhas visões',
  },
  savePreference: 'Salvar preferência',
  search: 'Buscar processos',
  selectAll: 'Selecionar todos os processos',
  selectRecord: (title) => `Selecionar ${title}`,
  selectedCount: (count) =>
    `${count} ${count === 1 ? 'selecionado' : 'selecionados'}`,
  selectionActions: 'Ações dos processos selecionados',
  situation: 'Situação',
  situations: {
    active: 'Ativos',
    all: 'Todos',
    closed: 'Encerrados',
  },
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sorts: {
    owner: 'Responsável',
    phase: 'Fase',
    title: 'Título',
  },
  title: 'Processos',
  toolbar: 'Controles de processos',
  unarchive: 'Desarquivar',
  unarchiveRecord: (title) => `Desarquivar ${title}`,
  unassigned: 'Sem responsável',
  viewCountName: (label, count) =>
    `${label}, ${count} ${count === 1 ? 'item' : 'itens'}`,
  viewList: 'Visões',
  views: {
    all: 'Todos',
    lawsuit: 'Processos',
    matter: 'Casos',
  },
}

export function resolveLegal5Labels(
  labels: Legal5LabelsOverride | undefined,
): Legal5Labels {
  const base = defaultLegal5Labels
  return {
    ...base,
    ...labels,
    archivedOptions: { ...base.archivedOptions, ...labels?.archivedOptions },
    columns: { ...base.columns, ...labels?.columns },
    empty: { ...base.empty, ...labels?.empty },
    groupings: { ...base.groupings, ...labels?.groupings },
    modes: { ...base.modes, ...labels?.modes },
    noResult: { ...base.noResult, ...labels?.noResult },
    paginationButtons: {
      ...base.paginationButtons,
      ...labels?.paginationButtons,
    },
    poles: { ...base.poles, ...labels?.poles },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    situations: { ...base.situations, ...labels?.situations },
    sorts: { ...base.sorts, ...labels?.sorts },
    views: { ...base.views, ...labels?.views },
  }
}
