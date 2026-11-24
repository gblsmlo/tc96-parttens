import { delay, HttpResponse, http } from 'msw'
import { stats } from '../blocks/application/stats/fixtures/stats-1.ts'
import { apiUrl } from './api.ts'

const path = '/stats/overview'
const data = stats

export const stats1Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(data)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(data)
  }),
}
