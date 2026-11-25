import { delay, HttpResponse, http } from 'msw'
import {
  type Tasks1Page,
  tasks,
} from '../blocks/data/tasks/fixtures/tasks-1.ts'
import { apiUrl } from './api.ts'

const path = '/data/tasks'

const emptyPage: Tasks1Page = { items: [], total: 0 }

const pageOf = (url: URL): Tasks1Page => {
  const search = (url.searchParams.get('q') ?? '').toLowerCase()
  const status = url.searchParams.get('status')
  const priority = url.searchParams.get('priority')
  const projectId = url.searchParams.get('projectId')
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 20)
  const matching = tasks.filter(
    (task) =>
      (!search || task.title.toLowerCase().includes(search)) &&
      (!status || task.status === status) &&
      (!priority || task.priority === priority) &&
      (!projectId || task.projectId === projectId),
  )
  return {
    items: matching.slice((page - 1) * limit, page * limit),
    total: matching.length,
  }
}

export const tasks1Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json(emptyPage)),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), ({ request }) =>
    HttpResponse.json(pageOf(new URL(request.url))),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(emptyPage)
  }),
}
