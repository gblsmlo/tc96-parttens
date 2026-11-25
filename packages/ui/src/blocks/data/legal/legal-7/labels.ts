import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
  defaultDataCollectionSavedViewLabels,
  defaultDataCollectionToolbarLabels,
} from '../../shared/collection/labels'
import type { Legal7Labels, Legal7LabelsOverride } from './types'

export const defaultLegal7Labels: Legal7Labels = {
  ...defaultDataCollectionLoadLabels,
  actions: {
    createDeadline: 'Criar prazo',
    createLawsuit: 'Cadastrar processo',
    createTask: 'Criar tarefa',
    discard: 'Descartar',
    linkDeadline: 'Vincular a prazo',
    linkLawsuit: 'Vincular a um processo',
    noDeadline: 'Sem prazo',
  },
  allLawsuits: 'Com e sem processo',
  allPublications: 'Todas',
  allTribunals: 'Todos os tribunais',
  bulkHint: 'Só publicações sem processo são vinculadas ou descartadas juntas.',
  clearFilters: defaultDataCollectionToolbarLabels.clearFilters,
  clearSelection: 'Limpar seleção',
  columns: {
    availableOn: 'Disponibilizada',
    excerpt: 'Trecho',
    kind: 'Tipo',
    lawsuit: 'Processo',
    lawyers: 'Advogados',
    number: 'Número',
    tribunal: 'Tribunal',
  },
  display: defaultDataCollectionToolbarLabels.display,
  empty: 'Nenhuma publicação para decidir. As novas chegam na próxima captura.',
  errorTitle: 'Não foi possível carregar as publicações',
  filterCount: defaultDataCollectionToolbarLabels.filterCount,
  filters: defaultDataCollectionToolbarLabels.filters,
  kindAndTribunal: (kind, tribunal) => `${kind} · ${tribunal}`,
  lawsuit: 'Processo',
  lawsuitFilters: {
    linked: 'Com processo',
    unlinked: 'Sem processo',
  },
  lawyers: (lawyers) => lawyers.join(', '),
  loading: 'Carregando publicações',
  modes: defaultDataCollectionModeLabels,
  noLawsuit: 'Sem processo',
  noNumber: 'sem número CNJ',
  noResult: 'Nenhuma publicação com estes filtros.',
  openPublication: (date, tribunal) =>
    `Abrir publicação de ${date} · ${tribunal}`,
  pagination: 'Paginação das publicações',
  savedViews: defaultDataCollectionSavedViewLabels,
  savePreference: 'Salvar preferência',
  selectAll: 'Selecionar todas as publicações',
  selectedCount: (count) =>
    `${count} ${count === 1 ? 'selecionada' : 'selecionadas'}`,
  selectionActions: 'Ações das publicações selecionadas',
  selectPublication: (date, tribunal) =>
    `Selecionar publicação de ${date} · ${tribunal}`,
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sorts: {
    newest: 'Mais novas',
    oldest: 'Mais antigas',
  },
  title: 'Publicações',
  toolbar: 'Controles de publicações',
  tribunal: 'Tribunal',
  viewList: 'Visualizações',
}

export function resolveLegal7Labels(
  labels: Legal7LabelsOverride | undefined,
): Legal7Labels {
  return {
    ...defaultLegal7Labels,
    ...labels,
    actions: { ...defaultLegal7Labels.actions, ...labels?.actions },
    columns: { ...defaultLegal7Labels.columns, ...labels?.columns },
    lawsuitFilters: {
      ...defaultLegal7Labels.lawsuitFilters,
      ...labels?.lawsuitFilters,
    },
    modes: { ...defaultLegal7Labels.modes, ...labels?.modes },
    savedViews: { ...defaultLegal7Labels.savedViews, ...labels?.savedViews },
    sorts: { ...defaultLegal7Labels.sorts, ...labels?.sorts },
  }
}
