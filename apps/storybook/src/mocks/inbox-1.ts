import {
  inbox1Categories,
  inbox1Kinds,
  inbox1Sorts,
} from '@tc96/ui/blocks/data/inbox/inbox-1'
import { delay, HttpResponse, http } from 'msw'
import {
  entries,
  type Inbox1Page,
  readInbox,
} from '../blocks/data/inbox/fixtures/inbox-1.ts'
import { apiUrl } from './api.ts'

const entriesPath = '/data/inbox/entries'
const marksPath = '/data/inbox/marks'

const emptyPage: Inbox1Page = { items: [], nextCursor: null }

const failure = () =>
  HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 })

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string | null,
): TValue | null => values.find((item) => item === value) ?? null

const pageOf = (request: Request) => {
  const params = new URL(request.url).searchParams
  return readInbox(entries, {
    category: pick(inbox1Categories, params.get('category')),
    cursor: Number(params.get('cursor') ?? 0),
    kind: pick(inbox1Kinds, params.get('kind')),
    read: pick(['read', 'unread'] as const, params.get('read')),
    received: pick(
      ['today', 'last7', 'last30'] as const,
      params.get('received'),
    ),
    sort: pick(inbox1Sorts, params.get('sort')) ?? 'newest',
  })
}

const marked = http.post(apiUrl(marksPath), () =>
  HttpResponse.json({ ok: true }),
)

const loaded = http.get(apiUrl(entriesPath), ({ request }) =>
  HttpResponse.json(pageOf(request)),
)

export const inbox1Handlers = {
  empty: [
    http.get(apiUrl(entriesPath), () => HttpResponse.json(emptyPage)),
    marked,
  ],
  error: [http.get(apiUrl(entriesPath), failure), marked],
  loaded: [loaded, marked],
  markFailed: [
    loaded,
    http.post(apiUrl(marksPath), () =>
      HttpResponse.json({ message: 'Falha ao marcar' }, { status: 503 }),
    ),
  ],
  moreFailed: [
    http.get(apiUrl(entriesPath), ({ request }) =>
      new URL(request.url).searchParams.has('cursor')
        ? failure()
        : HttpResponse.json(pageOf(request)),
    ),
    marked,
  ],
  pending: [
    http.get(apiUrl(entriesPath), async () => {
      await delay('infinite')
      return HttpResponse.json(emptyPage)
    }),
    marked,
  ],
}
