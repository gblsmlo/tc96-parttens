import { delay, HttpResponse, http } from 'msw'
import {
  type Projects3Page,
  tasks,
} from '../blocks/data/projects/fixtures/projects-3.ts'
import { apiUrl } from './api.ts'

const path = '/data/projects/tasks'

const emptyPage: Projects3Page = { items: [], total: 0 }

const pageOf = (url: URL): Projects3Page => {
  const search = (url.searchParams.get('q') ?? '').toLowerCase()
  const status = url.searchParams.get('status')
  const assigneeId = url.searchParams.get('assigneeId')
  const archived = url.searchParams.get('archived')
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 20)
  const matching = tasks.filter(
    (task) =>
      (!search || task.title.toLowerCase().includes(search)) &&
      (!status || task.status === status) &&
      (!assigneeId || task.assigneeId === assigneeId) &&
      (archived === 'only'
        ? task.archived
        : archived === 'include' || !task.archived),
  )
  return {
    items: matching.slice((page - 1) * limit, page * limit),
    total: matching.length,
  }
}

export const projects3Handlers = {
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
