import { defaultDataPriorityLabels } from '../../shared/properties/data-priority'
import { defaultTableLoadLabels } from '../../shared/table/labels'
import type { Projects2Labels, Projects2LabelsOverride } from './types'

export const defaultProjects2Labels: Projects2Labels = {
  ...defaultTableLoadLabels,
  allOptions: 'Todas',
  clearFilters: 'Limpar filtros',
  clearSort: 'Limpar ordenação',
  collapse: (task) => `Recolher subtarefas de ${task}`,
  columns: {
    actions: 'Ações',
    assignee: 'Responsável',
    priority: 'Prioridade',
    project: 'Projeto',
    status: 'Status',
    task: 'Tarefa',
  },
  columnsMenu: 'Colunas',
  create: 'Nova tarefa',
  display: 'Exibição',
  empty: 'Nenhuma tarefa para exibir.',
  errorTitle: 'Não foi possível carregar as tarefas',
  expand: (task) => `Expandir subtarefas de ${task}`,
  filters: 'Filtros',
  filtersTrigger: (label, activeFilters) => `${label} (${activeFilters})`,
  loading: 'Carregando tarefas',
  priorities: defaultDataPriorityLabels,
  rowActionsFor: (task) => `Ações de ${task}`,
  rowsPerPage: 'Linhas por página',
  search: 'Buscar tarefas',
  settings: 'Configurações',
  showSubtasks: 'Mostrar subtarefas',
  sortBy: 'Ordenar por',
  sortOption: (column, direction) =>
    `${column}: ${direction === 'asc' ? 'crescente' : 'decrescente'}`,
  statuses: {
    backlog: 'Backlog',
    done: 'Concluída',
    inProgress: 'Em andamento',
    review: 'Em revisão',
    todo: 'A fazer',
  },
  summary: (total, showSubtasks) =>
    `${total} ${total === 1 ? 'tarefa' : 'tarefas'} / Subtarefas ${showSubtasks ? 'ativas' : 'ocultas'}`,
  title: 'Entrega de tarefas',
  toolbar: 'Controles das tarefas',
  views: {
    active: 'Ativas',
    all: 'Todas',
    backlog: 'Backlog',
  },
  viewsLabel: 'Visões das tarefas',
}

export function resolveProjects2Labels(
  labels: Projects2LabelsOverride | undefined,
): Projects2Labels {
  return {
    ...defaultProjects2Labels,
    ...labels,
    columns: { ...defaultProjects2Labels.columns, ...labels?.columns },
    priorities: { ...defaultProjects2Labels.priorities, ...labels?.priorities },
    statuses: { ...defaultProjects2Labels.statuses, ...labels?.statuses },
    views: { ...defaultProjects2Labels.views, ...labels?.views },
  }
}
