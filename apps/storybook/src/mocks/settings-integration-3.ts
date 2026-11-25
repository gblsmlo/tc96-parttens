import { delay, HttpResponse, http } from 'msw'
import { settingsIntegration3Keys } from '../blocks/application/settings/fixtures/settings-integration-3.ts'
import { apiUrl } from './api.ts'

export const settingsIntegration3Handlers = {
  keys: http.get(apiUrl('/settings/api-keys'), () =>
    HttpResponse.json(settingsIntegration3Keys),
  ),
  keysEmpty: http.get(apiUrl('/settings/api-keys'), () =>
    HttpResponse.json([]),
  ),
  keysError: http.get(apiUrl('/settings/api-keys'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  keysPending: http.get(apiUrl('/settings/api-keys'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
