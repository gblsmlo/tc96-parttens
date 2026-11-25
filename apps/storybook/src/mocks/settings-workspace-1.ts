import { delay, HttpResponse, http } from 'msw'
import { workspace } from '../blocks/application/settings/fixtures/settings-workspace-1.ts'
import { apiUrl } from './api.ts'

export const settingsWorkspace1Handlers = {
  error: http.get(apiUrl('/settings/workspace'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/workspace'), () =>
    HttpResponse.json(workspace),
  ),
  pending: http.get(apiUrl('/settings/workspace'), async () => {
    await delay('infinite')
    return HttpResponse.json(workspace)
  }),
}
