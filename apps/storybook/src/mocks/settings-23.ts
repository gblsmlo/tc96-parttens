import { delay, HttpResponse, http } from 'msw'
import { settings23Billing } from '../blocks/application/settings/fixtures/settings-23.ts'
import { apiUrl } from './api.ts'

export const settings23Handlers = {
  billing: http.get(apiUrl('/settings/billing'), () =>
    HttpResponse.json(settings23Billing),
  ),
  billingEmpty: http.get(apiUrl('/settings/billing'), () =>
    HttpResponse.json({ ...settings23Billing, invoices: [] }),
  ),
  billingError: http.get(apiUrl('/settings/billing'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  billingPending: http.get(apiUrl('/settings/billing'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
