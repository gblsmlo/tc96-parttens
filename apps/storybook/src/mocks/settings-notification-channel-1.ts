import { delay, HttpResponse, http } from 'msw'
import {
  settingsNotificationChannel1Categories,
  settingsNotificationChannel1Channels,
  settingsNotificationChannel1Matrix,
} from '../blocks/application/settings/fixtures/settings-notification-channel-1.ts'
import { apiUrl } from './api.ts'

const path = '/settings/notification-channels'

const payload = {
  categories: settingsNotificationChannel1Categories,
  channels: settingsNotificationChannel1Channels,
  matrix: settingsNotificationChannel1Matrix,
}

export const settingsNotificationChannel1Handlers = {
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
