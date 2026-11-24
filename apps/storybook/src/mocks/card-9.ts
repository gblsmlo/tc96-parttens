import { delay, HttpResponse, http } from 'msw'
import { delivery } from '../blocks/application/card/fixtures/card-9.ts'
import { apiUrl } from './api.ts'

const path = '/orders/:id/delivery'

export const card9Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(delivery)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(delivery)
  }),
}
