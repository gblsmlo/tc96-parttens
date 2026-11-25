import { delay, HttpResponse, http } from 'msw'
import { contracts } from '../blocks/data/legal/fixtures/legal-2.ts'
import { apiUrl } from './api.ts'

const path = '/data/legal/contracts'

export const legal2Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(contracts)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(contracts)
  }),
}
