import { delay, HttpResponse, http } from 'msw'
import {
  appointments,
  deadlines,
  dueDays,
  metrics,
  publications,
  queues,
} from '../blocks/application/dashboard/fixtures/dashboard-5.ts'
import { apiUrl } from './api.ts'

const path = '/dashboard/legal-pending'

const emptyBody = {
  appointments: [],
  deadlines: [],
  dueDays: [],
  metrics: {},
  publications: [],
  queues: [],
}

export const dashboard5Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json(emptyBody)),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () =>
    HttpResponse.json({
      appointments,
      deadlines,
      dueDays,
      metrics,
      publications,
      queues,
    }),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(emptyBody)
  }),
}
