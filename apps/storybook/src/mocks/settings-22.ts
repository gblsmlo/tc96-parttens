import { delay, HttpResponse, http } from 'msw'
import { settings22Keys } from '../blocks/application/settings/fixtures/settings-22.ts'
import { apiUrl } from './api.ts'

export const settings22Handlers = {
  keys: http.get(apiUrl('/settings/api-keys'), () =>
    HttpResponse.json(settings22Keys),
  ),
  keysEmpty: http.get(apiUrl('/settings/api-keys'), () =>
    HttpResponse.json([]),
  ),
  keysError: http.get(apiUrl('/settings/api-keys'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  keysPending: http.get(apiUrl('/settings/api-keys'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
