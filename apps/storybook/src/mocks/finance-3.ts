import type {
  Finance3EntryType,
  Finance3Situation,
  Finance3View,
} from '@tc96/ui/blocks/data/finance/finance-3'
import { delay, HttpResponse, http } from 'msw'
import {
  clientBalances,
  counts,
  entries,
  entryInView,
  type Finance3ClientMoneyPage,
  type Finance3EntriesPage,
  type Finance3ReceivablesPage,
  type Finance3StatementPage,
  receivables,
  statementLines,
  statementSummary,
} from '../blocks/data/finance/fixtures/finance-3.ts'
import { apiUrl } from './api.ts'

const paths = {
  clientMoney: '/data/finance/client-money',
  entries: '/data/finance/entries',
  receivables: '/data/finance/collection-queue',
  statement: '/data/finance/accounts/:accountId/statement',
}

const typeKinds: Record<Finance3EntryType, readonly string[]> = {
  expense: ['expense'],
  income: ['fee', 'other_income'],
  transfer: ['transfer'],
}

const entriesPageOf = (url: URL): Finance3EntriesPage => {
  const view = (url.searchParams.get('view') ?? 'all') as Finance3View
  const situation = url.searchParams.get(
    'situation',
  ) as Finance3Situation | null
  const type = url.searchParams.get('type') as Finance3EntryType | null
  const accountId = url.searchParams.get('accountId')
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 25)
  const matching = entries.filter(
    (item) =>
      entryInView(item, view) &&
      (!situation || item.situation === situation) &&
      (!type || typeKinds[type].includes(item.kind)) &&
      (!accountId || item.accountId === accountId),
  )
  return {
    counts,
    items: matching.slice((page - 1) * limit, page * limit),
    total: matching.length,
  }
}

const emptyEntries: Finance3EntriesPage = { counts: {}, items: [], total: 0 }

const failure = () =>
  HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 })

const never = async () => {
  await delay('infinite')
  return HttpResponse.json({})
}

export const finance3Handlers = {
  clientMoney: {
    empty: http.get(apiUrl(paths.clientMoney), () =>
      HttpResponse.json({ items: [] } satisfies Finance3ClientMoneyPage),
    ),
    error: http.get(apiUrl(paths.clientMoney), failure),
    loaded: http.get(apiUrl(paths.clientMoney), () =>
      HttpResponse.json({
        items: clientBalances,
      } satisfies Finance3ClientMoneyPage),
    ),
    pending: http.get(apiUrl(paths.clientMoney), never),
  },
  entries: {
    empty: http.get(apiUrl(paths.entries), () =>
      HttpResponse.json(emptyEntries),
    ),
    error: http.get(apiUrl(paths.entries), failure),
    loaded: http.get(apiUrl(paths.entries), ({ request }) =>
      HttpResponse.json(entriesPageOf(new URL(request.url))),
    ),
    pending: http.get(apiUrl(paths.entries), never),
  },
  receivables: {
    error: http.get(apiUrl(paths.receivables), failure),
    loaded: http.get(apiUrl(paths.receivables), () =>
      HttpResponse.json({
        counts,
        items: receivables,
        truncated: false,
      } satisfies Finance3ReceivablesPage),
    ),
    pending: http.get(apiUrl(paths.receivables), never),
    truncated: http.get(apiUrl(paths.receivables), () =>
      HttpResponse.json({
        counts,
        items: receivables,
        truncated: true,
      } satisfies Finance3ReceivablesPage),
    ),
  },
  statement: {
    error: http.get(apiUrl(paths.statement), failure),
    loaded: http.get(apiUrl(paths.statement), () =>
      HttpResponse.json({
        lines: statementLines,
        summary: statementSummary,
      } satisfies Finance3StatementPage),
    ),
    pending: http.get(apiUrl(paths.statement), never),
  },
}
