import { defaultDataCollectionLoadLabels } from '../../shared/collection/labels'
import { defaultDataPriorityLabels } from '../../shared/properties/data-priority'
import type { Tasks1Labels, Tasks1LabelsOverride } from './types'

export const defaultTasks1Labels: Tasks1Labels = {
  ...defaultDataCollectionLoadLabels,
  allAssignees: 'Todos os responsáveis',
  allPriorities: 'Todas as prioridades',
  allProjects: 'Todos os projetos',
  allStatuses: 'Todos os status',
  changeStatus: (status) => `Status: ${status}. Alterar status`,
  clearDate: 'Limpar data',
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  columns: {
    assignees: 'Responsáveis',
    due: 'Vencimento',
    priority: 'Prioridade',
    project: 'Projeto',
    tags: 'Tags',
    task: 'Tarefa',
    updated: 'Atualizada',
  },
  columnsSection: 'Colunas',
  complete: 'Concluir',
  create: 'Nova tarefa',
  delete: 'Excluir',
  display: 'Exibição',
  empty: 'Nenhuma tarefa ainda.',
  errorTitle: 'Não foi possível carregar as tarefas',
  filterCount: (label, count) => `${label} (${count})`,
  filters: 'Filtros',
  groupBy: 'Agrupar por',
  grouping: 'Agrupamento',
  groupings: {
    none: 'Nenhum',
    priority: 'Prioridade',
    status: 'Status',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expandir ${group}` : `Recolher ${group}`,
  loading: 'Carregando tarefas',
  moreOptions: 'Mais opções',
  noDue: 'Sem vencimento',
  noPriority: 'Sem prioridade',
  noProject: 'Sem projeto',
  noResult: 'Nenhuma tarefa com esses filtros.',
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
  peoplePicker: {
    add: 'Adicionar responsável',
    count: (count) =>
      `${count} ${count === 1 ? 'responsável' : 'responsáveis'}`,
    empty: 'Nenhuma pessoa encontrada.',
    loading: 'Carregando pessoas…',
    remove: 'Remover',
  },
  priorities: defaultDataPriorityLabels,
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
    priority: 'Prioridade',
    title: 'Título',
    updated: 'Atualizadas recentemente',
  },
  status: 'Status',
  statuses: {
    backlog: 'Backlog',
    canceled: 'Cancelada',
    done: 'Concluída',
    'in-progress': 'Em andamento',
    todo: 'A fazer',
  },
  tagPicker: {
    add: 'Adicionar tag',
    count: (count) => `${count} ${count === 1 ? 'tag' : 'tags'}`,
    empty: 'Nenhuma tag encontrada.',
    loading: 'Carregando tags…',
    remove: 'Remover tag',
  },
  title: 'Tarefas',
  toolbar: 'Controles das tarefas',
  unassigned: 'Sem responsável',
  visibleColumns: 'Colunas exibidas',
}

export function resolveTasks1Labels(
  labels: Tasks1LabelsOverride | undefined,
): Tasks1Labels {
  const base = defaultTasks1Labels
  return {
    ...base,
    ...labels,
    columns: { ...base.columns, ...labels?.columns },
    groupings: { ...base.groupings, ...labels?.groupings },
    paginationButtons: {
      ...base.paginationButtons,
      ...labels?.paginationButtons,
    },
    peoplePicker: { ...base.peoplePicker, ...labels?.peoplePicker },
    priorities: { ...base.priorities, ...labels?.priorities },
    sorts: { ...base.sorts, ...labels?.sorts },
    statuses: { ...base.statuses, ...labels?.statuses },
    tagPicker: { ...base.tagPicker, ...labels?.tagPicker },
  }
}
