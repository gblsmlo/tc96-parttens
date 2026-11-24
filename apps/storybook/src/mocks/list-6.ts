import { delay, HttpResponse, http } from 'msw'
import { movers } from '../blocks/application/list/fixtures/list-6.ts'
import { apiUrl } from './api.ts'

const path = '/list/movers'
const data = movers

export const list6Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(data)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(data)
  }),
}
