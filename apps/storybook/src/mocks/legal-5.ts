import { delay, HttpResponse, http } from 'msw'
import {
  counts,
  type Legal5Page,
  records,
  savedViews,
} from '../blocks/data/legal/fixtures/legal-5.ts'
import { apiUrl } from './api.ts'
import { legalSavedViewsHandlers } from './legal-saved-views.ts'

const path = '/data/legal/legal-records'

const emptyPage: Legal5Page = {
  counts: { all: 0, lawsuit: 0, matter: 0 },
  items: [],
  total: 0,
}

const pageOf = (url: URL): Legal5Page => {
  const view = url.searchParams.get('view') ?? 'all'
  const search = (url.searchParams.get('q') ?? '').toLowerCase()
  const ownerId = url.searchParams.get('ownerId')
  const phaseIds = url.searchParams.getAll('phaseId')
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 25)
  const matching = records.filter(
    (item) =>
      (view === 'all' || item.kind === view) &&
      (!search || item.title.toLowerCase().includes(search)) &&
      (!ownerId || item.ownerId === ownerId) &&
      (phaseIds.length === 0 || phaseIds.includes(item.phaseId)),
  )
  return {
    counts,
    items: matching.slice((page - 1) * limit, page * limit),
    total: matching.length,
  }
}

export const legal5Handlers = {
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
  savedViews: () => legalSavedViewsHandlers('legal-records', savedViews),
}
