import { delay, HttpResponse, http } from 'msw'
import {
  metrics,
  modules,
  team,
} from '../blocks/application/dashboard/fixtures/dashboard-4.ts'
import { apiUrl } from './api.ts'

const path = '/dashboard/module-tracker'

export const dashboard4Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json({ metrics: [], modules: [], team }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () =>
    HttpResponse.json({ metrics, modules, team }),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json({ metrics: [], modules: [], team: [] })
  }),
}
