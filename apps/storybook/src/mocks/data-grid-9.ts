import { delay, HttpResponse, http } from 'msw'
import {
  campaigns,
  summary,
} from '../blocks/data/data-grid/fixtures/data-grid-9.ts'
import { apiUrl } from './api.ts'

const path = '/data/campaigns'

export const dataGrid9Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json({ campaigns: [], summary }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () =>
    HttpResponse.json({ campaigns, summary }),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json({ campaigns, summary })
  }),
}
