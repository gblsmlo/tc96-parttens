import { delay, HttpResponse, http } from 'msw'
import {
  settings20Categories,
  settings20Channels,
  settings20Matrix,
} from '../blocks/application/settings/fixtures/settings-20.ts'
import { apiUrl } from './api.ts'

const path = '/settings/notification-channels'

const payload = {
  categories: settings20Categories,
  channels: settings20Channels,
  matrix: settings20Matrix,
}

export const settings20Handlers = {
  notifications: http.get(apiUrl(path), () => HttpResponse.json(payload)),
  notificationsEmpty: http.get(apiUrl(path), () =>
    HttpResponse.json({ ...payload, categories: [] }),
  ),
  notificationsError: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  notificationsPending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(payload)
  }),
}
