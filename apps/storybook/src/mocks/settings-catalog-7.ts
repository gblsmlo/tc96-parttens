import { delay, HttpResponse, http } from 'msw'
import { settingsCatalog7Data } from '../blocks/application/settings/fixtures/settings-catalog-7.ts'
import { apiUrl } from './api.ts'

export const settingsCatalog7Handlers = {
  loaded: http.get(apiUrl('/settings/loss-reasons'), () =>
    HttpResponse.json(settingsCatalog7Data),
  ),
  empty: http.get(apiUrl('/settings/loss-reasons'), () =>
    HttpResponse.json({
      ...settingsCatalog7Data,
      archivedReasons: [],
      reasons: [],
    }),
  ),
  error: http.get(apiUrl('/settings/loss-reasons'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/loss-reasons'), async () => {
    await delay('infinite')
    return HttpResponse.json(settingsCatalog7Data)
  }),
}
