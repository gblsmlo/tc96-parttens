import { delay, HttpResponse, http } from 'msw'
import { connectors } from '../blocks/application/empty-state/fixtures/empty-state-5.ts'
import { apiUrl } from './api.ts'

const path = '/empty-state/connectors'
const data = connectors

export const emptyState5Handlers = {
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
