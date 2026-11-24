import { delay, HttpResponse, http } from 'msw'
import { settings12Data } from '../blocks/application/settings/fixtures/settings-12.ts'
import { apiUrl } from './api.ts'

export const settings12Handlers = {
  loaded: http.get(apiUrl('/settings/next-actions'), () =>
    HttpResponse.json(settings12Data),
  ),
  empty: http.get(apiUrl('/settings/next-actions'), () =>
    HttpResponse.json({ ...settings12Data, stages: [] }),
  ),
  error: http.get(apiUrl('/settings/next-actions'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/next-actions'), async () => {
    await delay('infinite')
    return HttpResponse.json(settings12Data)
  }),
}
