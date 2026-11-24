import { delay, HttpResponse, http } from 'msw'
import { jobs } from '../blocks/application/card/fixtures/card-6.ts'
import { apiUrl } from './api.ts'

const path = '/cards/jobs'

export const card6Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(jobs)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(jobs)
  }),
}
