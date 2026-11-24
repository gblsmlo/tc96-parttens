import { delay, HttpResponse, http } from 'msw'
import { capacity } from '../blocks/application/stats/fixtures/stats-3.ts'
import { apiUrl } from './api.ts'

const path = '/stats/capacity'
const data = capacity

export const stats3Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(data)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(data)
  }),
}
