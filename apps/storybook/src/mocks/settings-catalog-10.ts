import { delay, HttpResponse, http } from 'msw'
import { settingsCatalog10CostCenters } from '../blocks/application/settings/fixtures/settings-catalog-10.ts'
import { apiUrl } from './api.ts'

export const settingsCatalog10Handlers = {
  costCenters: http.get(apiUrl('/settings/cost-centers'), () =>
    HttpResponse.json(settingsCatalog10CostCenters),
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
