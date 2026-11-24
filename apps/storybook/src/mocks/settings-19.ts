import { delay, HttpResponse, http } from 'msw'
import { endpoints } from '../blocks/application/settings/fixtures/settings-19.ts'
import { apiUrl } from './api.ts'

export const settings19Handlers = {
  empty: http.get(apiUrl('/settings/webhooks'), () => HttpResponse.json([])),
  error: http.get(apiUrl('/settings/webhooks'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/webhooks'), () =>
    HttpResponse.json(endpoints),
  ),
  pending: http.get(apiUrl('/settings/webhooks'), async () => {
    await delay('infinite')
    return HttpResponse.json(endpoints)
  }),
}
