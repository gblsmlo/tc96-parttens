import { delay, HttpResponse, http } from 'msw'
import {
  capabilities,
  rolePermissions,
} from '../blocks/application/settings/fixtures/settings-role-permission-1.ts'
import { apiUrl } from './api.ts'

export const settingsRolePermission1Handlers = {
  empty: http.get(apiUrl('/settings/permissions'), () =>
    HttpResponse.json({ ...rolePermissions, capabilities: [] }),
  ),
  error: http.get(apiUrl('/settings/permissions'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl('/settings/permissions'), () =>
    HttpResponse.json(rolePermissions),
  ),
  pending: http.get(apiUrl('/settings/permissions'), async () => {
    await delay('infinite')
    return HttpResponse.json({ ...rolePermissions, capabilities })
  }),
}
