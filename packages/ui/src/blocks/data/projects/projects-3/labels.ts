import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
  defaultDataCollectionSavedViewLabels,
} from '../../shared/collection/labels'
import { defaultDataPriorityLabels } from '../../shared/properties/data-priority'
import type { Projects3Labels, Projects3LabelsOverride } from './types'

export const defaultProjects3Labels: Projects3Labels = {
  ...defaultDataCollectionLoadLabels,
  allAssignees: 'Todos os responsáveis',
  allStatuses: 'Todos os status',
  allTasks: 'Todas as tarefas',
  archive: 'Arquivar',
  archived: 'Arquivada',
  archivedFilter: 'Arquivadas',
  archivedOptions: {
    exclude: 'Ocultar arquivadas',
    include: 'Incluir arquivadas',
    only: 'Somente arquivadas',
  },
  clearDate: 'Limpar data',
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  collapse: (title) => `Recolher subtarefas de ${title}`,
  columns: {
    assignee: 'Responsável',
    due: 'Vencimento',
    priority: 'Prioridade',
    start: 'Início',
    status: 'Status',
    tags: 'Tags',
    title: 'Tarefa',
    type: 'Tipo',
  },
  complete: 'Concluídas',
  create: 'Nova tarefa',
  display: 'Exibição',
  empty: 'Nenhuma tarefa ainda.',
  emptyColumn: 'Nenhuma tarefa nesta coluna.',
  errorTitle: 'Não foi possível carregar as tarefas',
  expand: (title) => `Expandir subtarefas de ${title}`,
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  groupBy: 'Agrupar por',
  grouping: 'Agrupamento',
  groupings: {
    assignee: 'Responsável',
    none: 'Nenhum',
    priority: 'Prioridade',
    status: 'Status',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expandir ${group}` : `Recolher ${group}`,
  loading: 'Carregando tarefas',
  modes: defaultDataCollectionModeLabels,
  moreOptions: 'Mais opções',
  noDue: 'Sem vencimento',
  noPriority: 'Sem prioridade',
  noResult: 'Nenhuma tarefa com esses filtros.',
  noStart: 'Sem início',
  noTags: 'Sem tags',
  tagPicker: {
    add: 'Adicionar tag',
    count: (count) => `${count} ${count === 1 ? 'tag' : 'tags'}`,
    empty: 'Nenhuma tag encontrada.',
    loading: 'Carregando tags…',
    remove: 'Remover tag',
  },
  openTask: (title) => `Abrir detalhes da tarefa: ${title}`,
  pageRange: (first, last, total) =>
    total === 0 ? '0 de 0' : `${first}–${last} de ${total}`,
  pagination: 'Paginação de tarefas',
  paginationButtons: {
    first: 'Primeira página',
    last: 'Última página',
    next: 'Próxima página',
    previous: 'Página anterior',
  },
  priorities: defaultDataPriorityLabels,
  savedViews: defaultDataCollectionSavedViewLabels,
  savePreference: 'Salvar preferência',
  search: 'Buscar tarefas',
  selectAll: 'Selecionar todas as tarefas',
  selectedCount: (count) =>
    `${count} ${count === 1 ? 'selecionada' : 'selecionadas'}`,
  selectionActions: 'Ações das tarefas selecionadas',
  selectTask: (title) => `Selecionar ${title}`,
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sorts: {
    due: 'Vencimento',
    newest: 'Mais recentes',
    priority: 'Prioridade',
  },
  statuses: {
    canceled: 'Cancelada',
    completed: 'Concluída',
    'in-progress': 'Em andamento',
    pending: 'Pendente',
  },
  title: 'Tarefas',
  toolbar: 'Controles das tarefas',
  unassigned: 'Sem responsável',
  viewList: 'Visualizações',
}

export function resolveProjects3Labels(
  labels: Projects3LabelsOverride | undefined,
): Projects3Labels {
  const base = defaultProjects3Labels
  return {
    ...base,
    ...labels,
    archivedOptions: { ...base.archivedOptions, ...labels?.archivedOptions },
    columns: { ...base.columns, ...labels?.columns },
    groupings: { ...base.groupings, ...labels?.groupings },
    modes: { ...base.modes, ...labels?.modes },
    paginationButtons: {
      ...base.paginationButtons,
      ...labels?.paginationButtons,
    },
    priorities: { ...base.priorities, ...labels?.priorities },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    sorts: { ...base.sorts, ...labels?.sorts },
    tagPicker: { ...base.tagPicker, ...labels?.tagPicker },
    statuses: { ...base.statuses, ...labels?.statuses },
  }
}
