import { delay, HttpResponse, http } from 'msw'
import { settingsCatalog9Categories } from '../blocks/application/settings/fixtures/settings-catalog-9.ts'
import { apiUrl } from './api.ts'

export const settingsCatalog9Handlers = {
  categories: http.get(apiUrl('/settings/categories'), () =>
    HttpResponse.json(settingsCatalog9Categories),
  ),
  categoriesEmpty: http.get(apiUrl('/settings/categories'), () =>
    HttpResponse.json([]),
  ),
  categoriesError: http.get(apiUrl('/settings/categories'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  categoriesPending: http.get(apiUrl('/settings/categories'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
