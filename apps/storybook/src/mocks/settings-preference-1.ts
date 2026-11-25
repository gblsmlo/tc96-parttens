import { delay, HttpResponse, http } from 'msw'
import { settingsPreference1Preferences } from '../blocks/application/settings/fixtures/settings-preference-1.ts'
import { apiUrl } from './api.ts'

export const settingsPreference1Handlers = {
  loaded: http.get(apiUrl('/settings/preferences'), () =>
    HttpResponse.json(settingsPreference1Preferences),
  ),
  error: http.get(apiUrl('/settings/preferences'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/preferences'), async () => {
    await delay('infinite')
    return HttpResponse.json(settingsPreference1Preferences)
  }),
}
