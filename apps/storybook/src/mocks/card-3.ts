import { delay, HttpResponse, http } from 'msw'
import { profile } from '../blocks/application/card/fixtures/card-3.ts'
import { apiUrl } from './api.ts'

const path = '/card/profile'
const data = profile

export const card3Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(data)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(data)
  }),
}
