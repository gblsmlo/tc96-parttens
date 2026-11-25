import { delay, HttpResponse, http } from 'msw'
import {
  type Legal9Page,
  records,
} from '../blocks/data/legal/fixtures/legal-9.ts'
import { apiUrl } from './api.ts'

const path = '/data/legal/fee-contracts'

const emptyPage: Legal9Page = { items: [], total: 0 }

const pageOf = (url: URL): Legal9Page => {
  const status = url.searchParams.get('status')
  const billingModel = url.searchParams.get('billingModel')
  const ownerId = url.searchParams.get('ownerId')
  const sort = url.searchParams.get('sort') ?? 'updated'
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 25)
  const matching = records
    .filter(
      (item) =>
        (!status || item.status === status) &&
        (!billingModel || item.billingModel === billingModel) &&
        (!ownerId || item.ownerId === ownerId),
    )
    .sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title, 'pt-BR')
      if (sort === 'amount')
        return (b.amountCents ?? -1) - (a.amountCents ?? -1)
      return 0
    })
  return {
    items: matching.slice((page - 1) * limit, page * limit),
    total: matching.length,
  }
}

export const legal9Handlers = {
  empty: http.get(apiUrl(path), () => HttpResponse.json(emptyPage)),
  error: http.get(apiUrl(path), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(path), ({ request }) =>
    HttpResponse.json(pageOf(new URL(request.url))),
  ),
  pending: http.get(apiUrl(path), async () => {
    await delay('infinite')
    return HttpResponse.json(emptyPage)
  }),
}
