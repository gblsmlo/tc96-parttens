import { delay, HttpResponse, http } from 'msw'
import { settingsCatalog5Wire } from '../blocks/application/settings/fixtures/settings-catalog-5.ts'
import { apiUrl } from './api.ts'

export const settingsCatalog5Handlers = {
  loaded: http.get(apiUrl('/settings/statuses'), () =>
    HttpResponse.json(settingsCatalog5Wire),
  ),
  error: http.get(apiUrl('/settings/statuses'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/statuses'), async () => {
    await delay('infinite')
    return HttpResponse.json(settingsCatalog5Wire)
  }),
}
