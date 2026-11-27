import type {
  TasksLabels,
  TasksSortColumn,
} from '@tc96/ui/blocks/data/tasks/shared'

const sortColumnNames = {
  due: 'prazo',
  kind: 'projeto',
  priority: 'prioridade',
  title: 'tarefa',
  updated: 'atualização',
} as const satisfies Record<TasksSortColumn, string>

export const tasksLabelsPtBR: TasksLabels = {
  activeFilters: (count) =>
    count === 1 ? 'Filtrar, 1 ativo' : `Filtrar, ${count} ativos`,
  changeStatus: (status) => `Status: ${status}. Alterar status`,
  clearDate: 'Limpar data',
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  columns: {
    assignees: 'Responsáveis',
    creator: 'Criada por',
    due: 'Prazo',
    kind: 'Projeto',
    priority: 'Prioridade',
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
  errorDescription: 'Verifique sua conexão e tente novamente.',
  errorTitle: 'Não foi possível carregar as tarefas',
  filter: 'Filtrar',
  filterBy: {
    assignee: 'Responsável',
    kind: 'Projeto',
    priority: 'Prioridade',
    status: 'Status',
  },
  group: 'Agrupar',
  groupBy: 'Agrupar por',
  groupings: {
    kind: 'Projeto',
    none: 'Nenhum',
    priority: 'Prioridade',
    status: 'Status',
  },
  groupToggle: (group, collapsed) =>
    collapsed ? `Expandir ${group}` : `Recolher ${group}`,
  layout: 'Visualização',
  layoutBy: 'Exibir como',
  loading: 'Carregando tarefas',
  modes: {
    datatable: 'Tabela',
    kanban: 'Quadro',
    list: 'Lista',
  },
  moreOptions: 'Mais opções',
  moreTags: (count) => `+${count}`,
  noCreator: 'Sem autor',
  noDue: 'Sem prazo',
  noKind: 'Sem projeto',
  noPriority: 'Sem prioridade',
  noResult: 'Nenhuma tarefa com esses filtros.',
  openTask: (title) => `Abrir tarefa: ${title}`,
  peoplePicker: {
    add: 'Adicionar responsável',
    count: (count) => (count === 1 ? '1 responsável' : `${count} responsáveis`),
    empty: 'Nenhuma pessoa encontrada.',
    loading: 'Carregando pessoas…',
    remove: 'Remover',
  },
  priorities: {
    high: 'Alta',
    low: 'Baixa',
    medium: 'Média',
    urgent: 'Urgente',
  },
  retry: 'Tentar novamente',
  savedViews: {
    create: 'Salvar visualização',
    delete: 'Excluir',
    duplicate: 'Duplicar',
    modified: (label) => `${label} (alterada)`,
    options: (label) => `Opções de ${label}`,
    rename: 'Renomear',
    savedViews: 'Minhas visões',
    search: 'Buscar visualizações',
    searchPlaceholder: 'Buscar visualizações...',
    update: (label) => `Atualizar “${label}”`,
  },
  selectAll: 'Selecionar todas as tarefas',
  selectedCount: (count) =>
    count === 1 ? '1 tarefa selecionada' : `${count} tarefas selecionadas`,
  selectionActions: 'Ações das tarefas selecionadas',
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
    kind: 'Projeto',
    priority: 'Prioridade',
    title: 'Título',
    updated: 'Atualização',
  },
  status: 'Status',
  statuses: {
    canceled: 'Cancelada',
    done: 'Concluída',
    'in-progress': 'Em andamento',
    todo: 'A fazer',
  },
  tagPicker: {
    add: 'Adicionar tag',
    count: (count) => (count > 1 ? `+${count - 1}` : '+'),
    empty: 'Nenhuma tag encontrada.',
    loading: 'Carregando tags…',
    remove: 'Remover tag',
  },
  title: 'Todas as tarefas',
  toolbar: 'Controles das tarefas',
  unassigned: 'Sem responsável',
  viewList: 'Visões',
  visibleColumns: 'Colunas exibidas',
}

export const tasksSavePreferencePtBR = 'Salvar preferência'

export const tasksSearchPtBR = 'Buscar tarefas'
