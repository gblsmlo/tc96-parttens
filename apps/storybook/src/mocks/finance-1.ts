import type {
  Finance1Filters,
  Finance1Sort,
  Finance1Transaction,
} from '@tc96/ui/blocks/data/finance/finance-1'
import { delay, HttpResponse, http } from 'msw'
import {
  createFinance1Transactions,
  finance1TotalCount,
  queryFinance1Transactions,
} from '../blocks/data/finance/fixtures/finance-1.ts'
import { apiUrl } from './api.ts'

const path = '/data/transactions'

export interface Finance1Page {
  items: Finance1Transaction[]
  nextCursor: number | null
  total: number
}

let ledger: Finance1Transaction[] | undefined

const allTransactions = () => {
  ledger ??= createFinance1Transactions(finance1TotalCount)
  return ledger
}

const pageOf = (url: URL): Finance1Page => {
  const params = url.searchParams
  const cursor = Number(params.get('cursor') ?? 0)
  const limit = Number(params.get('limit') ?? 40)
  const key = params.get('sort') as Finance1Sort['key'] | null
  const filters: Finance1Filters = {
    channel: (params.get('channel') ?? '') as Finance1Filters['channel'],
    method: (params.get('method') ?? '') as Finance1Filters['method'],
    status: (params.get('status') ?? '') as Finance1Filters['status'],
  }
  const rows = queryFinance1Transactions(allTransactions(), {
    filters,
    search: params.get('search') ?? '',
    sort: key
      ? {
          direction: params.get('direction') === 'asc' ? 'asc' : 'desc',
          key,
        }
      : null,
  })
  const items = rows.slice(cursor, cursor + limit)
  const end = cursor + items.length
  return {
    items,
    nextCursor: end < rows.length ? end : null,
    total: rows.length,
  }
}

export const finance1Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json<Finance1Page>({ items: [], nextCursor: null, total: 0 }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), async ({ request }) => {
    await delay(150)
    return HttpResponse.json(pageOf(new URL(request.url)))
  }),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json<Finance1Page>({
      items: [],
      nextCursor: null,
      total: 0,
    })
  }),
}
