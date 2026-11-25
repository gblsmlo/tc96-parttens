import { delay, HttpResponse, http } from 'msw'
import { members } from '../blocks/data/team/fixtures/team-1.ts'
import { apiUrl } from './api.ts'

const path = '/data/members'

export const team1Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json([])),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), () => HttpResponse.json(members)),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(members)
  }),
}
