import { delay, HttpResponse, http } from 'msw'
import { settingsPreference2Data } from '../blocks/application/settings/fixtures/settings-preference-2.ts'
import { apiUrl } from './api.ts'

export const settingsPreference2Handlers = {
  error: http.get(apiUrl('/settings/interface'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/interface'), () =>
    HttpResponse.json(settingsPreference2Data),
  ),
  pending: http.get(apiUrl('/settings/interface'), async () => {
    await delay('infinite')
    return HttpResponse.json(settingsPreference2Data)
  }),
}
