import { delay, HttpResponse, http } from 'msw'
import { stageRecords } from '../blocks/application/settings/fixtures/settings-10.ts'
import { apiUrl } from './api.ts'

export const settings10Handlers = {
  loaded: http.get(apiUrl('/settings/stages'), () =>
    HttpResponse.json(stageRecords),
  ),
  error: http.get(apiUrl('/settings/stages'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/stages'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
