import { delay, HttpResponse, http } from 'msw'
import { settingsIntegration7Apps } from '../blocks/application/settings/fixtures/settings-integration-7.ts'
import { apiUrl } from './api.ts'

const path = '/settings/connectors'

export const settingsIntegration7Handlers = {
  apps: http.get(apiUrl(path), () =>
    HttpResponse.json(settingsIntegration7Apps),
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
