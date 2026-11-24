import { delay, HttpResponse, http } from 'msw'
import { settings2Preferences } from '../blocks/application/settings/fixtures/settings-2.ts'
import { apiUrl } from './api.ts'

export const settings2Handlers = {
  loaded: http.get(apiUrl('/settings/preferences'), () =>
    HttpResponse.json(settings2Preferences),
  ),
  error: http.get(apiUrl('/settings/preferences'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/preferences'), async () => {
    await delay('infinite')
    return HttpResponse.json(settings2Preferences)
  }),
}
