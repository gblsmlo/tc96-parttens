import { delay, HttpResponse, http } from 'msw'
import { sla } from '../blocks/application/settings/fixtures/settings-catalog-2.ts'
import { apiUrl } from './api.ts'

export const settingsCatalog2Handlers = {
  error: http.get(apiUrl('/settings/sla'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/sla'), () => HttpResponse.json(sla)),
  pending: http.get(apiUrl('/settings/sla'), async () => {
    await delay('infinite')
    return HttpResponse.json(sla)
  }),
}
