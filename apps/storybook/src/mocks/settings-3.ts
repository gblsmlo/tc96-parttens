import { delay, HttpResponse, http } from 'msw'
import { settings3Data } from '../blocks/application/settings/fixtures/settings-3.ts'
import { apiUrl } from './api.ts'

export const settings3Handlers = {
  error: http.get(apiUrl('/settings/interface'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/interface'), () =>
    HttpResponse.json(settings3Data),
  ),
  pending: http.get(apiUrl('/settings/interface'), async () => {
    await delay('infinite')
    return HttpResponse.json(settings3Data)
  }),
}
