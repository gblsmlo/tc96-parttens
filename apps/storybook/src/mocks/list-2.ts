import { delay, HttpResponse, http } from 'msw'
import { entriesByRange } from '../blocks/application/list/fixtures/list-2.ts'
import { apiUrl } from './api.ts'

const path = '/list/leaderboard'

export const list2Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), ({ request }) => {
    const range = new URL(request.url).searchParams.get('range') ?? '30d'
    return HttpResponse.json(
      entriesByRange[range as keyof typeof entriesByRange],
    )
  }),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
