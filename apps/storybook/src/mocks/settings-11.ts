import { delay, HttpResponse, http } from 'msw'
import { settings11Wire } from '../blocks/application/settings/fixtures/settings-11.ts'
import { apiUrl } from './api.ts'

export const settings11Handlers = {
  loaded: http.get(apiUrl('/settings/statuses'), () =>
    HttpResponse.json(settings11Wire),
  ),
  error: http.get(apiUrl('/settings/statuses'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  pending: http.get(apiUrl('/settings/statuses'), async () => {
    await delay('infinite')
    return HttpResponse.json(settings11Wire)
  }),
}
