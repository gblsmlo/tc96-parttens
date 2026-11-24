import type { Dashboard2Labels } from './types'

export const defaultDashboard2Labels: Dashboard2Labels = {
  columnCustomer: 'Cliente',
  columnOrder: 'Pedido',
  columnPlacedAt: 'Data',
  columnStatus: 'Status',
  columnTotal: 'Total',
  emptyDescription: 'As vendas aparecem aqui assim que forem registradas.',
  emptyTitle: 'Nenhuma venda registrada',
  errorDescription: 'Tente novamente em instantes.',
  errorTitle: 'Não foi possível carregar as vendas',
  indicators: 'Indicadores',
  loading: 'Carregando receita do varejo',
  noOrders: 'Nenhum pedido no período',
  ordersTitle: 'Pedidos recentes',
  retry: 'Tentar novamente',
  salesLabel: 'Vendas por canal ao longo do período',
  salesSummary: (items) =>
    items.map((item) => `${item.label}: ${item.total}`).join('; '),
  salesTitle: 'Vendas por canal',
  sortBy: (column) => `Ordenar por ${column}`,
  title: 'Receita do varejo',
}
