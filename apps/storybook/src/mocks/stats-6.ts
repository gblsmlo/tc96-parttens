import { delay, HttpResponse, http } from 'msw'
import { sleevesByPeriod } from '../blocks/application/stats/fixtures/stats-6.ts'
import { apiUrl } from './api.ts'

export const stats6Handlers = {
  error: http.get(apiUrl('/stats/portfolio'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/stats/portfolio'), ({ request }) => {
    const period = new URL(request.url).searchParams.get('period') ?? 'month'
    return HttpResponse.json(
      sleevesByPeriod[period as keyof typeof sleevesByPeriod],
    )
  }),
  pending: http.get(apiUrl('/stats/portfolio'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
