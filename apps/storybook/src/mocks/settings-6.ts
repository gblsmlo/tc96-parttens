import { delay, HttpResponse, http } from 'msw'
import { team } from '../blocks/application/settings/fixtures/settings-6.ts'
import { apiUrl } from './api.ts'

export const settings6Handlers = {
  error: http.get(apiUrl('/settings/members'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/members'), () => HttpResponse.json(team)),
  pending: http.get(apiUrl('/settings/members'), async () => {
    await delay('infinite')
    return HttpResponse.json(team)
  }),
}
