import { delay, HttpResponse, http } from 'msw'
import { cases } from '../blocks/data/legal/fixtures/legal-1.ts'
import { apiUrl } from './api.ts'

const path = '/data/legal/cases'

export const legal1Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(cases)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(cases)
  }),
}
