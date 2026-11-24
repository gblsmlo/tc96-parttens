import { delay, HttpResponse, http } from 'msw'
import { metrics } from '../blocks/application/list/fixtures/list-1.ts'
import { apiUrl } from './api.ts'

const path = '/list/metrics'

export const list1Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(metrics)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(metrics)
  }),
}
