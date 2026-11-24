import { delay, HttpResponse, http } from 'msw'
import { settings4Data } from '../blocks/application/settings/fixtures/settings-4.ts'
import { apiUrl } from './api.ts'

export const settings4Handlers = {
  error: http.get(apiUrl('/settings/appearance'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/appearance'), () =>
    HttpResponse.json(settings4Data),
  ),
  pending: http.get(apiUrl('/settings/appearance'), async () => {
    await delay('infinite')
    return HttpResponse.json(settings4Data)
  }),
}
