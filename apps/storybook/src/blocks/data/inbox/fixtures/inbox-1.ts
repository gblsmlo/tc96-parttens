import {
  type Inbox1Category,
  type Inbox1Entry,
  type Inbox1Kind,
  type Inbox1OriginColors,
  type Inbox1ReadFilter,
  type Inbox1ReceivedFilter,
  type Inbox1Sort,
  inbox1Categories,
  inbox1KindsByCategory,
} from '@tc96/ui/blocks/data/inbox/inbox-1'

export interface Inbox1FixtureEntry extends Inbox1Entry {
  minutesAgo: number
}

export interface Inbox1Query {
  category?: Inbox1Category | null
  cursor?: number
  kind?: Inbox1Kind | null
  read?: Inbox1ReadFilter | null
  received?: Inbox1ReceivedFilter | null
  sort?: Inbox1Sort
}

export interface Inbox1Page {
  items: Inbox1FixtureEntry[]
  nextCursor: number | null
  total: number
}

export const pageSize = 6

export const memberCategories: readonly Inbox1Category[] =
  inbox1Categories.filter((category) => category !== 'monitoring')

export const originColors: Inbox1OriginColors = {
  deadline: 'var(--color-orange-700)',
  monitoring: 'var(--color-slate-500)',
  movement: 'var(--color-teal-700)',
  publication: 'var(--color-violet-600)',
  task: 'var(--color-blue-600)',
}

export const entries: Inbox1FixtureEntry[] = [
  {
    due: { label: '27 nov. · em 2 dias', tone: 'neutral' },
    id: 'inb-01',
    kind: 'task-assigned',
    minutesAgo: 5,
    origin: 'task',
    read: false,
    reason: 'Atribuída a você',
    received: 'há 5 minutos',
    receivedHint: 'Recebida em 25/11/2026 às 14:27',
    title: 'Revisar minuta do contrato social da Padaria Trigo Bom',
  },
  {
    due: { label: 'Data fatal 25 nov. · hoje', tone: 'attention' },
    id: 'inb-02',
    kind: 'deadline-fatal',
    minutesAgo: 18,
    origin: 'deadline',
    read: false,
    reason: 'Data fatal',
    received: 'há 18 minutos',
    receivedHint: 'Recebida em 25/11/2026 às 14:14',
    title: 'Contestação da reclamação trabalhista de ex-motorista',
  },
  {
    due: null,
    id: 'inb-03',
    kind: 'publication',
    minutesAgo: 42,
    origin: 'publication',
    read: false,
    reason: 'Disponibilizada em 24 nov.',
    received: 'há 42 minutos',
    receivedHint: 'Recebida em 25/11/2026 às 13:50',
    title: 'Intimação no processo 0812345-67.2026.8.26.0100',
  },
  {
    due: { label: 'Data fatal 24 nov. · venceu', tone: 'error' },
    id: 'inb-04',
    kind: 'deadline-at-risk',
    minutesAgo: 64,
    origin: 'deadline',
    read: false,
    reason: 'Em risco',
    received: 'há 1 hora',
    receivedHint: 'Recebida em 25/11/2026 às 13:28',
    title: 'Réplica na ação de cobrança contra fornecedor de farinha',
  },
  {
    due: null,
    id: 'inb-05',
    kind: 'movement',
    minutesAgo: 125,
    origin: 'movement',
    read: true,
    reason: 'Ocorrida em 24 nov.',
    received: 'há 2 horas',
    receivedHint: 'Recebida em 25/11/2026 às 12:27',
    title: 'Juntada de petição no processo 1004567-12.2026.8.26.0002',
  },
  {
    due: { label: '25 nov. · hoje', tone: 'attention' },
    id: 'inb-06',
    kind: 'task-due',
    minutesAgo: 190,
    origin: 'task',
    read: false,
    reason: 'Vencendo',
    received: 'há 3 horas',
    receivedHint: 'Recebida em 25/11/2026 às 11:22',
    title: 'Enviar planilha de cálculos à TransVale Logística',
  },
  {
    due: null,
    id: 'inb-07',
    kind: 'failure-opened',
    minutesAgo: 150,
    origin: 'monitoring',
    read: false,
    reason: 'Requer atenção desde 23 nov.',
    received: 'há 2 horas',
    receivedHint: 'Recebida em 25/11/2026 às 12:02',
    title: 'Captura de publicações do TJSP interrompida',
  },
  {
    due: { label: 'Data interna 28 nov. · em 3 dias', tone: 'neutral' },
    id: 'inb-08',
    kind: 'deadline-internal',
    minutesAgo: 1510,
    origin: 'deadline',
    read: true,
    reason: 'Data interna',
    received: 'há 1 dia',
    receivedHint: 'Recebida em 24/11/2026 às 13:22',
    title: 'Apelação na ação revisional de aluguel',
  },
  {
    due: { label: 'Data fatal 2 dez. · em 7 dias', tone: 'neutral' },
    id: 'inb-09',
    kind: 'deadline-stalled',
    minutesAgo: 2900,
    origin: 'deadline',
    read: false,
    reason: 'Parado',
    received: 'há 2 dias',
    receivedHint: 'Recebida em 23/11/2026 às 14:12',
    title: 'Embargos de declaração na execução fiscal municipal',
  },
  {
    due: null,
    id: 'inb-10',
    kind: 'publication',
    minutesAgo: 4400,
    origin: 'publication',
    read: true,
    reason: 'Disponibilizada em 22 nov.',
    received: 'há 3 dias',
    receivedHint: 'Recebida em 22/11/2026 às 13:12',
    title: 'Sentença publicada no processo 5001234-88.2026.4.03.6100',
  },
  {
    due: { label: '3 dez.', tone: 'neutral' },
    id: 'inb-11',
    kind: 'task-assigned',
    minutesAgo: 5800,
    origin: 'task',
    read: true,
    reason: 'Atribuída a você',
    received: 'há 4 dias',
    receivedHint: 'Recebida em 21/11/2026 às 13:52',
    title: 'Preparar audiência de conciliação da Mercearia Vila Nova',
  },
  {
    due: null,
    id: 'inb-12',
    kind: 'movement',
    minutesAgo: 7300,
    origin: 'movement',
    read: false,
    reason: 'Ocorrida em 20 nov.',
    received: 'há 5 dias',
    receivedHint: 'Recebida em 20/11/2026 às 12:52',
    title: 'Conclusos para decisão no processo 0023456-90.2026.5.02.0011',
  },
  {
    due: { label: 'Data fatal 20 nov. · venceu', tone: 'error' },
    id: 'inb-13',
    kind: 'deadline-fatal',
    minutesAgo: 13000,
    origin: 'deadline',
    read: true,
    reason: 'Data fatal',
    received: 'há 9 dias',
    receivedHint: 'Recebida em 16/11/2026 às 13:52',
    title: 'Contrarrazões ao recurso inominado da Clínica Sorriso',
  },
  {
    due: null,
    id: 'inb-14',
    kind: 'failure-opened',
    minutesAgo: 21600,
    origin: 'monitoring',
    read: true,
    reason: 'Requer atenção desde 10 nov.',
    received: 'há 15 dias',
    receivedHint: 'Recebida em 10/11/2026 às 14:32',
    title: 'Captura de movimentações do TRT-2 com falha',
  },
]

