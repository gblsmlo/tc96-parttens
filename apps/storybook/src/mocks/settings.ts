import { delay, HttpResponse, http } from 'msw'
import { tags } from '../blocks/application/settings/fixtures/tags.ts'
import { apiUrl } from './api.ts'

export type WorkspaceMember = {
  id: string
  name: string
  email: string
  role: string
}

export const workspaceMembers: WorkspaceMember[] = [
  {
    id: 'm1',
    name: 'Ana Ribeiro',
    email: 'ana@acme.com',
    role: 'Administradora',
  },
  { id: 'm2', name: 'Bruno Costa', email: 'bruno@acme.com', role: 'Editor' },
  { id: 'm3', name: 'Carla Mendes', email: 'carla@acme.com', role: 'Leitora' },
]

export const settingsHandlers = {
  members: http.get(apiUrl('/settings/members'), () =>
    HttpResponse.json(workspaceMembers),
  ),
  membersEmpty: http.get(apiUrl('/settings/members'), () =>
    HttpResponse.json([]),
  ),
  membersError: http.get(apiUrl('/settings/members'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  membersPending: http.get(apiUrl('/settings/members'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
  tags: http.get(apiUrl('/settings/tags'), () => HttpResponse.json(tags)),
  tagsEmpty: http.get(apiUrl('/settings/tags'), () => HttpResponse.json([])),
  tagsError: http.get(apiUrl('/settings/tags'), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  tagsPending: http.get(apiUrl('/settings/tags'), async () => {
    await delay('infinite')
    return HttpResponse.json([])
  }),
}
