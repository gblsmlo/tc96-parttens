import { delay, HttpResponse, http } from 'msw'
import { events } from '../blocks/application/timeline/fixtures/timeline-1.ts'
import { apiUrl } from './api.ts'

const path = '/timeline/activity'

export const timeline1Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(events)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
