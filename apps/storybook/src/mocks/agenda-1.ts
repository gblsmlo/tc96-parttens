import type { Agenda1Entry } from '@tc96/ui/blocks/data/agenda/agenda-1'
import { delay, HttpResponse, http } from 'msw'
import {
  entries,
  entriesBetween,
} from '../blocks/data/agenda/fixtures/agenda-1.ts'
import { apiUrl } from './api.ts'

export interface Agenda1WindowPage {
  items: Agenda1Entry[]
}

const path = '/data/agenda/entries'

const windowOf = (url: URL): Agenda1WindowPage => {
  const from = url.searchParams.get('from') ?? ''
  const to = url.searchParams.get('to') ?? ''
  const kinds = url.searchParams.getAll('kind')
  const ownerId = url.searchParams.get('ownerId')
  return {
    items: entriesBetween(entries, from, to).filter(
      (entry) =>
        (kinds.length === 0 || kinds.includes(entry.kind)) &&
        (!ownerId || entry.ownerId === ownerId),
    ),
  }
}

export const agenda1Handlers = {
  empty: http.get(apiUrl(path), () =>
    HttpResponse.json<Agenda1WindowPage>({ items: [] }),
  ),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), ({ request }) =>
    HttpResponse.json(windowOf(new URL(request.url))),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json<Agenda1WindowPage>({ items: [] })
  }),
}
