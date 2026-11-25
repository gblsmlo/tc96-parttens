import { delay, HttpResponse, http } from 'msw'
import { run } from '../blocks/application/flow/fixtures/flow-3.ts'
import { apiUrl } from './api.ts'

const path = '/flow/flow-3'

export const flow3Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json({ connections: [], steps: [] }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(run)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(run)
  }),
}
