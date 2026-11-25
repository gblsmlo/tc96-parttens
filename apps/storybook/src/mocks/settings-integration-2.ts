import { delay, HttpResponse, http } from 'msw'
import { settingsIntegration2Apps } from '../blocks/application/settings/fixtures/settings-integration-2.ts'
import { apiUrl } from './api.ts'

const path = '/settings/connected-apps'

export const settingsIntegration2Handlers = {
  apps: http.get(apiUrl(path), () =>
    HttpResponse.json(settingsIntegration2Apps),
  ),
  appsEmpty: http.get(apiUrl(path), () => HttpResponse.json([])),
  appsError: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  appsPending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
