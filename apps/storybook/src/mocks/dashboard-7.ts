import { delay, HttpResponse, http } from 'msw'
import {
  accountBalances,
  balances,
  cashFlow,
  cashFlowGrid,
  cashFlowTotals,
  clientMoney,
  dueSoon,
  expenseByCategory,
  incomeByCategory,
  indicators,
  receivables,
} from '../blocks/application/dashboard/fixtures/dashboard-7.ts'
import { apiUrl } from './api.ts'

const path = '/dashboard/finance-analytics'

const emptyBody = {
  accountBalances: [],
  cashFlow: [],
  cashFlowGrid: { months: [], rows: [] },
  clientMoney: [],
  dueSoon: [],
  expenseByCategory: [],
  incomeByCategory: [],
  indicators: {},
}

export const dashboard7Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json(emptyBody)),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () =>
    HttpResponse.json({
      accountBalances,
      balances,
      cashFlow,
      cashFlowGrid,
      cashFlowTotals,
      clientMoney,
      dueSoon,
      expenseByCategory,
      incomeByCategory,
      indicators,
      receivables,
    }),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(emptyBody)
  }),
}
