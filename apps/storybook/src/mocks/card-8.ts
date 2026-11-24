import { delay, HttpResponse, http } from 'msw'
import { meetings } from '../blocks/application/card/fixtures/card-8.tsx'
import { apiUrl } from './api.ts'

const path = '/crm/contacts/:id/meetings'

export const card8Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(meetings)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(meetings)
  }),
}
