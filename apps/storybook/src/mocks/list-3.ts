import { delay, HttpResponse, http } from 'msw'
import { transactionsByPeriod } from '../blocks/application/list/fixtures/list-3.ts'
import { apiUrl } from './api.ts'

const path = '/list/transactions'

export const list3Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), ({ request }) => {
    const period = new URL(request.url).searchParams.get('period') ?? 'month'
    return HttpResponse.json(
      transactionsByPeriod[period as keyof typeof transactionsByPeriod],
    )
  }),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
