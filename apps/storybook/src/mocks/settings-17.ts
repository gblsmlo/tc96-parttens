import { delay, HttpResponse, http } from 'msw'
import { privacyControls } from '../blocks/application/settings/fixtures/settings-17.ts'
import { apiUrl } from './api.ts'

export const settings17Handlers = {
  error: http.get(apiUrl('/settings/privacy'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/privacy'), () =>
    HttpResponse.json(privacyControls),
  ),
  pending: http.get(apiUrl('/settings/privacy'), async () => {
    await delay('infinite')
    return HttpResponse.json(privacyControls)
  }),
}
