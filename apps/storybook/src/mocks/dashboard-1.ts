import { delay, HttpResponse, http } from 'msw'
import {
  capacity,
  exceptions,
  kpis,
  reasons,
} from '../blocks/application/dashboard/fixtures/dashboard-1.ts'
import { apiUrl } from './api.ts'

const path = '/dashboard/fulfillment'

export const dashboard1Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json({ capacity: [], exceptions: [], kpis: [], reasons: [] }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () =>
    HttpResponse.json({ capacity, exceptions, kpis, reasons }),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json({
      capacity: [],
      exceptions: [],
      kpis: [],
      reasons: [],
    })
  }),
}
