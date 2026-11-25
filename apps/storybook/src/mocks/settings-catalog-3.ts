import { delay, HttpResponse, http } from 'msw'
import { rules } from '../blocks/application/settings/fixtures/settings-catalog-3.ts'
import { apiUrl } from './api.ts'

export const settingsCatalog3Handlers = {
  loaded: http.get(apiUrl('/settings/rules'), () => HttpResponse.json(rules)),
  empty: http.get(apiUrl('/settings/rules'), () => HttpResponse.json([])),
  error: http.get(apiUrl('/settings/rules'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/rules'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
