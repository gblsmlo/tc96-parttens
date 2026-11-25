import {
  type Documents1Record,
  documents1Sorts,
  documents1Types,
  documents1Views,
} from '@tc96/ui/blocks/data/documents/documents-1'
import { delay, HttpResponse, http } from 'msw'
import {
  countDocuments,
  type Documents1Page,
  queryDocuments,
  records,
} from '../blocks/data/documents/fixtures/documents-1.ts'
import { apiUrl } from './api.ts'

const libraryPath = '/data/documents/library'
const uploadsPath = '/data/documents/uploads'

export interface Documents1UploadBody {
  contentType: string
  name: string
  size: string
}

const emptyPage: Documents1Page = {
  counts: countDocuments([]),
  items: [],
  total: 0,
}

const pick = <TValue extends string>(
  values: readonly TValue[],
  value: string | null,
): TValue | null => values.find((item) => item === value) ?? null

const pageOf = (url: URL): Documents1Page => {
  const params = url.searchParams
  const page = Number(params.get('page') ?? 1)
  const limit = Number(params.get('limit') ?? 25)
  const matching = queryDocuments(records, {
    search: params.get('q') ?? '',
    sort: pick(documents1Sorts, params.get('sort')),
    typeFilter: params
      .getAll('type')
      .flatMap((type) => pick(documents1Types, type) ?? []),
    view: pick(documents1Views, params.get('view')) ?? 'all',
  })
  return {
    counts: countDocuments(records),
    items: matching.slice((page - 1) * limit, page * limit),
    total: matching.length,
  }
}

const uploaded = async (request: Request): Promise<Documents1Record> => {
  const body = (await request.json()) as Documents1UploadBody
  return {
    access: 'private',
    contentType: body.contentType,
    createdAt: '2026-11-25T10:00:00.000Z',
    createdById: 'beatriz',
    id: `doc-${body.name}`,
    kind: 'file',
    linkedTo: null,
    name: body.name,
    pinned: false,
    size: body.size,
  }
}

export const documents1Handlers = {
  empty: http.get(apiUrl(libraryPath), () => HttpResponse.json(emptyPage)),
  error: http.get(apiUrl(libraryPath), () =>
    HttpResponse.json({ message: 'Falha ao carregar' }, { status: 500 }),
  ),
  loaded: http.get(apiUrl(libraryPath), ({ request }) =>
    HttpResponse.json(pageOf(new URL(request.url))),
  ),
  pending: http.get(apiUrl(libraryPath), async () => {
    await delay('infinite')
    return HttpResponse.json(emptyPage)
  }),
  uploadFails: http.post(apiUrl(uploadsPath), async () => {
    await delay(600)
    return HttpResponse.json(
      { message: 'O arquivo não cabe no seu espaço de armazenamento.' },
      { status: 507 },
    )
  }),
  uploadSucceeds: http.post(apiUrl(uploadsPath), async ({ request }) => {
    await delay(900)
    return HttpResponse.json(await uploaded(request))
  }),
}
