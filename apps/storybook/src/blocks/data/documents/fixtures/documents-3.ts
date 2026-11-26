import {
  type Documents3Person,
  type Documents3Record,
  type Documents3Sort,
  type Documents3Type,
  type Documents3TypeColors,
  type Documents3View,
  documents3TypeOf,
  documents3Views,
  documents3ViewTypes,
} from '@tc96/ui/blocks/data/documents/documents-3'

export const people: Documents3Person[] = [
  { id: 'beatriz', label: 'Beatriz Nogueira' },
  { id: 'rafael', label: 'Rafael Antunes' },
  { id: 'camila', label: 'Camila Duarte' },
  { id: 'thiago', label: 'Thiago Freitas' },
]

export const typeColors: Documents3TypeColors = {
  audio: '#0891b2',
  document: '#2563eb',
  image: '#db2777',
  link: '#059669',
  note: '#d97706',
  video: '#7c3aed',
}

export const records: Documents3Record[] = [
  {
    access: 'shared',
    createdAt: '2026-11-24T14:20:00.000Z',
    createdById: 'beatriz',
    excerpt: 'Pontos para a reunião com o cliente na quinta.',
    id: 'note-301',
    kind: 'note',
    linkedTo: null,
    name: 'Pauta da reunião com a Moinho Santa Clara',
    pinned: true,
  },
  {
    access: 'public',
    contentType: 'application/pdf',
    createdAt: '2026-11-24T11:05:00.000Z',
    createdById: 'rafael',
    id: 'doc-201',
    kind: 'file',
    linkedTo: 'Ação de cobrança contra fornecedor de farinha',
    name: 'Contrato de fornecimento assinado.pdf',
    pinned: true,
    size: '2,4 MB',
  },
  {
    access: 'private',
    createdAt: '2026-11-23T18:40:00.000Z',
    createdById: 'camila',
    excerpt: 'Modelo com as cláusulas de reajuste e rescisão.',
    id: 'doc-202',
    kind: 'page',
    linkedTo: null,
    name: 'Minuta de aditivo contratual',
    pinned: false,
  },
  {
    access: 'public',
    createdAt: '2026-11-23T13:15:00.000Z',
    createdById: 'thiago',
    id: 'doc-203',
    kind: 'link',
    linkedTo: null,
    name: 'Consulta processual do TJSP',
    pinned: false,
    site: 'esaj.tjsp.jus.br',
    url: 'https://esaj.tjsp.jus.br/cpopg/open.do',
  },
  {
    access: 'shared',
    contentType: 'image/jpeg',
    createdAt: '2026-11-22T16:30:00.000Z',
    createdById: 'beatriz',
    id: 'doc-204',
    kind: 'file',
    linkedTo: 'Vistoria do imóvel da Rua Augusta',
    name: 'Foto da fachada do imóvel.jpg',
    pinned: false,
    size: '3,1 MB',
  },
  {
    access: 'private',
    contentType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    createdAt: '2026-11-21T19:10:00.000Z',
    createdById: 'rafael',
    id: 'doc-205',
    kind: 'file',
    linkedTo: 'Reclamação trabalhista de ex-motorista',
    name: 'Procuração ad judicia.docx',
    pinned: false,
    size: '86 KB',
  },
  {
    access: 'private',
    createdAt: '2026-11-21T12:00:00.000Z',
    createdById: 'camila',
    excerpt: 'Lembrar de pedir as guias de recolhimento ao cliente.',
    id: 'note-302',
    kind: 'note',
    linkedTo: 'Reclamação trabalhista de ex-motorista',
    name: 'Pendências da audiência',
    pinned: false,
  },
  {
    access: 'public',
    contentType: 'video/mp4',
    createdAt: '2026-11-20T15:45:00.000Z',
    createdById: 'thiago',
    id: 'doc-206',
    kind: 'file',
    linkedTo: null,
    name: 'Treinamento do novo sistema.mp4',
    pinned: false,
    size: '148 MB',
  },
  {
    access: 'shared',
    createdAt: '2026-11-19T17:25:00.000Z',
    createdById: 'beatriz',
    id: 'doc-207',
    kind: 'link',
    linkedTo: 'Revisão de contrato de locação comercial',
    name: 'Índice IGP-M acumulado',
    pinned: false,
    site: 'portalibre.fgv.br',
    url: 'https://portalibre.fgv.br/igp',
  },
  {
    access: 'private',
    contentType: 'audio/mpeg',
    createdAt: '2026-11-18T10:20:00.000Z',
    createdById: 'rafael',
    id: 'doc-208',
    kind: 'file',
    linkedTo: 'Ação de cobrança contra fornecedor de farinha',
    name: 'Gravação do depoimento.mp3',
    pinned: false,
    size: '24 MB',
  },
  {
    access: 'public',
    createdAt: '2026-11-17T14:00:00.000Z',
    createdById: 'camila',
    excerpt: 'Passo a passo para protocolar petições no PJe.',
    id: 'doc-209',
    kind: 'page',
    linkedTo: null,
    name: 'Manual de protocolo eletrônico',
    pinned: false,
  },
  {
    access: 'private',
    canDelete: false,
    canEdit: false,
    contentType: 'application/pdf',
    createdAt: '2026-11-16T09:30:00.000Z',
    createdById: 'thiago',
    id: 'doc-210',
    kind: 'file',
    linkedTo: 'Inventário de Lúcia Meireles',
    name: 'Certidão de óbito.pdf',
    pinned: false,
    size: '412 KB',
  },
]

