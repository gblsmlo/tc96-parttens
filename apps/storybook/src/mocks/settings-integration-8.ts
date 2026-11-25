import { delay, HttpResponse, http } from 'msw'
import { settingsIntegration8Items } from '../blocks/application/settings/fixtures/settings-integration-8.ts'
import { apiUrl } from './api.ts'

const path = '/settings/api-integrations'

export const settingsIntegration8Handlers = {
  items: http.get(apiUrl(path), () =>
    HttpResponse.json(settingsIntegration8Items),
  ),
  itemsEmpty: http.get(apiUrl(path), () => HttpResponse.json([])),
  itemsError: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  itemsPending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
