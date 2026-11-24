import {
  defaultTableLoadLabels,
  defaultTableViewLabels,
} from '../shared/labels'
import type { Table1Labels, Table1LabelsOverride } from './types'

export const defaultTable1Labels: Table1Labels = {
  ...defaultTableLoadLabels,
  ...defaultTableViewLabels,
  allQueues: 'Todas as filas',
  allStatuses: 'Todos os status',
  assignOwner: 'Atribuir responsável',
  clearFilters: 'Limpar filtros',
  clearSelection: 'Limpar seleção',
  columns: {
    actions: 'Ações',
    priority: 'Prioridade',
    queue: 'Fila',
    requester: 'Solicitante',
    sla: 'SLA',
    status: 'Status',
    ticket: 'Chamado',
  },
  columnsMenu: 'Colunas',
  create: 'Novo chamado',
  clearSort: 'Limpar ordenação',
  densities: {
    'extra-tall': 'Extra alta',
    medium: 'Média',
    short: 'Compacta',
    tall: 'Alta',
  },
  density: 'Altura das linhas',
  filterCount: (label, count) => `${label} (${count})`,
  sortOption: (column, direction) =>
    `${column}: ${direction === 'asc' ? 'crescente' : 'decrescente'}`,
  display: 'Exibição',
  empty: 'Nenhum chamado para exibir.',
  errorTitle: 'Não foi possível carregar os chamados',
  export: 'Exportar CSV',
  filters: 'Filtros',
  loading: 'Carregando chamados',
  newStatus: 'Novo status',
  owner: 'Responsável',
  priorities: {
    high: 'Alta',
    low: 'Baixa',
    medium: 'Média',
    urgent: 'Urgente',
  },
  queue: 'Fila',
  queues: {
    authentication: 'Autenticação',
    billing: 'Faturamento',
    integrations: 'Integrações',
    platform: 'Plataforma',
  },
  rowActionsFor: (ticket) => `Ações de ${ticket}`,
  rowsPerPage: 'Linhas por página',
  saveView: 'Salvar visão',
  search: 'Buscar chamados',
  selectAll: 'Selecionar todos os chamados da página',
  selectedCount: (count) =>
    count === 1 ? '1 chamado selecionado' : `${count} chamados selecionados`,
  selectionActions: 'Ações dos chamados selecionados',
  selectTicket: (ticket) => `Selecionar ${ticket}`,
  sortBy: 'Ordenar por',
  status: 'Status',
  statuses: {
    open: 'Aberto',
    pending: 'Pendente',
    resolved: 'Resolvido',
  },
  summary: (visible, unassigned, nearSla) =>
    `${visible} visíveis · ${unassigned} sem responsável · ${nearSla} perto do SLA`,
  title: 'Fila de suporte',
  toolbar: 'Controles da fila de suporte',
  updateStatus: 'Atualizar status',
}

export function resolveTable1Labels(
  labels: Table1LabelsOverride | undefined,
): Table1Labels {
  return {
    ...defaultTable1Labels,
    ...labels,
    columns: { ...defaultTable1Labels.columns, ...labels?.columns },
    densities: { ...defaultTable1Labels.densities, ...labels?.densities },
    priorities: { ...defaultTable1Labels.priorities, ...labels?.priorities },
    queues: { ...defaultTable1Labels.queues, ...labels?.queues },
    statuses: { ...defaultTable1Labels.statuses, ...labels?.statuses },
  }
}
