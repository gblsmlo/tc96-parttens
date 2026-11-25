import { delay, HttpResponse, http } from 'msw'
import { settingsAccount1Account } from '../blocks/application/settings/fixtures/settings-account-1.ts'
import { apiUrl } from './api.ts'

export const settingsAccount1Handlers = {
  loaded: http.get(apiUrl('/settings/account'), () =>
    HttpResponse.json(settingsAccount1Account),
  ),
  error: http.get(apiUrl('/settings/account'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/account'), async () => {
    await delay('infinite')
    return HttpResponse.json(settingsAccount1Account)
  }),
}
