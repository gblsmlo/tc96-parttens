import { delay, HttpResponse, http } from 'msw'
import { settingsIntegration5Apps } from '../blocks/application/settings/fixtures/settings-integration-5.ts'
import { apiUrl } from './api.ts'

const path = '/settings/integration-events'

export const settingsIntegration5Handlers = {
  apps: http.get(apiUrl(path), () =>
    HttpResponse.json(settingsIntegration5Apps),
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
