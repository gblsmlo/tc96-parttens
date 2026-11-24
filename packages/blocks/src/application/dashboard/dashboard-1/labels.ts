import type { Dashboard1Labels } from './types'

export const defaultDashboard1Labels: Dashboard1Labels = {
  capacityLabel: 'Capacidade utilizada por centro de distribuição',
  capacitySummary: (items) =>
    items
      .map((item) => `${item.label}: ${item.used} de ${item.capacity}`)
      .join('; '),
  capacityTitle: 'Capacidade por centro',
  capacityTotal: 'Capacidade',
  capacityUsed: 'Utilizada',
  columnDelay: 'Atraso',
  columnHub: 'Centro',
  columnOrder: 'Pedido',
  columnReason: 'Motivo',
  columnStatus: 'Status',
  delay: (hours) => `${hours} h`,
  emptyDescription: 'As exceções aparecem aqui assim que forem registradas.',
  emptyTitle: 'Nenhuma exceção de expedição',
  errorDescription: 'Tente novamente em instantes.',
  errorTitle: 'Não foi possível carregar as exceções',
  exceptionsTitle: 'Exceções abertas',
  filter: 'Filtrar por status',
  indicators: 'Indicadores',
  loading: 'Carregando exceções de expedição',
  noExceptions: 'Nenhuma exceção para este filtro',
  retry: 'Tentar novamente',
  title: 'Exceções de expedição',
}
