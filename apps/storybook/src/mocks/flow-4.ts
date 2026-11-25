import { delay, HttpResponse, http } from 'msw'
import { map } from '../blocks/application/flow/fixtures/flow-4.ts'
import { apiUrl } from './api.ts'

const path = '/flow/flow-4'

export const flow4Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json({ links: [], nodes: [] }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(map)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(map)
  }),
}
