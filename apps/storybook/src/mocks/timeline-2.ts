import { delay, HttpResponse, http } from 'msw'
import { releases } from '../blocks/application/timeline/fixtures/timeline-2.ts'
import { apiUrl } from './api.ts'

const path = '/timeline/releases'

export const timeline2Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(releases)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
