import { defaultTableLoadLabels } from '../shared/labels'
import type { Table5Labels, Table5LabelsOverride } from './types'

export const defaultTable5Labels: Table5Labels = {
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

export function resolveTable5Labels(
  labels: Table5LabelsOverride | undefined,
): Table5Labels {
  return {
    ...defaultTable5Labels,
    ...labels,
    columns: { ...defaultTable5Labels.columns, ...labels?.columns },
    priorities: { ...defaultTable5Labels.priorities, ...labels?.priorities },
    statuses: { ...defaultTable5Labels.statuses, ...labels?.statuses },
    views: { ...defaultTable5Labels.views, ...labels?.views },
  }
}
