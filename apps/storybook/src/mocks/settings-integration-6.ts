import { delay, HttpResponse, http } from 'msw'
import { settingsIntegration6Apps } from '../blocks/application/settings/fixtures/settings-integration-6.ts'
import { apiUrl } from './api.ts'

const path = '/settings/integration-gallery'

export const settingsIntegration6Handlers = {
  apps: http.get(apiUrl(path), () =>
    HttpResponse.json(settingsIntegration6Apps),
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
