import { legal6Sorts, legal6Views } from '@tc96/ui/blocks/data/legal/legal-6'
import { delay, HttpResponse, http } from 'msw'
import {
  deadlines,
  type Legal6QueuePage,
  readDeadlineQueue,
  savedViews,
} from '../blocks/data/legal/fixtures/legal-6.ts'
import { apiUrl } from './api.ts'
import { legalSavedViewsHandlers } from './legal-saved-views.ts'

const path = '/data/legal/deadline-queue'

const emptyPage: Legal6QueuePage = { counts: {}, items: [], nextCursor: null }

const failure = () =>
  HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 })

const pageOf = (request: Request) => {
  const params = new URL(request.url).searchParams
  return readDeadlineQueue(deadlines, {
    cursor: Number(params.get('cursor') ?? 0),
    kindId: params.get('kind'),
    ownerId: params.get('owner'),
    sort: legal6Sorts.find((sort) => sort === params.get('sort')),
    view: legal6Views.find((view) => view === params.get('view')) ?? 'mine',
  })
}

export const legal6Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json(emptyPage)),
  error: http.get(apiUrl(path), failure),
  loaded: http.get(apiUrl(path), ({ request }) =>
    HttpResponse.json(pageOf(request)),
  ),
  moreFailed: http.get(apiUrl(path), ({ request }) =>
    new URL(request.url).searchParams.has('cursor')
      ? failure()
      : HttpResponse.json(pageOf(request)),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(emptyPage)
  }),
  savedViews: () => legalSavedViewsHandlers('deadline-queue', savedViews),
}
