import { delay, HttpResponse, http } from 'msw'
import { notifications } from '../blocks/application/navbar/fixtures/navbar-3.ts'
import { apiUrl } from './api.ts'

const path = '/navbar/notifications'

export const navbar3Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(notifications)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(notifications)
  }),
}
