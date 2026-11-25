import type { Crm2Lead } from '@tc96/ui/blocks/data/crm/crm-2'
import { delay, HttpResponse, http } from 'msw'
import {
  type Crm2Board,
  type Crm2Page,
  isOnTheBoard,
  leads,
  stageValuesOf,
} from '../blocks/data/crm/fixtures/crm-2.ts'
import { apiUrl } from './api.ts'

const pagePath = '/data/crm/leads'
const boardPath = '/data/crm/leads/board'

const emptyPage: Crm2Page = { items: [], total: 0 }
const emptyBoard: Crm2Board = { hasMore: false, leads: [], stageValues: {} }

const matches = (url: URL) => {
  const search = (url.searchParams.get('q') ?? '').toLowerCase()
  const stageId = url.searchParams.get('stageId')
  const ownerId = url.searchParams.get('ownerId')
  const origin = url.searchParams.get('origin')
  const tagIds = url.searchParams.getAll('tagId')
  return (lead: Crm2Lead) =>
    (!search || lead.title.toLowerCase().includes(search)) &&
    (!stageId || lead.stageId === stageId) &&
    (!ownerId || lead.ownerId === ownerId) &&
    (!origin || lead.origin === origin) &&
    (tagIds.length === 0 || lead.tagIds.some((id) => tagIds.includes(id)))
}

const byArchive = (archived: string | null) => (lead: Crm2Lead) => {
  if (archived === 'only') return lead.archived
  if (archived === 'include') return true
  return !lead.archived
}

const pageOf = (url: URL): Crm2Page => {
  const page = Number(url.searchParams.get('page') ?? 1)
  const limit = Number(url.searchParams.get('limit') ?? 25)
  const matching = leads
    .filter(matches(url))
    .filter(byArchive(url.searchParams.get('archived')))
  return {
    items: matching.slice((page - 1) * limit, page * limit),
    total: matching.length,
  }
}

const boardOf = (url: URL): Crm2Board => {
  const open = leads.filter(isOnTheBoard).filter(matches(url))
  return { hasMore: false, leads: open, stageValues: stageValuesOf(open) }
}

const failed = () =>
  HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 })

export const crm2Handlers = {
  empty: [
    http.get(apiUrl(boardPath), () => HttpResponse.json(emptyBoard)),
    http.get(apiUrl(pagePath), () => HttpResponse.json(emptyPage)),
  ],
  error: [
    http.get(apiUrl(boardPath), failed),
    http.get(apiUrl(pagePath), failed),
  ],
  loaded: [
    http.get(apiUrl(boardPath), ({ request }) =>
      HttpResponse.json(boardOf(new URL(request.url))),
    ),
    http.get(apiUrl(pagePath), ({ request }) =>
      HttpResponse.json(pageOf(new URL(request.url))),
    ),
  ],
  pending: [
    http.get(apiUrl(boardPath), async () => {
      await delay('infinite')
      return HttpResponse.json(emptyBoard)
    }),
    http.get(apiUrl(pagePath), async () => {
      await delay('infinite')
      return HttpResponse.json(emptyPage)
    }),
  ],
}
