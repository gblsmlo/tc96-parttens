import { delay, HttpResponse, http } from 'msw'
import { settingsCatalog8Accounts } from '../blocks/application/settings/fixtures/settings-catalog-8.ts'
import { apiUrl } from './api.ts'

export const settingsCatalog8Handlers = {
  accounts: http.get(apiUrl('/settings/accounts'), () =>
    HttpResponse.json(settingsCatalog8Accounts),
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
