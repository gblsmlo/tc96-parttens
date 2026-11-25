import { delay, HttpResponse, http } from 'msw'
import {
  lossReasons,
  stages,
  summary,
} from '../blocks/application/dashboard/fixtures/dashboard-6.ts'
import { apiUrl } from './api.ts'

const path = '/dashboard/crm-summary'

export const dashboard6Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json({ lossReasons: [], stages: [], summary: null }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () =>
    HttpResponse.json({ lossReasons, stages, summary }),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json({ lossReasons: [], stages: [], summary: null })
  }),
}
