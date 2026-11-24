import { defaultGridLoadLabels } from '../shared/labels'
import type { DataGrid5Labels, DataGrid5LabelsOverride } from './types'

export const defaultDataGrid5Labels: DataGrid5Labels = {
  ...defaultGridLoadLabels,
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
  priorities: {
    high: 'Alta',
    low: 'Baixa',
    medium: 'Média',
    urgent: 'Urgente',
  },
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

export function resolveDataGrid5Labels(
  labels: DataGrid5LabelsOverride | undefined,
): DataGrid5Labels {
  return {
    ...defaultDataGrid5Labels,
    ...labels,
    columns: { ...defaultDataGrid5Labels.columns, ...labels?.columns },
    priorities: { ...defaultDataGrid5Labels.priorities, ...labels?.priorities },
    statuses: { ...defaultDataGrid5Labels.statuses, ...labels?.statuses },
    views: { ...defaultDataGrid5Labels.views, ...labels?.views },
  }
}
