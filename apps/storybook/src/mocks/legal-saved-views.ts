import { HttpResponse, http } from 'msw'
import type { LegalSavedViewRecord } from '../blocks/data/legal/fixtures/saved-views.ts'
import { apiUrl } from './api.ts'

export const legalSavedViewsHandlers = <TConfig>(
  collection: string,
  initial: readonly LegalSavedViewRecord<TConfig>[],
) => {
  const path = apiUrl(`/data/legal/saved-views/${collection}`)
  let views = [...initial]
  let created = 0

  return [
    http.get(path, () => HttpResponse.json(views)),
    http.post(path, async ({ request }) => {
      const body = (await request.json()) as Omit<
        LegalSavedViewRecord<TConfig>,
        'id'
      >
      created += 1
      const view = { ...body, id: `${collection}-${created}` }
      views = [...views, view]
      return HttpResponse.json(view, { status: 201 })
    }),
    http.put(`${path}/:id`, async ({ params, request }) => {
      const body = (await request.json()) as LegalSavedViewRecord<TConfig>
      views = views.map((view) => (view.id === params.id ? body : view))
      return HttpResponse.json(body)
    }),
    http.delete(`${path}/:id`, ({ params }) => {
      views = views.filter((view) => view.id !== params.id)
      return new HttpResponse(null, { status: 204 })
    }),
  ]
}
