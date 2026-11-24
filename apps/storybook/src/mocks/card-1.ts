import { delay, HttpResponse, http } from 'msw'
import { facts } from '../blocks/application/card/fixtures/card-1.ts'
import { apiUrl } from './api.ts'

const path = '/card/facts'
const data = facts

export const card1Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(data)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(data)
  }),
}
