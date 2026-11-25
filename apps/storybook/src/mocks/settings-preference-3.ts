import { delay, HttpResponse, http } from 'msw'
import { settingsPreference3Data } from '../blocks/application/settings/fixtures/settings-preference-3.ts'
import { apiUrl } from './api.ts'

export const settingsPreference3Handlers = {
  error: http.get(apiUrl('/settings/appearance'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/appearance'), () =>
    HttpResponse.json(settingsPreference3Data),
  ),
  pending: http.get(apiUrl('/settings/appearance'), async () => {
    await delay('infinite')
    return HttpResponse.json(settingsPreference3Data)
  }),
}
