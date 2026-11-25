import { delay, HttpResponse, http } from 'msw'
import {
  accounts,
  regions,
  summary,
} from '../blocks/data/revenue/fixtures/revenue-4.ts'
import { apiUrl } from './api.ts'

const path = '/data/table/revenue-by-region'

export const revenue4Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json({
      accounts: [],
      regions,
      summary: { atRiskArr: 0, portfolioNrr: 1, totalArr: 0 },
    }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () =>
    HttpResponse.json({ accounts, regions, summary }),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json({ accounts, regions, summary })
  }),
}
