import { delay, HttpResponse, http } from 'msw'
import { map } from '../blocks/ai-agents/flow/fixtures/impact-map.ts'
import { apiUrl } from './api.ts'

const path = '/flow/impact-map'

export const impactMapHandlers = {
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
