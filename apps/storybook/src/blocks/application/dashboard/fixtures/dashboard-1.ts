import type {
  Dashboard1CapacityPoint,
  Dashboard1Exception,
  Dashboard1FilterOption,
  Dashboard1Kpi,
  Dashboard1ReasonSlice,
} from '@tc96/blocks/application/dashboard/dashboard-1'

export const kpis: Dashboard1Kpi[] = [
  {
    delta: -0.08,
    id: 'open',
    label: 'Exceções abertas',
    trend: 'positive',
    value: 128,
  },
  {
    delta: 0.12,
    id: 'delayed',
    label: 'Pedidos atrasados',
    trend: 'negative',
    value: 42,
  },
  {
    delta: 0.012,
    format: 'percent',
    id: 'sla',
    label: 'Cumprimento do prazo',
    trend: 'positive',
    value: 0.943,
  },
  {
    delta: 0.05,
    format: 'currency',
    id: 'risk',
    label: 'Valor em risco',
    trend: 'negative',
    value: 184500,
  },
]

export const capacity: Dashboard1CapacityPoint[] = [
  { capacity: 1000, id: 'campinas', label: 'Campinas', used: 820 },
  { capacity: 800, id: 'recife', label: 'Recife', used: 790 },
  { capacity: 1200, id: 'curitiba', label: 'Curitiba', used: 640 },
  { capacity: 900, id: 'betim', label: 'Betim', used: 705 },
  { capacity: 600, id: 'manaus', label: 'Manaus', used: 410 },
]

export const exceptions: Dashboard1Exception[] = [
  {
    delayHours: 26,
    hub: 'Campinas',
    id: 'e1',
    order: 'PED-48213',
    reason: 'Endereço incompleto',
    status: { label: 'Aberta', tone: 'warning' },
  },
  {
    delayHours: 52,
    hub: 'Recife',
    id: 'e2',
    order: 'PED-48177',
    reason: 'Transportadora sem coleta',
    status: { label: 'Escalada', tone: 'error' },
  },
  {
    delayHours: 8,
    hub: 'Curitiba',
    id: 'e3',
    order: 'PED-48302',
    reason: 'Item avariado na separação',
    status: { label: 'Em análise', tone: 'info' },
  },
  {
    delayHours: 3.5,
    hub: 'Betim',
    id: 'e4',
    order: 'PED-48350',
    reason: 'Divergência de estoque',
    status: { label: 'Resolvida', tone: 'success' },
  },
  {
    delayHours: 71,
    hub: 'Manaus',
    id: 'e5',
    order: 'PED-48090',
    reason: 'Rota bloqueada',
    status: { label: 'Escalada', tone: 'error' },
  },
  {
    delayHours: 14,
    hub: 'Campinas',
    id: 'e6',
    order: 'PED-48268',
    reason: 'Pagamento pendente',
    status: { label: 'Aberta', tone: 'warning' },
  },
]

export const reasons: Dashboard1ReasonSlice[] = [
  { id: 'address', label: 'Endereço', value: 46 },
  { id: 'carrier', label: 'Transportadora', value: 38 },
  { id: 'stock', label: 'Estoque', value: 24 },
  { id: 'payment', label: 'Pagamento', value: 20 },
]

const filters = [
  { label: 'Todas', value: 'all' },
  { label: 'Abertas', value: 'Aberta' },
  { label: 'Escaladas', value: 'Escalada' },
  { label: 'Resolvidas', value: 'Resolvida' },
]

export const countFilterOptions = (
  rows: Dashboard1Exception[],
): Dashboard1FilterOption[] =>
  filters.map((option) => ({
    ...option,
    count: filterExceptions(rows, option.value).length,
  }))

export const filterOptions: Dashboard1FilterOption[] =
  countFilterOptions(exceptions)

export function filterExceptions(rows: Dashboard1Exception[], filter: string) {
  return filter === 'all'
    ? rows
    : rows.filter((row) => row.status.label === filter)
}
