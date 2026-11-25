import { delay, HttpResponse, http } from 'msw'
import { clients } from '../blocks/data/legal/fixtures/legal-4.ts'
import { apiUrl } from './api.ts'

const path = '/data/legal/clients'

export const legal4Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(clients)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(clients)
  }),
}
