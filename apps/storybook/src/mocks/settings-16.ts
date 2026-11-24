import { delay, HttpResponse, http } from 'msw'
import { settings16CostCenters } from '../blocks/application/settings/fixtures/settings-16.ts'
import { apiUrl } from './api.ts'

export const settings16Handlers = {
  costCenters: http.get(apiUrl('/settings/cost-centers'), () =>
    HttpResponse.json(settings16CostCenters),
  ),
  costCentersEmpty: http.get(apiUrl('/settings/cost-centers'), () =>
    HttpResponse.json([]),
  ),
  costCentersError: http.get(apiUrl('/settings/cost-centers'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  costCentersPending: http.get(apiUrl('/settings/cost-centers'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
