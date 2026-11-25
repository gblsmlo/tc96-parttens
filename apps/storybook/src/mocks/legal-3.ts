import { delay, HttpResponse, http } from 'msw'
import { deadlines } from '../blocks/data/legal/fixtures/legal-3.ts'
import { apiUrl } from './api.ts'

const path = '/data/legal/deadlines'

export const legal3Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(deadlines)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(deadlines)
  }),
}
