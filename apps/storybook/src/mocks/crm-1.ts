import type { Crm1Contact } from '@tc96/ui/blocks/data/crm/crm-1'
import { delay, HttpResponse, http } from 'msw'
import {
  type Crm1Page,
  companies,
  counts,
  people,
} from '../blocks/data/crm/fixtures/crm-1.ts'
import { apiUrl } from './api.ts'

const path = '/data/crm/contacts'

const emptyPage: Crm1Page<Crm1Contact> = {
  counts: { companies: 0, people: 0 },
  items: [],
  total: 0,
}

const pageOf = (url: URL): Crm1Page<Crm1Contact> => {
  const items: readonly Crm1Contact[] =
    url.searchParams.get('variant') === 'companies' ? companies : people
  const search = (url.searchParams.get('q') ?? '').toLowerCase()
  const archived = url.searchParams.get('archived') ?? 'exclude'
  const sort = url.searchParams.get('sort') ?? 'name_asc'
  const tagIds = url.searchParams.getAll('tagId')
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 20)
  const matching = items
    .filter(
      (item) =>
        (archived === 'include' || item.archived === (archived === 'only')) &&
        (!search || item.name.toLowerCase().includes(search)) &&
        (tagIds.length === 0 || item.tagIds.some((id) => tagIds.includes(id))),
    )
    .sort((a, b) => {
      if (sort === 'created_desc') return b.id.localeCompare(a.id)
      const order = a.name.localeCompare(b.name, 'pt-BR')
      return sort === 'name_desc' ? -order : order
    })
  return {
    counts,
    items: matching.slice((page - 1) * limit, page * limit),
    total: matching.length,
  }
}

export const crm1Handlers = {
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
