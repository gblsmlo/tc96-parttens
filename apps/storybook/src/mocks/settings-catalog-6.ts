import { delay, HttpResponse, http } from 'msw'
import { settingsCatalog6Data } from '../blocks/application/settings/fixtures/settings-catalog-6.ts'
import { apiUrl } from './api.ts'

export const settingsCatalog6Handlers = {
  loaded: http.get(apiUrl('/settings/next-actions'), () =>
    HttpResponse.json(settingsCatalog6Data),
  ),
  empty: http.get(apiUrl('/settings/next-actions'), () =>
    HttpResponse.json({ ...settingsCatalog6Data, stages: [] }),
  ),
  error: http.get(apiUrl('/settings/next-actions'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/next-actions'), async () => {
    await delay('infinite')
    return HttpResponse.json(settingsCatalog6Data)
  }),
}
