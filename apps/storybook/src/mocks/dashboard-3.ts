import { delay, HttpResponse, http } from 'msw'
import {
  crew,
  forecast,
  queue,
} from '../blocks/application/dashboard/fixtures/dashboard-3.ts'
import { apiUrl } from './api.ts'

const path = '/dashboard/team-coverage'

export const dashboard3Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json({ crew: [], forecast: [], queue: [] }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () =>
    HttpResponse.json({ crew, forecast, queue }),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json({ crew: [], forecast: [], queue: [] })
  }),
}
