import { delay, HttpResponse, http } from 'msw'
import {
  accounts,
  regions,
  summary,
} from '../blocks/data/data-grid/fixtures/data-grid-6.ts'
import { apiUrl } from './api.ts'

const path = '/data/revenue-by-region'

export const dataGrid6Handlers = {
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