export const failureForMember =
  'Peça a um administrador para conferir o cadastro da OAB'

export function asMember(
  source: readonly Inbox1FixtureEntry[],
): Inbox1FixtureEntry[] {
  return source.map((entry) =>
    entry.kind === 'failure-opened'
      ? {
          ...entry,
          openable: false,
          reason: `${entry.reason} · ${failureForMember}`,
        }
      : entry,
  )
}

export function withReadState(
  source: readonly Inbox1FixtureEntry[],
  marks: ReadonlyMap<string, boolean>,
): Inbox1FixtureEntry[] {
  if (marks.size === 0) return [...source]
  return source.map((entry) => {
    const read = marks.get(entry.id)
    return read === undefined ? entry : { ...entry, read }
  })
}

export function unreadCounts(
  source: readonly Inbox1FixtureEntry[],
): Partial<Record<'all' | Inbox1Category, number>> {
  const unread = source.filter((entry) => !entry.read)
  return Object.fromEntries([
    ['all', unread.length],
    ...inbox1Categories.map((category) => [
      category,
      unread.filter((entry) =>
        (inbox1KindsByCategory[category] as readonly Inbox1Kind[]).includes(
          entry.kind,
        ),
      ).length,
    ]),
  ])
}

const receivedLimit = {
  last30: 30 * 24 * 60,
  last7: 7 * 24 * 60,
  today: 15 * 60,
} as const satisfies Record<Inbox1ReceivedFilter, number>

const comparators = {
  newest: (a: Inbox1FixtureEntry, b: Inbox1FixtureEntry) =>
    a.minutesAgo - b.minutesAgo,
  oldest: (a: Inbox1FixtureEntry, b: Inbox1FixtureEntry) =>
    b.minutesAgo - a.minutesAgo,
  unread: (a: Inbox1FixtureEntry, b: Inbox1FixtureEntry) =>
    Number(a.read) - Number(b.read) || a.minutesAgo - b.minutesAgo,
} as const satisfies Record<
  Inbox1Sort,
  (a: Inbox1FixtureEntry, b: Inbox1FixtureEntry) => number
>

export function readInbox(
  source: readonly Inbox1FixtureEntry[],
  {
    category = null,
    cursor = 0,
    kind = null,
    read = null,
    received = null,
    sort = 'newest',
  }: Inbox1Query = {},
): Inbox1Page {
  const kinds: readonly Inbox1Kind[] | null = category
    ? inbox1KindsByCategory[category]
    : null
  const kindFilter = kind && (!kinds || kinds.includes(kind)) ? kind : null
  const matching = source
    .filter((entry) => !kinds || kinds.includes(entry.kind))
    .filter((entry) => !kindFilter || entry.kind === kindFilter)
    .filter((entry) => !read || entry.read === (read === 'read'))
    .filter((entry) => !received || entry.minutesAgo < receivedLimit[received])
    .sort(comparators[sort])
  const end = cursor + pageSize
  return {
    items: matching.slice(cursor, end),
    nextCursor: end < matching.length ? end : null,
    total: matching.length,
  }
}
