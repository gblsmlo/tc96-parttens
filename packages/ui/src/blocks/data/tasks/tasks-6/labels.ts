import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionSavedViewLabels,
} from '../../shared/collection/labels'
import { defaultDataPriorityLabels } from '../../shared/properties/data-priority'
import type {
  Tasks6Labels,
  Tasks6LabelsOverride,
  Tasks6SortColumn,
} from './types'

const sortColumnNames = {
  due: 'prazo',
  priority: 'prioridade',
  project: 'projeto',
  title: 'tarefa',
  updated: 'atualização',
} as const satisfies Record<Tasks6SortColumn, string>

export const defaultTasks6Labels: Tasks6Labels = {
  ...defaultDataCollectionLoadLabels,
  clearDate: 'Limpar data',
  changeStatus: (status) => `Status: ${status}. Alterar status`,
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  columns: {
    assignees: 'Responsáveis',
    creator: 'Criada por',
    due: 'Prazo',
    priority: 'Prioridade',
    project: 'Projeto',
    status: 'Status',
    tags: 'Tags',
    title: 'Tarefa',
    updated: 'Atualizada',
  },
  complete: 'Concluir',
  create: 'Nova tarefa',
  delete: 'Excluir',
  empty: 'Nenhuma tarefa ainda.',
  emptyColumn: 'Nenhuma tarefa nesta coluna.',
  errorTitle: 'Não foi possível carregar as tarefas',
  filterBy: {
    assignee: 'Responsável',
    priority: 'Prioridade',
    status: 'Status',
  },
  display: 'Exibição',
  filterAll: {
    assignee: 'Todos os responsáveis',
    priority: 'Todas as prioridades',
    status: 'Todos os status',
  },
  filterProperties: 'Propriedades',
  groupings: {
    priority: 'Prioridade',
    status: 'Status',
  },
  kanbanGroupBy: 'Agrupar quadro por',
  layout: 'Visualização',
  loading: 'Carregando tarefas',
  modes: {
    kanban: 'Quadro',
    list: 'Lista',
  },
  moreOptions: 'Mais opções',
  moreTags: (count) => `+${count}`,
  noCreator: 'Sem autor',
  noDue: 'Sem prazo',
  noPriority: 'Sem prioridade',
  noProject: 'Sem projeto',
  noResult: 'Nenhuma tarefa com esses filtros.',
  openTask: (title) => `Abrir tarefa: ${title}`,
  peoplePicker: {
    add: 'Adicionar responsável',
    count: (count) => (count === 1 ? '1 responsável' : `${count} responsáveis`),
    empty: 'Nenhuma pessoa encontrada.',
    loading: 'Carregando pessoas…',
    remove: 'Remover',
  },
  priorities: defaultDataPriorityLabels,
  tagPicker: {
    add: 'Adicionar tag',
    count: (count) => (count > 1 ? `+${count - 1}` : '+'),
    empty: 'Nenhuma tag encontrada.',
    loading: 'Carregando tags…',
    remove: 'Remover tag',
  },
  selectedCount: (count) =>
    count === 1 ? '1 tarefa selecionada' : `${count} tarefas selecionadas`,
  selectionActions: 'Ações das tarefas selecionadas',
  selectAll: 'Selecionar todas as tarefas',
  selectTask: (title) => `Selecionar ${title}`,
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sortColumn: (column, direction) =>
    direction === 'asc'
      ? `Ordenar por ${sortColumnNames[column]}, crescente`
      : direction === 'desc'
        ? `Ordenar por ${sortColumnNames[column]}, decrescente`
        : `Ordenar por ${sortColumnNames[column]}`,
  sorts: {
    due: 'Prazo',
    priority: 'Prioridade',
    project: 'Projeto',
    title: 'Título',
    updated: 'Atualização',
  },
  status: 'Status',
  statuses: {
    done: 'Concluída',
    'in-progress': 'Em andamento',
    todo: 'A fazer',
  },
  title: 'Todas as tarefas',
  savedViews: {
    ...defaultDataCollectionSavedViewLabels,
    savedViews: 'Minhas visões',
  },
  toolbar: 'Controles das tarefas',
  unassigned: 'Sem responsável',
  viewList: 'Visões',
}

export function resolveTasks6Labels(
  labels: Tasks6LabelsOverride | undefined,
): Tasks6Labels {
  const base = defaultTasks6Labels
  return {
    ...base,
    ...labels,
    columns: { ...base.columns, ...labels?.columns },
    filterAll: { ...base.filterAll, ...labels?.filterAll },
    filterBy: { ...base.filterBy, ...labels?.filterBy },
    groupings: { ...base.groupings, ...labels?.groupings },
    modes: { ...base.modes, ...labels?.modes },
    peoplePicker: { ...base.peoplePicker, ...labels?.peoplePicker },
    tagPicker: { ...base.tagPicker, ...labels?.tagPicker },
    priorities: { ...base.priorities, ...labels?.priorities },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    sorts: { ...base.sorts, ...labels?.sorts },
    statuses: { ...base.statuses, ...labels?.statuses },
  }
}
