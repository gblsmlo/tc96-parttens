import type { Dashboard1Labels } from './types'

export const defaultDashboard1Labels: Dashboard1Labels = {
  breadcrumb: 'Navegação estrutural',
  capacityLabel: 'Capacidade utilizada por centro de distribuição',
  capacitySummary: (items) =>
    items
      .map((item) => `${item.label}: ${item.used} de ${item.capacity}`)
      .join('; '),
  capacityTitle: 'Capacidade por centro',
  capacityTotal: 'Capacidade',
  capacityUsed: 'Utilizada',
  columnActions: 'Ações',
  columnDelay: 'Atraso',
  columnHub: 'Centro',
  columnOrder: 'Pedido',
  columnReason: 'Motivo',
  columnStatus: 'Status',
  delay: (hours) => `${hours} h`,
  description: 'Pedidos parados, onde estão e há quanto tempo.',
  emptyDescription: 'As exceções aparecem aqui assim que forem registradas.',
  emptyTitle: 'Nenhuma exceção de expedição',
  errorDescription: 'Tente novamente em instantes.',
  errorTitle: 'Não foi possível carregar as exceções',
  exceptionsTitle: 'Exceções abertas',
  export: 'Exportar',
  filter: 'Filtrar por status',
  indicators: 'Indicadores',
  loading: 'Carregando exceções de expedição',
  nextPage: 'Próxima página',
  noExceptions: 'Nenhuma exceção para este filtro',
  pageOf: (page, pageCount) => `Página ${page} de ${pageCount}`,
  pagination: 'Paginação das exceções',
  period: 'Período',
  previousPage: 'Página anterior',
  reasonsLabel: 'Exceções por motivo',
  reasonsSummary: (items) =>
    items.map((item) => `${item.label}: ${item.value}`).join('; '),
  reasonsTitle: 'Motivos',
  retry: 'Tentar novamente',
  rowActionsFor: (order) => `Ações de ${order}`,
  search: 'Buscar pedido',
  title: 'Exceções de expedição',
}
