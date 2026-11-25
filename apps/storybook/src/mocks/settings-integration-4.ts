import { delay, HttpResponse, http } from 'msw'
import { settingsIntegration4Sections } from '../blocks/application/settings/fixtures/settings-integration-4.ts'
import { apiUrl } from './api.ts'

const path = '/settings/connections'

export const settingsIntegration4Handlers = {
  sections: http.get(apiUrl(path), () =>
    HttpResponse.json(settingsIntegration4Sections),
  ),
  sectionsEmpty: http.get(apiUrl(path), () => HttpResponse.json([])),
  sectionsError: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  sectionsPending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
