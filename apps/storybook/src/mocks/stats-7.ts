import { delay, HttpResponse, http } from 'msw'
import { stats7Metrics } from '../blocks/application/stats/fixtures/stats-7.ts'
import { apiUrl } from './api.ts'

const path = '/stats/product-metrics'

export const stats7Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(stats7Metrics)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
