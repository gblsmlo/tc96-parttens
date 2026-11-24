import type {
  Dashboard2Channel,
  Dashboard2Kpi,
  Dashboard2Order,
  Dashboard2RowAction,
  Dashboard2SalesPoint,
  Dashboard2Sort,
} from '@tc96/blocks/application/dashboard/dashboard-2'

export const kpis: Dashboard2Kpi[] = [
  {
    delta: 0.084,
    format: 'currency',
    id: 'revenue',
    label: 'Receita do mês',
    sparkline: [12, 14, 13, 17, 16, 19, 22],
    trend: 'positive',
    value: 482300,
  },
  {
    delta: 0.031,
    id: 'orders',
    label: 'Pedidos',
    sparkline: [30, 28, 34, 33, 38, 36, 41],
    trend: 'positive',
    value: 3128,
  },
  {
    delta: -0.022,
    format: 'currency',
    id: 'ticket',
    label: 'Ticket médio',
    sparkline: [160, 158, 162, 155, 154, 157, 154],
    trend: 'negative',
    value: 154,
  },
  {
    delta: 0,
    format: 'percent',
    id: 'conversion',
    label: 'Conversão',
    sparkline: [2.1, 2.2, 2.2, 2.3, 2.2, 2.3, 2.3],
    trend: 'neutral',
    value: 0.023,
  },
]

export const channels: Dashboard2Channel[] = [
  { id: 'store', label: 'Loja física' },
  { id: 'web', label: 'Loja virtual' },
  { id: 'marketplace', label: 'Marketplace' },
]

export const sales: Dashboard2SalesPoint[] = [
  {
    label: 'Seg',
    plan: 22000,
    values: { marketplace: 6200, store: 9800, web: 7100 },
  },
  {
    label: 'Ter',
    plan: 23000,
    values: { marketplace: 5900, store: 10400, web: 7600 },
  },
  {
    label: 'Qua',
    plan: 24000,
    values: { marketplace: 7300, store: 9100, web: 8200 },
  },
  {
    label: 'Qui',
    plan: 26000,
    values: { marketplace: 8100, store: 11200, web: 9400 },
  },
  {
    label: 'Sex',
    plan: 30000,
    values: { marketplace: 9600, store: 13800, web: 11300 },
  },
  {
    label: 'Sáb',
    plan: 32000,
    values: { marketplace: 8800, store: 16400, web: 10100 },
  },
  {
    label: 'Dom',
    plan: 20000,
    values: { marketplace: 5400, store: 7200, web: 6800 },
  },
]

export const orders: Dashboard2Order[] = [
  {
    customer: 'Helena Prado',
    id: 'o1',
    number: '#10482',
    placedAt: '24 nov., 09:12',
    status: { label: 'Pago', tone: 'success' },
    total: 389.9,
  },
  {
    customer: 'Otávio Brandão',
    id: 'o2',
    number: '#10481',
    placedAt: '24 nov., 08:47',
    status: { label: 'Pendente', tone: 'warning' },
    total: 1249,
  },
  {
    customer: 'Beatriz Sampaio',
    id: 'o3',
    number: '#10480',
    placedAt: '23 nov., 21:30',
    status: { label: 'Enviado', tone: 'info' },
    total: 74.5,
  },
  {
    customer: 'Caio Nogueira',
    id: 'o4',
    number: '#10479',
    placedAt: '23 nov., 18:05',
    status: { label: 'Reembolsado', tone: 'error' },
    total: 219,
  },
  {
    customer: 'Alice Mendonça',
    id: 'o5',
    number: '#10478',
    placedAt: '23 nov., 16:22',
    status: { label: 'Pago', tone: 'success' },
    total: 642.8,
  },
]

const rank: Record<string, number> = { o1: 5, o2: 4, o3: 3, o4: 2, o5: 1 }

export const initialSort: Dashboard2Sort = {
  direction: 'desc',
  key: 'placedAt',
}

export const sortOrders = (rows: Dashboard2Order[], sort: Dashboard2Sort) => {
  const factor = sort.direction === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    if (sort.key === 'total') return (a.total - b.total) * factor
    if (sort.key === 'customer') {
      return a.customer.localeCompare(b.customer, 'pt-BR') * factor
    }
    return ((rank[a.id] ?? 0) - (rank[b.id] ?? 0)) * factor
  })
}

export const orderActions: Dashboard2RowAction[] = [
  { id: 'view', label: 'Ver pedido' },
  { id: 'resend', label: 'Reenviar nota fiscal' },
  { destructive: true, id: 'refund', label: 'Reembolsar' },
]
