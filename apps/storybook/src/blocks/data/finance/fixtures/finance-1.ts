import type {
  Finance1Channel,
  Finance1Filters,
  Finance1Method,
  Finance1Sort,
  Finance1Status,
  Finance1Transaction,
  Finance1View,
} from '@tc96/ui/blocks/data/finance/finance-1'

export const finance1TotalCount = 10_000
export const finance1PageSize = 40

export const initialSort: Finance1Sort = { direction: 'desc', key: 'date' }

export const emptyFilters: Finance1Filters = {
  channel: '',
  method: '',
  status: '',
}

export const views: Finance1View[] = [
  { id: 'all', label: 'Todas as transações' },
  { id: 'disputes', label: 'Disputas abertas' },
  { id: 'high-risk', label: 'Risco alto' },
]

const customers = [
  ['Ana Souza', 'ana.souza@exemplo.com.br'],
  ['Bruno Tavares', 'bruno.tavares@correio.com.br'],
  ['Camila Duarte', 'camila.duarte@exemplo.com.br'],
  ['Diego Farias', 'diego.farias@mail.com.br'],
  ['Elisa Ramos', 'elisa.ramos@exemplo.com.br'],
  ['Fábio Lima', 'fabio.lima@correio.com.br'],
  ['Helena Prado', 'helena.prado@mail.com.br'],
  ['Igor Teixeira', 'igor.teixeira@exemplo.com.br'],
  ['Júlia Barros', 'julia.barros@correio.com.br'],
  ['Larissa Moura', 'larissa.moura@mail.com.br'],
  ['Marina Alves', 'marina.alves@exemplo.com.br'],
  ['Otávio Reis', 'otavio.reis@correio.com.br'],
] as const

const statuses: readonly Finance1Status[] = [
  'settled',
  'settled',
  'settled',
  'settled',
  'pending',
  'refunded',
  'failed',
]
const methods: readonly Finance1Method[] = [
  'card',
  'card',
  'apple-pay',
  'google-pay',
  'paypal',
]
const channels: readonly Finance1Channel[] = ['api', 'web', 'mobile', 'pos']

const random = (seed: number) => {
  let state = (seed * 2_654_435_761) >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }
}

const pick = <T>(items: readonly T[], next: () => number): T =>
  items[Math.floor(next() * items.length)] as T

const pad = (value: number) => String(value).padStart(2, '0')

const start = new Date(2026, 5, 23, 16, 59).getTime()

const localIso = (time: number) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

export function createFinance1Transaction(index: number): Finance1Transaction {
  const next = random(index + 1)
  const [name, email] = pick(customers, next)
  const code = (46_656 + index).toString(36).toUpperCase().padStart(5, '0')
  return {
    amount: Math.round((next() ** 2 * 4_000 + 5) * 100) / 100,
    channel: pick(channels, next),
    chargeId: `ch_${Math.floor(next() * 36 ** 6)
      .toString(36)
      .padStart(6, '0')}`,
    createdAt: localIso(start - index * 105_000),
    customer: { email, name },
    id: `TXN-${code}`,
    lastFour: String(Math.floor(next() * 9_000) + 1_000),
    method: pick(methods, next),
    risk: Math.floor(next() * 100),
    status: pick(statuses, next),
  }
}

export function createFinance1Transactions(
  count: number,
  offset = 0,
): Finance1Transaction[] {
  return Array.from({ length: count }, (_, index) =>
    createFinance1Transaction(offset + index),
  )
}

export const transactions = createFinance1Transactions(finance1PageSize)

const sortValue = (
  transaction: Finance1Transaction,
  key: Finance1Sort['key'],
) => {
  if (key === 'customer') return transaction.customer.name
  if (key === 'date') return transaction.createdAt
  if (key === 'transaction') return transaction.id
  return transaction[key]
}

export interface Finance1Query {
  filters: Finance1Filters
  search: string
  sort: Finance1Sort | null
}

export function queryFinance1Transactions(
  rows: readonly Finance1Transaction[],
  { filters, search, sort }: Finance1Query,
): Finance1Transaction[] {
  const needle = search.trim().toLocaleLowerCase('pt-BR')
  const filtered = rows.filter(
    (row) =>
      (!filters.status || row.status === filters.status) &&
      (!filters.method || row.method === filters.method) &&
      (!filters.channel || row.channel === filters.channel) &&
      (!needle ||
        [
          row.id,
          row.chargeId,
          row.customer.name,
          row.customer.email,
          row.lastFour,
        ]
          .join(' ')
          .toLocaleLowerCase('pt-BR')
          .includes(needle)),
  )
  if (!sort) return filtered
  const direction = sort.direction === 'asc' ? 1 : -1
  return [...filtered].sort((left, right) => {
    const a = sortValue(left, sort.key)
    const b = sortValue(right, sort.key)
    if (a === b) return 0
    return (a < b ? -1 : 1) * direction
  })
}
