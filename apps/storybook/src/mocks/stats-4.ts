import { delay, HttpResponse, http } from 'msw'
import {
  type LeadsOverview,
  leadsOverviewByRange,
} from '../blocks/application/stats/fixtures/stats-4.ts'
import { apiUrl } from './api.ts'

export const stats4Handlers = {
  error: http.get(apiUrl('/stats/leads'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/stats/leads'), ({ request }) => {
    const range = new URL(request.url).searchParams.get('range') ?? '30d'
    const data: LeadsOverview =
      leadsOverviewByRange[range as keyof typeof leadsOverviewByRange]
    return HttpResponse.json(data)
  }),
  pending: http.get(apiUrl('/stats/leads'), async () => {
    await delay('infinite')
    return HttpResponse.json({})
  }),
}
