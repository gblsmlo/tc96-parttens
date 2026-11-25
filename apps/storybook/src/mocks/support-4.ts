import { delay, HttpResponse, http } from 'msw'
import { rules } from '../blocks/data/support/fixtures/support-4.ts'
import { apiUrl } from './api.ts'

const path = '/data/table/routing-rules'

export const support4Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(rules)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(rules)
  }),
}
