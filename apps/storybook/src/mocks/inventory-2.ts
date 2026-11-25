import { delay, HttpResponse, http } from 'msw'
import { products } from '../blocks/data/inventory/fixtures/inventory-2.ts'
import { apiUrl } from './api.ts'

const path = '/data/table/products'

export const inventory2Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(products)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(products)
  }),
  save: http.patch(apiUrl(path), async () => {
    await delay(300)
    return HttpResponse.json({ ok: true })
  }),
}
