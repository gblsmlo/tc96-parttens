import { delay, HttpResponse, http } from 'msw'
import { salesAndChurn } from '../blocks/application/stats/fixtures/stats-5.ts'
import { apiUrl } from './api.ts'

export const stats5Handlers = {
  error: http.get(apiUrl('/stats/sales-churn'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/stats/sales-churn'), () =>
    HttpResponse.json(salesAndChurn),
  ),
  pending: http.get(apiUrl('/stats/sales-churn'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
