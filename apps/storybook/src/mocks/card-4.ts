import { delay, HttpResponse, http } from 'msw'
import { meetings } from '../blocks/application/card/fixtures/card-4.ts'
import { apiUrl } from './api.ts'

const path = '/cards/meetings'

export const card4Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(meetings)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(meetings)
  }),
}
