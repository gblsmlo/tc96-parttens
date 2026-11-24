import { delay, HttpResponse, http } from 'msw'
import { settings13Data } from '../blocks/application/settings/fixtures/settings-13.ts'
import { apiUrl } from './api.ts'

export const settings13Handlers = {
  loaded: http.get(apiUrl('/settings/loss-reasons'), () =>
    HttpResponse.json(settings13Data),
  ),
  empty: http.get(apiUrl('/settings/loss-reasons'), () =>
    HttpResponse.json({ ...settings13Data, archivedReasons: [], reasons: [] }),
  ),
  error: http.get(apiUrl('/settings/loss-reasons'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/loss-reasons'), async () => {
    await delay('infinite')
    return HttpResponse.json(settings13Data)
  }),
}
