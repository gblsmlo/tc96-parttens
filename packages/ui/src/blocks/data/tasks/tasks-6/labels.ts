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
  activeFilters: (count) =>
    count === 1 ? 'Filtrar, 1 ativo' : `Filtrar, ${count} ativos`,
  clearDate: 'Limpar data',
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  columns: {
    assignees: 'Responsáveis',
    creator: 'Criada por',
    due: 'Prazo',
    priority: 'Prioridade',
    project: 'Projeto',
    start: 'Início',
    status: 'Status',
    tags: 'Tags',
    title: 'Tarefa',
    type: 'Tipo',
    updated: 'Atualizada',
  },
  complete: 'Concluir',
  create: 'Nova tarefa',
  defaultView: 'Todas as tarefas',
  delete: 'Excluir',
  empty: 'Nenhuma tarefa ainda.',
  emptyColumn: 'Nenhuma tarefa nesta coluna.',
  errorTitle: 'Não foi possível carregar as tarefas',
  filter: 'Filtrar',
  filterBy: {
    assignee: 'Responsável',
    priority: 'Prioridade',
    status: 'Status',
  },
  filterProperties: 'Propriedades',
  group: 'Agrupar',
  groupBy: 'Agrupar por',
  groupings: {
    none: 'Nenhum',
    priority: 'Prioridade',
    project: 'Projeto',
    status: 'Status',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expandir ${group}` : `Recolher ${group}`,
  layout: 'Visualização',
  layoutBy: 'Exibir como',
  visibility: 'Visibilidade',
  loading: 'Carregando tarefas',
  modes: {
    kanban: 'Quadro',
    list: 'Lista',
  },
  moreOptions: 'Mais opções',
  moreTags: (count) => (count === 1 ? '+1 tag' : `+${count} tags`),
  noCreator: 'Sem autor',
  noDue: 'Sem prazo',
  noPriority: 'Sem prioridade',
  noProject: 'Sem projeto',
  noResult: 'Nenhuma tarefa com esses filtros.',
  noStart: 'Sem início',
  noType: 'Sem tipo',
  openTask: (title) => `Abrir tarefa: ${title}`,
  overdue: (date) => date,
  peoplePicker: {
    add: 'Adicionar responsável',
    count: (count) => (count === 1 ? '1 responsável' : `${count} responsáveis`),
    empty: 'Nenhuma pessoa encontrada.',
    loading: 'Carregando pessoas…',
    remove: 'Remover',
  },
  priorities: defaultDataPriorityLabels,
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
    filterBy: { ...base.filterBy, ...labels?.filterBy },
    groupings: { ...base.groupings, ...labels?.groupings },
    modes: { ...base.modes, ...labels?.modes },
    peoplePicker: { ...base.peoplePicker, ...labels?.peoplePicker },
    priorities: { ...base.priorities, ...labels?.priorities },
    savedViews: { ...base.savedViews, ...labels?.savedViews },
    sorts: { ...base.sorts, ...labels?.sorts },
    statuses: { ...base.statuses, ...labels?.statuses },
  }
}
