import {
  defaultDataCollectionLoadLabels,
  defaultDataCollectionModeLabels,
} from '../../shared/collection/labels'
import { defaultDataPriorityLabels } from '../../shared/properties/data-priority'
import type { Tasks2Labels, Tasks2LabelsOverride } from './types'

export const defaultTasks2Labels: Tasks2Labels = {
  ...defaultDataCollectionLoadLabels,
  allAssignees: 'Todos os responsáveis',
  allProjects: 'Todos os projetos',
  allStatuses: 'Todos os status',
  changeStatus: (status) => `Status: ${status}. Alterar status`,
  clearDate: 'Limpar data',
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  complete: 'Concluir',
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
  create: 'Nova',
  delete: 'Excluir',
  display: 'Exibição',
  empty: 'Nenhuma tarefa ainda.',
  emptyColumn: 'Nenhuma tarefa nesta coluna.',
  errorTitle: 'Não foi possível carregar as tarefas',
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  groupBy: 'Agrupar por',
  grouping: 'Agrupamento',
  groupings: {
    none: 'Nenhum',
    priority: 'Prioridade',
    project: 'Projeto',
    status: 'Status',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expandir ${group}` : `Recolher ${group}`,
  loading: 'Carregando tarefas',
  modes: defaultDataCollectionModeLabels,
  moreOptions: 'Mais opções',
  moreTags: (count) => `+${count} ${count === 1 ? 'tag' : 'tags'}`,
  noCreator: 'Sem autor',
  noDue: 'Sem prazo',
  noPriority: 'Sem prioridade',
  noProject: 'Sem projeto',
  noResult: 'Nenhuma tarefa com esses filtros.',
  openTask: (title) => `Abrir tarefa: ${title}`,
  peoplePicker: {
    add: 'Adicionar responsável',
    count: (count) =>
      `${count} ${count === 1 ? 'responsável' : 'responsáveis'}`,
    empty: 'Nenhuma pessoa encontrada.',
    loading: 'Carregando pessoas…',
    remove: 'Remover',
  },
  priorities: defaultDataPriorityLabels,
  search: 'Buscar tarefas',
  selectedCount: (count) =>
    `${count} ${count === 1 ? 'tarefa selecionada' : 'tarefas selecionadas'}`,
  selectionActions: 'Ações das tarefas selecionadas',
  selectAll: 'Selecionar todas as tarefas',
  selectTask: (title) => `Selecionar ${title}`,
  sort: 'Ordenar',
  sortBy: 'Ordenar por',
  sortColumn: (column, direction) =>
    direction === 'asc'
      ? `Ordenar por ${column}, crescente`
      : direction === 'desc'
        ? `Ordenar por ${column}, decrescente`
        : `Ordenar por ${column}`,
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
  toolbar: 'Controles das tarefas',
  unassigned: 'Sem responsável',
}

export function resolveTasks2Labels(
  labels: Tasks2LabelsOverride | undefined,
): Tasks2Labels {
  const base = defaultTasks2Labels
  return {
    ...base,
    ...labels,
    columns: { ...base.columns, ...labels?.columns },
    groupings: { ...base.groupings, ...labels?.groupings },
    modes: { ...base.modes, ...labels?.modes },
    peoplePicker: { ...base.peoplePicker, ...labels?.peoplePicker },
    priorities: { ...base.priorities, ...labels?.priorities },
    sorts: { ...base.sorts, ...labels?.sorts },
    statuses: { ...base.statuses, ...labels?.statuses },
  }
}
