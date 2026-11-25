import { delay, HttpResponse, http } from 'msw'
import {
  type PublicationQueuePage,
  publications,
  queryPublications,
  savedViews,
  tribunals,
} from '../blocks/data/legal/fixtures/legal-7.ts'
import { apiUrl } from './api.ts'
import { legalSavedViewsHandlers } from './legal-saved-views.ts'

const path = '/data/legal/publications'

const emptyPage: PublicationQueuePage = { items: [], total: 0, tribunals }

const pageOf = (request: Request) => {
  const params = new URL(request.url).searchParams
  const lawsuit = params.get('lawsuit')
  return queryPublications(publications, {
    lawsuit: lawsuit === 'linked' || lawsuit === 'unlinked' ? lawsuit : null,
    page: Number(params.get('page') ?? 1),
    sort: params.get('sort') === 'newest' ? 'newest' : 'oldest',
    tribunal: params.get('tribunal'),
  })
}

export const legal7Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json(emptyPage)),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), ({ request }) =>
    HttpResponse.json(pageOf(request)),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(emptyPage)
  }),
  savedViews: () => legalSavedViewsHandlers('publications', savedViews),
}
