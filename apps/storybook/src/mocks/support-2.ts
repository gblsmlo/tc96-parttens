import { delay, HttpResponse, http } from 'msw'
import { tickets } from '../blocks/data/support/fixtures/support-2.ts'
import { apiUrl } from './api.ts'

const path = '/data/table/tickets'

export const support2Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(tickets)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(tickets)
  }),
}
