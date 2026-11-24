import { delay, HttpResponse, http } from 'msw'
import { integrations } from '../blocks/application/card/fixtures/card-2.ts'
import { apiUrl } from './api.ts'

const path = '/card/integrations'
const data = integrations

export const card2Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(data)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(data)
  }),
}