export const uploads: Documents3Record[] = [
  {
    access: 'private',
    contentType: 'application/pdf',
    createdAt: '2026-11-25T10:00:00.000Z',
    createdById: 'beatriz',
    id: 'upload-1',
    kind: 'file',
    linkedTo: null,
    name: 'Laudo pericial.pdf',
    pinned: false,
    size: '5,8 MB',
    upload: { progress: 45, status: 'uploading' },
  },
  {
    access: 'private',
    contentType: 'video/quicktime',
    createdAt: '2026-11-25T09:58:00.000Z',
    createdById: 'beatriz',
    id: 'upload-2',
    kind: 'file',
    linkedTo: null,
    name: 'Vídeo da vistoria.mov',
    pinned: false,
    size: '6,2 GB',
    upload: {
      error: 'O arquivo não cabe no seu espaço de armazenamento.',
      status: 'failed',
    },
  },
]

export const savedViews = [
  { id: 'contracts', label: 'Contratos do escritório' },
  { id: 'evidence', label: 'Provas em mídia' },
]

export const pageSize = 5

export interface Documents3Query {
  search: string
  sort: Documents3Sort | null
  typeFilter: readonly Documents3Type[]
  view: Documents3View
}

export interface Documents3Page {
  counts: Record<Documents3View, number>
  items: Documents3Record[]
  total: number
}

const inView = (view: Documents3View, item: Documents3Record) => {
  const types = documents3ViewTypes[view]
  return types.length === 0 || types.includes(documents3TypeOf(item))
}

const byNewest = (a: Documents3Record, b: Documents3Record) =>
  b.createdAt.localeCompare(a.createdAt)

export function queryDocuments(
  items: readonly Documents3Record[],
  { search, sort, typeFilter, view }: Documents3Query,
): Documents3Record[] {
  const needle = search.trim().toLocaleLowerCase('pt-BR')
  return items
    .filter(
      (item) =>
        inView(view, item) &&
        (typeFilter.length === 0 ||
          typeFilter.includes(documents3TypeOf(item))) &&
        item.name.toLocaleLowerCase('pt-BR').includes(needle),
    )
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR')
      if (sort === 'oldest') return byNewest(b, a)
      return byNewest(a, b)
    })
}

export const countDocuments = (
  items: readonly Documents3Record[],
): Record<Documents3View, number> =>
  Object.fromEntries(
    documents3Views.map((view) => [
      view,
      items.filter((item) => inView(view, item)).length,
    ]),
  ) as Record<Documents3View, number>
