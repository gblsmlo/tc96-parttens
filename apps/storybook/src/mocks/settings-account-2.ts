import { delay, HttpResponse, http } from 'msw'
import { settingsAccount2Billing } from '../blocks/application/settings/fixtures/settings-account-2.ts'
import { apiUrl } from './api.ts'

export const settingsAccount2Handlers = {
  billing: http.get(apiUrl('/settings/billing'), () =>
    HttpResponse.json(settingsAccount2Billing),
  ),
  billingEmpty: http.get(apiUrl('/settings/billing'), () =>
    HttpResponse.json({ ...settingsAccount2Billing, invoices: [] }),
  ),
  billingError: http.get(apiUrl('/settings/billing'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  billingPending: http.get(apiUrl('/settings/billing'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
