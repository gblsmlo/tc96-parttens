import { delay, HttpResponse, http } from 'msw'
import { tasks } from '../blocks/data/projects/fixtures/projects-2.ts'
import { apiUrl } from './api.ts'

const path = '/data/table/tasks'

export const projects2Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(tasks)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(tasks)
  }),
}
