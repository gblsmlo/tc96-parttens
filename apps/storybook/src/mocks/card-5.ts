import { delay, HttpResponse, http } from 'msw'
import { shortcutRecords } from '../blocks/application/card/fixtures/card-5.ts'
import { apiUrl } from './api.ts'

const path = '/cards/shortcuts'

export const card5Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(shortcutRecords)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(shortcutRecords)
  }),
}
