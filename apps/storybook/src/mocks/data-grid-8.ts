import type {
  DataGrid8Filters,
  DataGrid8Sort,
  DataGrid8Transaction,
} from '@tc96/ui/blocks/data/data-grid/data-grid-8'
import { delay, HttpResponse, http } from 'msw'
import {
  createDataGrid8Transactions,
  dataGrid8TotalCount,
  queryDataGrid8Transactions,
} from '../blocks/data/data-grid/fixtures/data-grid-8.ts'
import { apiUrl } from './api.ts'

const path = '/data/transactions'

export interface DataGrid8Page {
  items: DataGrid8Transaction[]
  nextCursor: number | null
  total: number
}

let ledger: DataGrid8Transaction[] | undefined

const allTransactions = () => {
  ledger ??= createDataGrid8Transactions(dataGrid8TotalCount)
  return ledger
}

const pageOf = (url: URL): DataGrid8Page => {
  const params = url.searchParams
  const cursor = Number(params.get('cursor') ?? 0)
  const limit = Number(params.get('limit') ?? 40)
  const key = params.get('sort') as DataGrid8Sort['key'] | null
  const filters: DataGrid8Filters = {
    channel: (params.get('channel') ?? '') as DataGrid8Filters['channel'],
    method: (params.get('method') ?? '') as DataGrid8Filters['method'],
    status: (params.get('status') ?? '') as DataGrid8Filters['status'],
  }
  const rows = queryDataGrid8Transactions(allTransactions(), {
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

export const dataGrid8Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json<DataGrid8Page>({ items: [], nextCursor: null, total: 0 }),
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
    return HttpResponse.json<DataGrid8Page>({
      items: [],
      nextCursor: null,
      total: 0,
    })
  }),
}
