import type {
  Finance2Filters,
  Finance2Sort,
  Finance2Transaction,
} from '@tc96/ui/blocks/data/finance/finance-2'
import { delay, HttpResponse, http } from 'msw'
import {
  createFinance2Transactions,
  finance2TotalCount,
  queryFinance2Transactions,
} from '../blocks/data/finance/fixtures/finance-2.ts'
import { apiUrl } from './api.ts'

const path = '/data/table/transactions'

export interface Finance2Page {
  items: Finance2Transaction[]
  nextCursor: number | null
  total: number
}

let ledger: Finance2Transaction[] | undefined

const allTransactions = () => {
  ledger ??= createFinance2Transactions(finance2TotalCount)
  return ledger
}

const pageOf = (url: URL): Finance2Page => {
  const params = url.searchParams
  const cursor = Number(params.get('cursor') ?? 0)
  const limit = Number(params.get('limit') ?? 40)
  const key = params.get('sort') as Finance2Sort['key'] | null
  const filters: Finance2Filters = {
    channel: (params.get('channel') ?? '') as Finance2Filters['channel'],
    method: (params.get('method') ?? '') as Finance2Filters['method'],
    status: (params.get('status') ?? '') as Finance2Filters['status'],
  }
  const rows = queryFinance2Transactions(allTransactions(), {
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

export const finance2Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json<Finance2Page>({ items: [], nextCursor: null, total: 0 }),
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
    return HttpResponse.json<Finance2Page>({
      items: [],
      nextCursor: null,
      total: 0,
    })
  }),
}
