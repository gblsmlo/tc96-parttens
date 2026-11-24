import { delay, HttpResponse, http } from 'msw'
import { tickets } from '../blocks/data/data-grid/fixtures/data-grid-1.ts'
import { apiUrl } from './api.ts'

const path = '/data/tickets'

export const dataGrid1Handlers = {
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
