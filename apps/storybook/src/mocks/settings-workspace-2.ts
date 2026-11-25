import { delay, HttpResponse, http } from 'msw'
import { team } from '../blocks/application/settings/fixtures/settings-workspace-2.ts'
import { apiUrl } from './api.ts'

export const settingsWorkspace2Handlers = {
  error: http.get(apiUrl('/settings/members'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/members'), () => HttpResponse.json(team)),
  pending: http.get(apiUrl('/settings/members'), async () => {
    await delay('infinite')
    return HttpResponse.json(team)
  }),
}
