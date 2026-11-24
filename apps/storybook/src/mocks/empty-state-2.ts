import { delay, HttpResponse, http } from 'msw'
import { suggestionsByQuery } from '../blocks/application/empty-state/fixtures/empty-state-2.ts'
import { apiUrl } from './api.ts'

const path = '/empty-state/suggestions'

export const emptyState2Handlers = {
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), ({ request }) => {
    const query = new URL(request.url).searchParams.get('query') ?? ''
    return HttpResponse.json(suggestionsByQuery[query] ?? [])
  }),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
