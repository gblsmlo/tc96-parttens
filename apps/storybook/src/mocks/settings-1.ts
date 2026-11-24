import { delay, HttpResponse, http } from 'msw'
import { settings1Account } from '../blocks/application/settings/fixtures/settings-1.ts'
import { apiUrl } from './api.ts'

export const settings1Handlers = {
  loaded: http.get(apiUrl('/settings/account'), () =>
    HttpResponse.json(settings1Account),
  ),
  error: http.get(apiUrl('/settings/account'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/account'), async () => {
    await delay('infinite')
    return HttpResponse.json(settings1Account)
  }),
}
