import type {
  Table8Filters,
  Table8Sort,
  Table8Transaction,
} from '@tc96/ui/blocks/data/table/table-8'
import { delay, HttpResponse, http } from 'msw'
import {
  createTable8Transactions,
  queryTable8Transactions,
  table8TotalCount,
} from '../blocks/data/table/fixtures/table-8.ts'
import { apiUrl } from './api.ts'

const path = '/data/table/transactions'

export interface Table8Page {
  items: Table8Transaction[]
  nextCursor: number | null
  total: number
}

let ledger: Table8Transaction[] | undefined

const allTransactions = () => {
  ledger ??= createTable8Transactions(table8TotalCount)
  return ledger
}

const pageOf = (url: URL): Table8Page => {
  const params = url.searchParams
  const cursor = Number(params.get('cursor') ?? 0)
  const limit = Number(params.get('limit') ?? 40)
  const key = params.get('sort') as Table8Sort['key'] | null
  const filters: Table8Filters = {
    channel: (params.get('channel') ?? '') as Table8Filters['channel'],
    method: (params.get('method') ?? '') as Table8Filters['method'],
    status: (params.get('status') ?? '') as Table8Filters['status'],
  }
  const rows = queryTable8Transactions(allTransactions(), {
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

export const table8Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json<Table8Page>({ items: [], nextCursor: null, total: 0 }),
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
    return HttpResponse.json<Table8Page>({
      items: [],
      nextCursor: null,
      total: 0,
    })
  }),
}
