import { delay, HttpResponse, http } from 'msw'
import { settings14Accounts } from '../blocks/application/settings/fixtures/settings-14.ts'
import { apiUrl } from './api.ts'

export const settings14Handlers = {
  accounts: http.get(apiUrl('/settings/accounts'), () =>
    HttpResponse.json(settings14Accounts),
  ),
  accountsEmpty: http.get(apiUrl('/settings/accounts'), () =>
    HttpResponse.json([]),
  ),
  accountsError: http.get(apiUrl('/settings/accounts'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  accountsPending: http.get(apiUrl('/settings/accounts'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
