import { delay, HttpResponse, http } from 'msw'
import { renewals } from '../blocks/data/revenue/fixtures/revenue-1.ts'
import { apiUrl } from './api.ts'

const path = '/data/renewals'

export const revenue1Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(renewals)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(renewals)
  }),
}
