import { delay, HttpResponse, http } from 'msw'
import { settings15Categories } from '../blocks/application/settings/fixtures/settings-15.ts'
import { apiUrl } from './api.ts'

export const settings15Handlers = {
  categories: http.get(apiUrl('/settings/categories'), () =>
    HttpResponse.json(settings15Categories),
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
