import { delay, HttpResponse, http } from 'msw'
import {
  failures,
  runs,
  savedViews,
} from '../blocks/data/legal/fixtures/legal-8.ts'
import { apiUrl } from './api.ts'
import { legalSavedViewsHandlers } from './legal-saved-views.ts'

const runsPath = '/data/legal/monitoring/runs'
const failuresPath = '/data/legal/monitoring/failures'
const sweepPath = '/data/legal/monitoring/sweep'

const occurredAt = (value: string) => new Date(value).getTime()

const failuresOf = (url: URL) => {
  const origin = url.searchParams.get('origin')
  const direction = url.searchParams.get('sort') === 'oldest' ? -1 : 1
  return failures
    .filter((failure) => !origin || failure.origin === origin)
    .sort(
      (a, b) =>
        Number(a.state === 'resolved') - Number(b.state === 'resolved') ||
        direction *
          (occurredAt(b.lastOccurredAt) - occurredAt(a.lastOccurredAt)),
    )
}

const sweep = http.post(apiUrl(sweepPath), () =>
  HttpResponse.json({ id: 'run-813' }),
)

export const legal8Handlers = {
  empty: [
    http.get(apiUrl(runsPath), () => HttpResponse.json([])),
    http.get(apiUrl(failuresPath), () => HttpResponse.json([])),
    sweep,
  ],
  error: [
    http.get(apiUrl(runsPath), () =>
      HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
    ),
    http.get(apiUrl(failuresPath), () =>
      HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
    ),
    sweep,
  ],
  loaded: [
    http.get(apiUrl(runsPath), () => HttpResponse.json(runs)),
    http.get(apiUrl(failuresPath), ({ request }) =>
      HttpResponse.json(failuresOf(new URL(request.url))),
    ),
    sweep,
  ],
  pending: [
    http.get(apiUrl(runsPath), async () => {
      await delay('infinite')
      return HttpResponse.json(runs)
    }),
    http.get(apiUrl(failuresPath), async () => {
      await delay('infinite')
      return HttpResponse.json(failures)
    }),
    sweep,
  ],
  savedViews: () => legalSavedViewsHandlers('monitoring', savedViews),
  sweepFailed: http.post(apiUrl(sweepPath), () =>
    HttpResponse.json({ message: 'Falha ao rodar' }, { status: 503 }),
  ),
}
